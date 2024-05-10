import _ from "lodash";
import auth from "../middlewares/auth";
import errorCatch from "../middlewares/error.catch";
import validate from "../middlewares/validate";
import upload from "../middlewares/file.upload";
import {writeActivityLog} from "../middlewares/log.write";

export default function (router, apis) {
    apis.forEach((element) => {
        const controller = new element.controller();
        element.methods.forEach((e) => {
            const httpMethod = e.httpMethod;
            const path = e.path;
            const method = e.method;
            const roles = e.roles;
            const verified = e.verified;
            const schema = e.schema;
            const files = e.files;
            const initialLog = e.initialLog;

            const middlewares = [];
            if (!_.isEmpty(roles)) {
                middlewares.push(auth(roles, verified));
            }

            if (!_.isEmpty(files)) {
                middlewares.push(upload.fields(files));
            }

            if (!_.isEmpty(schema)) {
                middlewares.push(validate(schema));
            }

            if (initialLog) {
                middlewares.push(writeActivityLog(initialLog));
            }

            middlewares.push(errorCatch(controller, method));
            router[httpMethod](`${path}`, middlewares);
        });
    });
}
