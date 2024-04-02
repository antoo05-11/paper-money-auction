import error from "../constants/error.code";
import {User} from "../models/user";
import {HttpError} from "../utils/http.error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {authValidator} from "../services/validator_services/auth.validator";
import {mailService} from "../services/mail.service";
import {utils} from "../utils/utils";


export default class AuthController {
    #userAuthCodes
    static AUTH_CODE_LIVE_TIME_MLS = (5 * 60 * 1000)
    static CHECK_INTERVAL_MLS = 5000

    constructor() {
        this.#userAuthCodes = new Map();
        setInterval(this.#removeExpiredCodes.bind(this), AuthController.CHECK_INTERVAL_MLS);
    }

    login = async (req, res) => {
        const {body} = req;
        const data = body.data;

        // Validate schema of request body.
        const data_error = authValidator.login_validate(data);
        if (data_error) throw new HttpError({...data_error, status: 400});

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
        this.#userAuthCodes.set(data.email, {
            code: utils.genNumeralCode(CODE_LENGTH),
            createdAt: Date.now()
        });
        await mailService.send2FACode(data.email, this.#userAuthCodes.get(data.email).code);

        return res.status(200).json({
            code: {}, message: 'Open your mail box to get 2FA code.'
        });
    };

    authenticateLogin = async (req, res) => {
        const {body} = req;
        const data = body.data;

        // Validate schema of request body.
        const data_error = authValidator.authenticate_validate(data);
        if (data_error) throw new HttpError({...data_error, status: 400});

        // Check authentic code match server data.
        if (data.authenticCode !== this.#userAuthCodes.get(data.email).code) {
            throw new HttpError({...error.AUTH.INVALID_AUTH_CODE, status: 400});
        }

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

    #removeExpiredCodes = () => {
        for (const [email, authData] of this.#userAuthCodes.entries()) {
            if (authData.createdAt + AuthController.AUTH_CODE_LIVE_TIME_MLS < Date.now()) {
                this.#userAuthCodes.delete(email);
            }
        }
    }
}
