import { generateInsightsForUser } from "../openaiClient.js";

export default async function handler(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing required query param: userId" });
  }

  try {
    const { reasoning } = await generateInsightsForUser(userId);
    return res.status(200).json({ reasoning });
  } catch (err) {
    console.error(`Error in /api/reasoning for userId=${userId}:`, err);
    return res.status(500).json({ error: err.message || "OpenAI request failed" });
  }
}
