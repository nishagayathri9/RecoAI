import { readFile } from "fs/promises";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export default async function handler(req, res) {
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
