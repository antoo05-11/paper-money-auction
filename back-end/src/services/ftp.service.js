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

    #reconnect = () => {
        const RECONNECT_ATTEMPT = 3;
        this.#ftpClient.reconnect(RECONNECT_ATTEMPT);
    }

    uploadFile = async (files) => {
        this.#reconnect();
        for (const fileKey in files) {
            const file = files[fileKey];
            const remotePath = process.env.FTP_URL + file.name;

            await this.#ftpClient.put(file.data, remotePath);
        }
        await this.#ftpClient.end();
    }
}

export const ftpService = Object.freeze(new FtpService())