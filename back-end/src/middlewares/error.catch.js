import _ from "lodash";

export default (controller, method) => async (req, res, next) => {
    try {
        const body = _.cloneDeep(req.body);
        delete body.password;
        await controller[method](req, res, next);
    } catch (err) {
        next(err);
    }
};
