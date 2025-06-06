// backend/server/index.js
import express from "express";
import cors from "cors";
import { generateInsightsForUser } from "./openaiClient.js";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

/**
 * GET /api/users
 * Returns all user IDs from frontend/src/assets/data/users.json
 * http://localhost:3000/api/users
 */
app.get("/api/users", async (req, res) => {
  try {
    // Compute __dirname here as well
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const jsonPath = join(
      __dirname,
      "..",  // backend
      "..",  // RecoAI
      "frontend",
      "src",
      "assets",
      "data",
      "users.json"
    );
    const fileText = await readFile(jsonPath, "utf-8");
    const allUsers = JSON.parse(fileText);
    const userIds = Object.keys(allUsers);
    return res.json({ users: userIds });
  } catch (err) {
    console.error("Error in /api/users:", err);
    return res.status(500).json({ error: "Could not load users.json" });
  }
});

/**
 * GET /api/reasoning?userId=<userId>
 * Returns { reasoning: <text> } for the given userId.
 * Caches per‐user so each user triggers only one OpenAI call.
 * http://localhost:3000/api/reasoning?userId=User%20%23EC001
 * 
 */
app.get("/api/reasoning", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing required query param: userId" });
  }
  try {
    const { reasoning } = await generateInsightsForUser(userId);
    return res.json({ reasoning });
  } catch (err) {
    console.error(`Error in /api/reasoning for userId=${userId}:`, err);
    return res.status(500).json({ error: err.message || "OpenAI request failed" });
  }
});

/**
 * GET /api/key-factors?userId=<userId>
 * Returns { keyFactors: <text> } for the given userId.
 * http://localhost:3000/api/key-factors?userId=User%20%23EC001
 */
app.get("/api/key-factors", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: "Missing required query param: userId" });
  }
  try {
    const { keyFactors } = await generateInsightsForUser(userId);
    return res.json({ keyFactors });
  } catch (err) {
    console.error(`Error in /api/key-factors for userId=${userId}:`, err);
    return res.status(500).json({ error: err.message || "OpenAI request failed" });
  }
});

// (Optional) a simple health check
app.get("/api/hello", (req, res) => {
  return res.json({
    message: "Server is up. Use /api/users, /api/reasoning, or /api/key-factors.",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
