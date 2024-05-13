import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import morgan from "morgan";
import router from "./routers/index";
import { socketService } from "./services/socket.service";
import { mailService } from "./services/mail.service";
import { ftpService } from "./services/ftp.service";
import mailSchedule from "./services/mail.schedule";
import errorHandle from "./middlewares/error.handle";

// Load .env variables
dotenv.config();
process.env.TZ = "Asia/Ho_Chi_Minh";
const PORT = process.env.PORT || 5050;
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to database server.
mongoose
    .connect(DATABASE_URL)
    .then(() => {
        console.log("Server message: Database connected.");
    })
    .catch((error) => {
        console.log("Server message: Database connecting error: ", error);
    });

// Init Express App
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));
app.use("/api", router);
app.use(errorHandle);

app.use((req, res) => {
    res.status(200).json({
        message: "Welcome to Paper Money Auction server!!!",
        information:
            "This server is a part of Object Oriented Analysis and Design Course in UET, VNU.",
        project_contributors:
            "Ngũ Thành An, Nguyễn Trần Gia Bảo, Đỗ Minh Duy, Phạm Xuân Bách, Đỗ Đức Anh",
    });
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, () => {
    console.log(`Server message: Server started running on port ${PORT}.`);
});

//Init app services
mailService.init();
socketService.init(httpServer);
ftpService.init();

// Send request to activate server.
const https = require("https");

function makeRequest() {
    https
        .get(process.env.ACTIVATE_SERVER_URL, (res) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });

            res.on("end", () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log("Server message: Activate server connected.");
                } catch (error) {
                    console.error("Server message: Error parsing JSON:", error);
                }
            });
        })
        .on("error", (err) => {
            console.log("Server message: Error: " + err.message);
        });
}

makeRequest();
setInterval(makeRequest, 600000);
