import {Service} from "./service";
import * as path from "node:path";

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
            autoReconnect: true,
            keepalive: 1000
        })
            .then((serverMessage) => {
                console.log('Server message: ' + serverMessage);
            });
    }

    uploadFiles = async (files, nameIdMap, remoteDir) => {
        try {
           await this.#ftpClient.reconnect();
        } catch (e) {
            console.log(e);
        }
        for (const fileKey in files) {
            const file = files[fileKey];
            const remotePath = remoteDir + nameIdMap.get(file.originalname) + path.extname(file.originalname);
            await this.#ftpClient.put(file.buffer, remotePath);
        }
    }
}

export const ftpService = Object.freeze(new FtpService())