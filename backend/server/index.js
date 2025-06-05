// backend/server/index.js
import express from "express";
import cors from "cors";
// (No dotenv here, since key is still hardcoded in openaiClient.js)
import { generateInsightsObject } from "./openaiClient.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ─── GET /api/hello (unchanged) ─────────────────────────────────────────────
app.get("/api/hello", (req, res) => {
  return res.json({ message: "Server is up. Use /api/reasoning or /api/key-factors." });
});

// ─── GET /api/reasoning ─────────────────────────────────────────────────────────
// Calls generateInsightsObject() (if not cached), returns only the reasoning text.
app.get("/api/reasoning", async (req, res) => {
  try {
    const { reasoning } = await generateInsightsObject();
    return res.json({ reasoning });
  } catch (err) {
    console.error("Error in /api/reasoning:", err);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
});

// ─── GET /api/key-factors ───────────────────────────────────────────────────────
// Calls generateInsightsObject() (if not cached), returns only the keyFactors text.
app.get("/api/key-factors", async (req, res) => {
  try {
    const { keyFactors } = await generateInsightsObject();
    return res.json({ keyFactors });
  } catch (err) {
    console.error("Error in /api/key-factors:", err);
    return res.status(500).json({ error: "OpenAI request failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
