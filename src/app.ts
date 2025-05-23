import express from "express";
import dotenv from "dotenv";
import toneRoutes from "./routes/toneOfVoice.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", toneRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
