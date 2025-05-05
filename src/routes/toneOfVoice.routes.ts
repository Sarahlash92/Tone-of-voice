import express from "express";
import { analyzeToneController } from "../controllers/toneOfVoice.controller";

const router = express.Router();

router.get("/analyze", analyzeToneController);

export default router;
