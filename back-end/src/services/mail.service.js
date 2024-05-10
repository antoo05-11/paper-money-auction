import nodemailer from "nodemailer";
import { Service } from "./service";
import * as fs from "fs";
import * as path from "path";

class MailService extends Service {
    #transporter;
    #config;
    #mailTemplates;

    constructor() {
        super();

        this.#config = {
            service: "gmail",
            host: "smtp.gmail.com",
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_APP_PASSWORD,
            },
        };
        this.#transporter = nodemailer.createTransport(this.#config);

        this.#mailTemplates = {
            sendAuthCodeTemplate: this.#readMailTemplate(
                "send_auth_code_template.html"
            ),
            sendVerifyCodeTemplate: this.#readMailTemplate(
                "send_verify_code_template.html"
            ),
        };
    }

    #sendMessage = async (mailOption) => {
        await this.#transporter.sendMail(mailOption);
    };

    #readMailTemplate = (fileName) => {
        const fullPath = path.join(
            __dirname,
            `../../res/mail_templates/${fileName}`
        );
        return fs.readFileSync(fullPath, "utf-8");
    };

    send2FACode = async (mailAddress, code) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: "Verify your identity for Paper Money Auction System",
            html: this.#mailTemplates.sendAuthCodeTemplate.replace(
                "{{code}}",
                code
            ),
        };
        await this.#sendMessage(mailOption);
    };

    sendPasswordToNewUserMail = async (mailAddress, password) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: "Welcome to our Paper Money Auction System!",
            text: `Here is your new password: ${password}. Thanks!`,
        };
        await this.#sendMessage(mailOption);
    };

    sendCodeToChangePassword = async (mailAddress, code) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: "Change password for Paper Money Auction account!",
            text: `To change your password, enter this code to verifying box: ${code}. Thanks!`,
        };
        await this.#sendMessage(mailOption);
    };

    sendCodeToVerifyAccount = async (mailAddress, code) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: "Verification for Paper Money Auction account!",
            html: this.#mailTemplates.sendVerifyCodeTemplate.replace(
                "{{code}}",
                code
            ),
        };
        await this.#sendMessage(mailOption);
    };
}

export const mailService = Object.freeze(new MailService());
