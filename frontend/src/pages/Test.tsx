// src/pages/Test.tsx

import React, { useState, ChangeEvent } from 'react';

// Reads your API server URL from .env.local (or falls back to localhost)
const API_BASE = import.meta.env.VITE_API_BASE_URL;
console.log("API_BASE is:", API_BASE);


interface Metadata {
  detail?: string;
  num_users: number;
  num_items: number;
  meta_dim: number;
}

const Test: React.FC = () => {
  const [userFile, setUserFile] = useState<File | null>(null);
  const [itemFile, setItemFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Upload CSVs
  const handleUpload = async () => {
    if (!userFile || !itemFile) {
      setError('Please select both files first');
      return;
    }
    const form = new FormData();
    form.append('user_file', userFile);
    form.append('item_file', itemFile);

    try {
      const res = await fetch(`${API_BASE}/upload/`, {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || JSON.stringify(err));
      }
      const data: Metadata = await res.json();
      setMetadata(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  // Run prediction
  const handlePredict = async () => {
    if (!metadata) {
      setError('Upload metadata first');
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/predict/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ u_idx: 0, i_idx: 0 }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || JSON.stringify(err));
      }
      const { score }: { score: number } = await res.json();
      setScore(score);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const onUserFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserFile(e.target.files?.[0] ?? null);
  };
  const onItemFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setItemFile(e.target.files?.[0] ?? null);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>RecoAI Dashboard</h2>

      <div>
        <label>
          User CSV:&nbsp;
          <input type="file" accept=".csv" onChange={onUserFileChange} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <label>
          Item CSV:&nbsp;
          <input type="file" accept=".csv" onChange={onItemFileChange} />
        </label>
      </div>

      <div style={{ marginTop: '1rem' }}>
        <button onClick={handleUpload}>Upload Metadata</button>
      </div>

      {metadata && (
        <div style={{ marginTop: '1rem' }}>
          <p>
            Loaded <strong>{metadata.num_users}</strong> users,{' '}
            <strong>{metadata.num_items}</strong> items.
          </p>
          <button onClick={handlePredict}>Run Predict</button>
        </div>
      )}

      {score !== null && (
        <p style={{ marginTop: '1rem' }}>
          <strong>Predicted score:</strong> {score.toFixed(4)}
        </p>
      )}

      {error && (
        <p style={{ marginTop: '1rem', color: 'red' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
    </div>
  );
};

export default Test;
