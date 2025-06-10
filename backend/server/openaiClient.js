// backend/server/openaiClient.js
import OpenAI from "openai";
import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// ─── Compute __dirname in ES module ───────────────────────────────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Initialize OpenAI client with env var ───────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

//
// ─── LOAD ALL USERS’ DATA ONCE ─────────────────────────────────────────────────
//
let allUserData = null;
async function loadAllUserData() {
  if (allUserData) return allUserData;

  const jsonPath = join(__dirname, "api", "users.json");
  const fileText = await readFile(jsonPath, "utf-8");
  allUserData = JSON.parse(fileText);
  return allUserData;
}

//
// ─── IN-MEMORY CACHE PER USER ───────────────────────────────────────────────────
//
const cachedInsightsByUser = {};

/**
 * generateInsightsForUser(userId)
 */
export async function generateInsightsForUser(userId) {
  const data = await loadAllUserData();

  if (!data[userId]) {
    throw new Error(`User ID "${userId}" not found in users.json`);
  }

  if (cachedInsightsByUser[userId]) {
    return cachedInsightsByUser[userId];
  }

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

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [systemMessage, userMessage],
    temperature: 0.3,
    max_tokens: 150,
  });

  // const fullText = response.choices[0].message.content.trim();
  // const splitMarker = "\n\nKey Factors:";
  // const [reasonPart, keyPartWithLabel] = fullText.split(splitMarker);

  // const reasoningOnly = reasonPart.replace(/^\s*Reasoning:\s*/i, "").trim();
  // let keyFactorsOnly = "";
  // if (keyPartWithLabel) {
  //   keyFactorsOnly = keyPartWithLabel.replace(/^\s*Key Factors:\s*/i, "").trim();
  // }

  const fullText = response.choices[0].message.content.trim();

// ─── Robust section parsing via RegExp ──────────────────────────────────────
// Improved section parsing via RegExp (handles Markdown bold, extra whitespace, etc.)
  const sectionRegex = /(?:\*\*)?\s*Reasoning\s*:?\s*(?:\*\*)?\s*([\s\S]*?)(?:\n{2,}|$)(?:\*\*)?\s*Key\s*Factors\s*:?\s*(?:\*\*)?\s*([\s\S]*)/i;
  const match = fullText.match(sectionRegex);

  if (!match) {
    throw new Error("Failed to parse OpenAI response into sections.");
  }

  const reasoningOnly  = match[1].trim();
  const keyFactorsOnly = match[2].trim();






  cachedInsightsByUser[userId] = {
    reasoning: reasoningOnly,
    keyFactors: keyFactorsOnly,
  };
  return cachedInsightsByUser[userId];
}
