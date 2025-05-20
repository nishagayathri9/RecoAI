// utils/groupRecommender.ts
const cache = new Map<string, number[]>();

function hashFileName(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash.toString();
}

export function generateGroupPayload(fileName: string) {
  const key = hashFileName(fileName);

  if (!cache.has(key)) {
    const length = Math.floor(Math.random() * 5) + 2; // between 2 and 6
    const ids = Array.from({ length }, () => Math.floor(Math.random() * 100));
    cache.set(key, ids);
  }

  return {
    cold_start_ids: cache.get(key)!,
    users_per_cat: 25,
    top_k: 5,
  };
}
