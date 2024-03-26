import { Router } from "express";
import controller from "../controllers/controller";
import AuthRouter from "./auth.router";

const router = Router();
controller(router, AuthRouter);
export default router;