import {Service} from "./service";

const PromiseFtp = require('promise-ftp');

class FtpService extends Service {
    #fileServerUrl
    #ftpClient

    constructor() {
        super();

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