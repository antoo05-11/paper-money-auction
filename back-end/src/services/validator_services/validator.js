import errorCode from "../../constants/error.code";

export const getValidateResult = (schema, data) => {
    const {error} = schema.validate(data);
    if (error) {
        return {
            ...errorCode.PARAMS_INVALID,
            message: error.details.map((detail) => {
                return detail.message.replaceAll("\"", "");
            })
        }
    }
    return null;
}