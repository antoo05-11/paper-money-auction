import { Router } from "express";
import controller from "../controllers/controller";
import AuthRouter from "./auth.router";
import AuctionSessionRouter from "./auction_session.router";

const router = Router();
controller(router, AuthRouter);
controller(router, AuctionSessionRouter);
export default router;