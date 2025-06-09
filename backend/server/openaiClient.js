// backend/server/openaiClient.js
import OpenAI from "openai";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ─── Compute __dirname in ES module ───────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── (TEMPORARY) HARDCODED OPENAI KEY ─────────────────────────────────────────
// Remove or switch to process.env.OPENAI_API_KEY when you’re ready.
const openai = new OpenAI({
  // add api key
  apiKey: process.env.OPENAI_API_KEY
});

console.log(">>> DEBUG: Using hard-coded OPENAI_API_KEY in openaiClient.js");

//
// ─── LOAD ALL USERS’ DATA ONCE ─────────────────────────────────────────────────
// Now that __dirname is defined, we can reliably locate frontend/src/assets/data/users.json.
//
let allUserData = null;
async function loadAllUserData() {
  if (allUserData) return allUserData;

  // Build the absolute path to frontend/src/assets/data/users.json
  const jsonPath = join(
    __dirname,           // backend/server
    "..",                // backend
    "..",                // RecoAI (project root)
    "frontend",
    "src",
    "assets",
    "data",
    "users.json"
  );

  // Read and parse
  const fileText = await readFile(jsonPath, "utf-8");
  allUserData = JSON.parse(fileText);
  return allUserData;
}

//
// ─── IN-MEMORY CACHE PER USER ───────────────────────────────────────────────────
const cachedInsightsByUser = {};

/**
 * generateInsightsForUser(userId)
 *   - Loads the JSON for all users from frontend/src/assets/data/users.json.
 *   - If already cached, returns cached { reasoning, keyFactors }.
 *   - Otherwise, calls OpenAI once (strict token limits), parses, caches, and returns.
 */
export async function generateInsightsForUser(userId) {
  // 1) Load all users
  const data = await loadAllUserData();

  // 2) Validate that the userId exists
  if (!data[userId]) {
    throw new Error(`User ID "${userId}" not found in users.json`);
  }

  // 3) If cached, return immediately
  if (cachedInsightsByUser[userId]) {
    return cachedInsightsByUser[userId];
  }

  // 4) Build system + user messages with strict length constraints
  const systemMessage = {
    role: "system",
    content:
      "You are an AI Insights engine.  " +
      "Given a single e-commerce user’s purchase history and top-5 recommendations, " +
      "produce EXACTLY TWO labeled sections:\n\n" +
      "1) Reasoning: Write one short paragraph (≤50 words) that explains the **overall connection** between the user’s purchases and the recommendations. Focus on patterns in theme, format, or purpose — but **avoid listing product traits directly**.\n\n" +
      "2) Key Factors: Write exactly 3 bullet points (≤12 words each) that highlight *why these specific recommendations were made*. Focus only on patterns or traits clearly shared between purchases and recommendations. Avoid vague product benefits, lifestyle guesses, or category-level descriptions.\n\n" +
      "Make the tone friendly and engaging. Don’t use technical words or generic phrases like 'electronics improve convenience'. Output only the two sections.",
  };

  const userDataForPrompt = {
    userId,
    purchases: data[userId].purchases,
    recommendations: data[userId].recommendations,
  };

  const userMessage = {
    role: "user",
    content:
      `Here is the data for ${userId}:\n\n` +
      "```\n" +
      JSON.stringify(userDataForPrompt, null, 2) +
      "\n```\n\n" +
      "Produce your response with EXACTLY TWO sections (labeled “Reasoning:” and “Key Factors:”).",
  };

  // 5) Call OpenAI once
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [systemMessage, userMessage],
    temperature: 0.3,   // favor brevity
    max_tokens: 150,    // cap total tokens
  });

  const fullText = response.choices[0].message.content.trim();
  const splitMarker = "\n\nKey Factors:";
  const [reasonPart, keyPartWithLabel] = fullText.split(splitMarker);

  // 6) Strip labels
  const reasoningOnly = reasonPart.replace(/^\s*Reasoning:\s*/i, "").trim();
  let keyFactorsOnly = "";
  if (keyPartWithLabel) {
    keyFactorsOnly = keyPartWithLabel.replace(/^\s*Key Factors:\s*/i, "").trim();
  }

  // 7) Cache and return
  cachedInsightsByUser[userId] = {
    reasoning: reasoningOnly,
    keyFactors: keyFactorsOnly,
  };
  return cachedInsightsByUser[userId];
}
