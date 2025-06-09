import { generateInsightsForUser } from "../openaiClient.js";

export default async function handler(req, res) {
    // Allow any origin (or lock down to your front-end domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  // If you need OPTIONS (preflight) too:
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight
    return res.status(204).end();
  }
  
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing required query param: userId" });
  }

  try {
    const { keyFactors } = await generateInsightsForUser(userId);
    return res.status(200).json({ keyFactors });
  } catch (err) {
    console.error(`Error in /api/key-factors for userId=${userId}:`, err);
    return res.status(500).json({ error: err.message || "OpenAI request failed" });
  }
}
