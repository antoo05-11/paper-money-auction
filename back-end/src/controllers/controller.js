import _ from "lodash";
import auth from "../middlewares/auth";
import error from "../constants/error.code";

export default function (router, apis) {
    apis.forEach((element) => {
        const controller = new element.controller();
        element.methods.forEach((e) => {
            const httpMethod = e.httpMethod;
            const path = e.path;
            const method = e.method;
            const roles = e.roles;
            if (_.isEmpty(roles)) {
                router[httpMethod](`${path}`, catchAsync(controller, method));
            } else {
                router[httpMethod](
                    `${path}`,
                    auth(roles),
                    catchAsync(controller, method)
                );
            }
        });
    });
}

const catchAsync = (controller, method) => async (req, res, next) => {
    try {
        const body = _.cloneDeep(req.body);
        delete body.password;
        await controller[method](req, res, next);
    } catch (e) {
        res.status(e.status || 500).json({
            code: e.code || error.INTERNAL_SERVER_ERROR.code,
            message: e.message || error.INTERNAL_SERVER_ERROR.message,
        });
    }
};
