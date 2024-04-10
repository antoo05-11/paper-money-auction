import errorCode from "../constants/error.code.js";

export default (err, req, res, next) => {
    console.log(err);

    res.status(err.status || 500).json({
        ok: false,
        code: err.code || errorCode.INTERNAL_SERVER_ERROR.code,
        message: err.message || errorCode.INTERNAL_SERVER_ERROR.message,
    });
};
