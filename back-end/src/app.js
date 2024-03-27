import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorCode from "./constants/error.code";
import router from "./routers/router";
import User from "./models/user.js";
import Asset from "./models/asset.js";
import { SocketService } from "./services/auction_session/socket.js";

// Load env variables
dotenv.config();
const PORT = process.env.PORT || 5050;
const HOSTNAME = process.env.HOSTNAME || "localhost";
const DATABASE_URL = process.env.DATABASE_URL;

// Connect to Database
mongoose.connect(DATABASE_URL);
const db = mongoose.connection;

db.on("error", (error) => {
    console.log("Database Connecting Error", error);
});

db.once("connected", () => {
    console.log("Database Connected");
});

// Init Epxress App
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/", router);

// app.use((req, res, next) => {
//     res.status(404).json({
//         ...errorCode.URL_NOT_FOUND,
//     });
// });

const httpServer = http.createServer(app);

httpServer.listen(PORT, HOSTNAME, () => {
    const address = httpServer.address();
    console.log(`Server started running at http://${address.address}:${address.port}`);
});

// Init socket.
const socketService = new SocketService(httpServer);