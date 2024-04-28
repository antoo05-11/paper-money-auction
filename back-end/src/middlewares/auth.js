import jwt from "jsonwebtoken";
import { User } from "../models/user";
import error from "../constants/error.code";

const auth = (roles, verified) => async (req, res, next) => {
    const authorization = req.headers.authorization;

    if (authorization && authorization.startsWith("Bearer ")) {
        const token = authorization.slice("Bearer ".length);
        const secret = process.env.SECRET;
        if (token) {
            try {
                jwt.verify(token, secret, async function (err, payload) {
                    if (payload) {
                        req.payload = payload;
                        const user = await User.findById(payload.id);

                        if (
                            roles &&
                            roles.length &&
                            !roles.includes(payload.role) &&
                            !roles.includes("all") &&
                            !roles.includes("ALL")
                        ) {
                            return res.status(403).json({
                                ok: false,
                                ...error.AUTH.ROLE_INVALID,
                            });
                        }

                        if (!user || !user.active) {
                            res.status(403).json({
                                ...error.AUTH.USER_DELETED,
                            });
                        }

                        if (verified && !user.verified) {
                            res.status(403).json({
                                ...error.USER.NOT_VERIFIED,
                            });
                        }

                        req.user = user;
                        next();
                    } else {
                        if (err && err.name === "TokenExpiredError") {
                            res.status(403).json({
                                ...error.AUTH.TOKEN_EXPIRED,
                            });
                        } else {
                            res.status(403).json({
                                ...error.AUTH.TOKEN_INVALID,
                            });
                        }
                    }
                });
            } catch (err) {
                res.status(403).json({
                    ...error.AUTH.TOKEN_INVALID,
                });
            }
        } else {
            res.status(403).json(error);
        }
    } else {
        res.status(403).json({
            ...error.AUTH.TOKEN_NOT_FOUND,
        });
    }
};
export default auth;
