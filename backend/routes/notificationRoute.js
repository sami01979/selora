import express from "express";
import { subscribe } from "../controllers/notificationController.js";
import adminAuth from "../middleware/adminAuth.js";

const notificationRouter = express.Router();

notificationRouter.post("/subscribe", adminAuth, subscribe);

export default notificationRouter;