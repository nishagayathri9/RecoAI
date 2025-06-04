// ─────────────────────────────────────────────────────────────────────────────
// File: src/utils/gemini.ts
// Description:
//   A small helper to check whether a given Gemini/Vertex AI API key works.
//   It sends a “hello” prompt to the “text-bison-001” model and logs the response.
//   If the API key is invalid or the request fails, it logs an error instead.
// ─────────────────────────────────────────────────────────────────────────────

// (1) We’ll use the browser’s built‐in fetch. No extra library is needed.
export async function testGeminiApiKey(apiKey: string): Promise<void> {
  // (2) Replace "text-bison-001" with any available Gemini/Vertex generative model
  //     from your Google Cloud project. This example uses the public "text-bison-001" endpoint.
  const endpoint = `https://generativelanguage.googleapis.com/v1beta2/models/embedding-gecko-001:embedText?key=${apiKey}`;

  // (3) Build a minimal request body: a prompt that simply says “Hello!”.
  //     The “prompt” structure should conform to the Generative Language API spec.
  const body = {
    prompt: {
      // A very basic text prompt. You can change this later.
      text: "Hello, Gemini! Are you online?"
    },
    // You can optionally tweak temperature, candidateCount, etc.
    temperature: 0.2,
    candidateCount: 1
  };

  try {
    // (4) Fire the POST request.
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    // (5) If the status isn’t “200 OK”, throw an error to be caught below.
    if (!response.ok) {
      const rawText = await response.text();
      throw new Error(
        `Gemini responded with ${response.status} – ${response.statusText}. Body: ${rawText}`
      );
    }

    // (6) Parse JSON and log it to the console.
    const json = await response.json();
    console.log("✅ Gemini connection successful. Full response:", json);
  } catch (err) {
    console.error("❌ Gemini connection failed:", err);
  }
}

export async function listGeminiModels(apiKey: string): Promise<void> {
  // (1) Use the “list models” endpoint.
  //     Note: We start with the global URL; if your key is regional-only, switch to us-central1-… etc.
  const listUrl = `https://generativelanguage.googleapis.com/v1beta2/models?key=${apiKey}`;

  try {
    const resp = await fetch(listUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!resp.ok) {
      const respText = await resp.text();
      throw new Error(
        `ListModels responded with ${resp.status} ${resp.statusText}. Body: ${respText}`
      );
    }

    const json = await resp.json();
    console.log("📦 Available Gemini models:", json);
    // The JSON will look like:
    // { models: [ { name: "projects/.../locations/global/models/text-bison-001", … }, 
    //             { name: "projects/.../locations/global/models/chat-bison-001", … }, … ] }
    // Just look for the “name” field in each entry.

    if (Array.isArray(json.models)) {
      json.models.forEach((m: any) => {
        console.log(" •", m.name);
      });
    }
  } catch (err) {
    console.error("❌ Failed to list Gemini models:", err);
  }
}
