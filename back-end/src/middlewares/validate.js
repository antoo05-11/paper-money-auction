import errorCode from "../constants/error.code";

export default (schema) => (req, res, next) => {
    const { body } = req;

    // For testing of Postman
    if (typeof body.data === "string") body.data = JSON.parse(body.data);

    const { error } = schema.validate(body.data);
    if (error) {
        return res.status(400).json({
            ok: false,
            ...errorCode.PARAMS_INVALID,
            message: error.details
                .map((detail) => detail.message.replaceAll('"', ""))
                .join(", "),
        });
    }

    next();
};
