import nodemailer from 'nodemailer';
import {Service} from "./service";

let instance;

class MailService extends Service {
    #transporter
    #config

    constructor() {
        super();
        if (instance) {
            throw new Error("Mail Service must be constructed only one time!");
        }
        instance = this;

        this.#config = {
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_APP_PASSWORD
            }
        };
        this.#transporter = nodemailer.createTransport(this.#config);
    }

    sendPasswordToNewUserMail = async (mailAddress, password) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: 'Welcome to our Paper Money Auction System!',
            text: `Here is your new password: ${password}. Thanks!`
        };
        await this.#transporter.sendMail(mailOption);
    };

    sendMailVerifiedCode = async (mailAddress, code) => {
        const mailOption = {
            from: this.#config.auth.user,
            to: mailAddress,
            subject: 'Change password for Paper Money Auction account!',
            text: `To change your password, enter this code to verifying box: ${code}. Thanks!`
        };
        await this.#transporter.sendMail(mailOption);
    }
}

export const mailService = Object.freeze(new MailService());