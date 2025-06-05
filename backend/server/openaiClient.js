// backend/server/openaiClient.js
import OpenAI from "openai";

// ─── (TEMPORARY) HARDCODED API KEY ────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: "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",
});

console.log(">>> DEBUG: Using hard-coded OPENAI_API_KEY in openaiClient.js");

// ─── HARDCODED USER DATA FOR User #EC048 ───────────────────────────────────────
const hardcodedUserData = {
  userId: "User #EC048",
  purchases: [
    { id: "E0068", name: "USB-C Multiport Adapter #68", category: "Electronics" },
    { id: "C0075", name: "Sports Bra #75", category: "Clothes" },
    { id: "C0044", name: "Running Shoes #44", category: "Clothes" },
    { id: "C0020", name: "Summer Dress #20", category: "Clothes" },
  ],
  recommendations: [
    { id: "E0040", name: "Action Camera 4K #40", category: "Electronics", score: 89 },
    { id: "E0064", name: "4K UHD Monitor #64", category: "Electronics", score: 75 },
    { id: "C0021", name: "Men's Slim Fit Jeans #21", category: "Clothes", score: 80 },
    { id: "C0080", name: "Summer Dress #80", category: "Clothes", score: 87 },
    { id: "C0090", name: "Summer Dress #90", category: "Clothes", score: 78 },
  ],
};

// ─── CACHE for OpenAI response (so we only call OpenAI once) ─────────────────
let cachedInsights = null;

/**
 * Call OpenAI once, parse out Reasoning / Key Factors, and cache the result.
 * Returns an object: { reasoning: string, keyFactors: string }
 */
export async function generateInsightsObject() {
  // If we've already fetched and cached, return it immediately:
  if (cachedInsights) {
    return cachedInsights;
  }

  // 1) SYSTEM MESSAGE: instruct the model to output two labeled sections
  const systemMessage = {
    role: "system",
    content:
      "You are an AI Insights engine.  " +
      "Given a single e-commerce user’s purchase history and top-5 recommendations, " +
      "produce EXACTLY TWO labeled sections:\n\n" +
      "1) Reasoning: A short paragraph (<= 50 words) explaining why these items were recommended.\n" +
      "2) Key Factors: Exactly 3 bullet points (each <= 10 words) highlighting the main observations.\n\n" +
      "Output ONLY those two sections, with no additional text.",
  };

  // 2) USER MESSAGE: embed the hardcoded JSON data
  const userMessage = {
    role: "user",
    content:
      "Here is the data for " +
      hardcodedUserData.userId +
      ":\n\n" +
      "```\n" +
      JSON.stringify(hardcodedUserData, null, 2) +
      "\n```\n\n" +
      "Produce your reply with EXACTLY TWO sections (labeled Reasoning: and Key Factors:).",
  };

  // 3) Make the OpenAI API call
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [systemMessage, userMessage],
    temperature: 0.3,
    max_tokens: 150,
  });

  const fullText = response.choices[0].message.content.trim();

  // 4) Split the combined text into the two parts
  //    We expect the model to return something like:
  //
  //    Reasoning:
  //    <some short paragraph>
  //
  //    Key Factors:
  //    - bullet 1
  //    - bullet 2
  //    - bullet 3
  //
  //    We split at "\n\nKey Factors:" (including the label).
  const splitMarker = "\n\nKey Factors:";
  const [reasoningPart, keyFactorsPartWithLabel] = fullText.split(splitMarker);

  // reasoningPart still contains the "Reasoning:" header plus its paragraph:
  //   "Reasoning:\n<...>"
  //
  // keyFactorsPartWithLabel starts with something like:
  //   "\n\nKey Factors:\n- bullet1\n- bullet2\n- bullet3"
  // We’ll strip the leading "\n\nKey Factors:" so that keyFactors begins at the bullets.
  let keyFactorsOnly = "";
  if (keyFactorsPartWithLabel) {
    // Remove leading newline(s) and the "Key Factors:" label
    keyFactorsOnly = keyFactorsPartWithLabel
      .replace(/^\s*Key Factors:\s*/m, "")
      .trim();
  }

  // 5) Remove the "Reasoning:" label from reasoningPart (so reasoningOnly is just the paragraph)
  let reasoningOnly = reasoningPart.replace(/^\s*Reasoning:\s*/i, "").trim();

  // 6) Cache and return
  cachedInsights = {
    reasoning: reasoningOnly,
    keyFactors: keyFactorsOnly,
  };
  return cachedInsights;
}
