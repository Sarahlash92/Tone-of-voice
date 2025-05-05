import { Request, Response } from "express";
import { analyzeToneOfVoice } from "../services/toneAnalysis.service";

export const analyzeToneController = async (_req: Request, res: Response) => {
  try {
    const result = await analyzeToneOfVoice();
    res.status(200).json(result);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};
