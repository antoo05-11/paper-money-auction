import error from "../constants/error.code";
import {User} from "../models/user";
import {HttpError} from "../utils/http.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {mailService} from "../services/mail.service";
import {utils} from "../utils/utils";
import NodeCache from "node-cache";


export default class AuthController {
    static AUTH_CODE_LIVE_TIME_S = 5 * 60;

    #userAuthCodesCache = new NodeCache({stdTTL: AuthController.AUTH_CODE_LIVE_TIME_S, checkperiod: 120});

    constructor() {
    }

    login = async (req, res) => {
        const {body} = req;
        const data = body.data;

        // Checking user existence.
        const user = await User.findOne({
            email: data.email,
        });
        if (!user)
            throw new HttpError({...error.AUTH.USER_NOT_FOUND, status: 400});

        // Check encrypted password matched with database.
        if (!bcrypt.compareSync(data.password, user.password))
            throw new HttpError({
                ...error.AUTH.PASSWORD_INVALID,
                status: 400,
            });

        // Generate 2FA code, save it temporarily and send to user mail box.
        const CODE_LENGTH = 6;

        this.#userAuthCodesCache.set(data.email, utils.genNumeralCode(CODE_LENGTH));
        await mailService.send2FACode(
            data.email,
            this.#userAuthCodesCache.get(data.email)
        );

        // Log 2FA code for testing
        console.log(this.#userAuthCodesCache.get(data.email));

        return res.status(200).json({
            ok: true,
            message: "Open your mail box to get 2FA code.",
        });
    };

    authenticateLogin = async (req, res) => {
        const {body} = req;
        const data = body.data;

        // Check authentic code match server data and remove in codes map.
        if (data.authenticCode !== this.#userAuthCodesCache.get(data.email)) {
            throw new HttpError({
                ...error.AUTH.INVALID_AUTH_CODE,
                status: 400,
            });
        }
        this.#userAuthCodesCache.del(data.email);

        // Checking user existence.
        const user = await User.findOne({
            email: data.email,
        });
        if (!user)
            throw new HttpError({...error.AUTH.USER_NOT_FOUND, status: 400});

        // Generate a JWT token for user.
        const payload = {
            id: user._id.toString(),
            name: user.name,
            role: user.role,
        };
        const token = jwt.sign(payload, process.env.SECRET, {
            expiresIn: "1d",
        });

        return res.status(200).json({
            data: {
                token: `Bearer ${token}`,
                user: {
                    ...payload,
                }
            }
        });
    }

    sendCode = async (req, res) => {
        const {user} = req;

        const CODE_LENGTH = 6;
        this.#userAuthCodesCache.set(user.email, utils.genNumeralCode(CODE_LENGTH));

        await mailService.sendCodeToVerifyAccount(
            user.email,
            this.#userAuthCodesCache.get(user.email)
        );

        // Log the code for tesing
        console.log(this.#userAuthCodesCache.get(user.email));

        return res.status(200).json({
            ok: true,
            message: "Open your mail box to get verification code.",
        });
    };

    verifyCode = async (req, res) => {
        const {user} = req;
        const {data} = req.body;

        // Check authentic code match server data and remove in codes map.
        if (data.code !== this.#userAuthCodesCache.get(user.email)) {
            throw new HttpError({
                ...error.AUTH.INVALID_AUTH_CODE,
                status: 400,
            });
        }
        this.#userAuthCodesCache.del(user.email);

        user.verified = true;
        await user.save();

        res.status(200).json({
            ok: true,
            message: "Your account is now verified",
        });
    };
}
