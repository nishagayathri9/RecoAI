import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

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
  
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const jsonPath = join(__dirname, "./users.json"); // ← correct now

  try {
    const fileText = await readFile(jsonPath, "utf-8");
    const allUsers = JSON.parse(fileText);
    const userIds = Object.keys(allUsers);
    res.status(200).json({ users: userIds });
  } catch (err) {
    console.error("Failed to load users.json:", err);
    res.status(500).json({ error: "Could not load users.json" });
  }
}
