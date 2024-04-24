export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    VALIDATION: 422,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
    EXCEPTION: 500,
    OVER_EXPORT_LIMIT_LINES: 445,
    MAINTAIN_MODE: 246
}

export const AUTH = {
    TOKEN_NOT_FOUND: {
        code: "TOKEN_NOT_FOUND",
    },
    TOKEN_EXPIRED: {
        code: "TOKEN_EXPIRED",
    },
    TOKEN_INVALID: {
        code: "TOKEN_INVALID",
    },
    ROLE_INVALID: {
        code: "ROLE_INVALID",
    },
    USER_EXPIRED: {
        code: "USER_EXPIRED",
    },
    USER_DELETED: {
        code: "USER_DELETED",
    },
    TOKEN_BLOCKED: {
        code: "TOKEN_BLOCKED",
    },
    USER_NOT_FOUND: {
        code: "USER_NOT_FOUND",
    },
    INVALID_AUTH_CODE: {
        code: "INVALID_AUTH_CODE",
    },
    PASSWORD_INVALID: {
        code: "PASSWORD_INVALID",
    }
}
