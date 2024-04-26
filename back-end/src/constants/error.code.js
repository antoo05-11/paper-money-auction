export default {
    AUTH: {
        TOKEN_NOT_FOUND: {
            code: "TOKEN_NOT_FOUND",
            message: "Login required.",
        },
        TOKEN_EXPIRED: {
            code: "TOKEN_EXPIRED",
            message: "Token expired.",
        },
        TOKEN_INVALID: {
            code: "TOKEN_INVALID",
            message: "Token cannot be authenticated.",
        },
        ROLE_INVALID: {
            code: "ROLE_INVALID",
            message: "Your role does not have permission for this function.",
        },
        USER_EXPIRED: {
            code: "USER_EXPIRED",
            message: "Account has expired.",
        },
        USER_DELETED: {
            code: "USER_DELETED",
            message: "Account has been deleted from the system.",
        },
        TOKEN_BLOCKED: {
            code: "TOKEN_BLOCKED",
            message:
                "Account has just changed the password or has been kicked.",
        },
        USER_NOT_FOUND: {
            code: "USER_NOT_FOUND",
            message: "Your account is not in the system.",
        },
        INVALID_AUTH_CODE: {
            code: "INVALID_AUTH_CODE",
            message: "Your auth code is incorrect or expired.",
        },
        PASSWORD_INVALID: {
            code: "PASSWORD_INVALID",
            message: "Your password or your username is incorrect.",
        },
    },

    AUCTION: {
        INVALID_TOKEN: {
            code: "INVALID_AUCTION_TOKEN",
            message: "Token used for auction session is invalid!",
        },
        NOT_FOUND: {
            code: "AUCTION_NOT_FOUND",
            message: "Your auction is not in the system.",
        },
        NOT_TIME_YET: {
            code: "NOT_TIME_YET",
            message: "Your auction cannot be opened now.",
        },
        NOT_ON_GOING: {
            code: "AUCTION_NOT_ON_GOING",
            message: "Your auction is not not on going.",
        },
        BIDDING: {
            TOO_QUICK: {
                code: "BIDDING_ERROR",
                message: "Your bidding is too quick.",
            },
            NOT_BIG_ENOUGH: {
                code: "BIDDING_ERROR",
                message: "Your bidding price is not big enough.",
            }
        }
    },

    ASSET: {
        NOT_FOUND: {
            code: "ASSET_NOT_FOUND",
            message: "Your asset is not in the system.",
        },
    },

    PARAMS_INVALID: {
        code: "PARAMS_INVALID",
    },

    URL_NOT_FOUND: {
        code: "URL_NOT_FOUND",
        message: "URL not found.",
    },

    INTERNAL_SERVER_ERROR: {
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error.",
    },
};
