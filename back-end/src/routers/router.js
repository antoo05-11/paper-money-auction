import { Router } from "express";
import controller from "../controllers/controller";
import authRouter from "./auth.router";
import userRouter from "./user.router";

const router = Router();
controller(router, authRouter);
controller(router, userRouter);
export default router;