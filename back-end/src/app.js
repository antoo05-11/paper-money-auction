import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routers/router";
import {SocketService} from "./services/auction_session/socket.js";

// Load .env variables
dotenv.config();
const PORT = process.env.PORT || 5050;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to database server.
mongoose.connect(DATABASE_URL).then(() => {
    console.log("Database Connected");
}).catch((error) => {
    console.log("Database Connecting Error", error);
});

// Init Express App
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", router);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Paper Money Auction server!!!",
        information: "This server is a part of Object Oriented Analysis and Design Course in UET, VNU.",
        project_contributors: "Ngũ Thành An, Nguyễn Trần Gia Bảo, Đỗ Minh Duy, Phạm Xuân Bách,Đỗ Đức Anh, Đỗ Minh Duy"
    });
});

const httpServer = http.createServer(app);

httpServer.listen(PORT, HOSTNAME, () => {
    const address = httpServer.address();
    console.log(`Server started running at http://${address.address}:${address.port}`);
});

// Init socket.
const socketService = new SocketService(httpServer);