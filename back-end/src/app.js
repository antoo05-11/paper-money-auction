import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import dotenv from "dotenv";
import mongoose from "mongoose";
import errorCode from "./constants/error.code";
import router from "./routers/router";
import User from "./schema/user/user.js";

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
app.use((req, res, next) => {
    res.status(404).json({
        ...errorCode.URL_NOT_FOUND,
    });
});

const httpServer = http.createServer(app);
httpServer.listen(PORT, HOSTNAME, () => {
    console.log(`Server started running at ${HOSTNAME}:${PORT}`);
});

// Test schema
app.get('/test', async (req, res) => {
    const sampleUser = new User({
        role: 'user', // Vai trò của người dùng
        name: 'John Doe1', // Tên của người dùng
        phone: '0123456788', // Số điện thoại (đã unique)
        password: 'password123', // Mật khẩu
        email: 'john@example.com1', // Địa chỉ email (đã unique)
        address: '123 Main Street, City, Country', // Địa chỉ
        balance: 1000 // Số dư tài khoản
    });

    let user = await sampleUser.save();
    if (user) {
        return res.status(200).json(user);
    }
    return res.status(400).json();

});
