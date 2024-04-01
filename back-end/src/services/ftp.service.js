import {Service} from "./service";

let instance;
const PromiseFtp = require('promise-ftp');

class FtpService extends Service {
    #client
    #fileServerUrl
    #ftpClient

    constructor() {
        super();
        if (instance) {
            throw new Error("Mail Service must be constructed only one time!");
        }
        instance = this;

        this.#fileServerUrl = process.env.FTP_URL;
        this.#ftpClient = new PromiseFtp();
    }

    init = () => {
        this.#ftpClient.connect({
            host: process.env.FTP_HOST,
            user: process.env.FTP_USER,
            password: process.env.FTP_PASSWORD,
        })
            .then((serverMessage) => {
                console.log('Server message: ' + serverMessage);
            });
    }

    uploadFile = (fileId) => {

    }
}

export const ftpService = Object.freeze(new FtpService())