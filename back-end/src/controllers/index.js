import _ from "lodash";
import auth from "../middlewares/auth";
import errorCatch from "../middlewares/error.catch";
import validate from "../middlewares/validate";
import upload from "../middlewares/file.upload";

export default function (router, apis) {
    apis.forEach((element) => {
        const controller = new element.controller();
        element.methods.forEach((e) => {
            const httpMethod = e.httpMethod;
            const path = e.path;
            const method = e.method;
            const roles = e.roles;
            const schema = e.schema;
            const files = e.files;

            const middlewares = [];
            if (!_.isEmpty(roles)) {
                middlewares.push(auth(roles));
            }

            if (!_.isEmpty(files)) {
                middlewares.push(upload.array(files));
            }

            if (!_.isEmpty(schema)) {
                middlewares.push(validate(schema));
            }

            middlewares.push(errorCatch(controller, method));
            router[httpMethod](`${path}`, middlewares);
        });
    });
}
