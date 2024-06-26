import { Router } from "express";
import controller from "../controllers/index";
import authRouter from "./auth.router";
import userRouter from "./user.router";
import auctionRouter from "./auction.router";
import assetRouter from "./asset.router";
import transactionRouter from "./transaction.router";
import logRouter from "./log.router";

const router = Router();
controller(router, authRouter);
controller(router, userRouter);
controller(router, auctionRouter);
controller(router, assetRouter);
controller(router, transactionRouter);
controller(router, logRouter);

export default router;
