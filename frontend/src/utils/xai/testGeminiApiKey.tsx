import React, { useEffect } from "react";
import { testGeminiApiKey } from "../xai/gemini";

const CheckGeminiConnection: React.FC = () => {
  useEffect(() => {
    // (A) Read your key from process.env
    const key = process.env.REACT_APP_GEMINI_API_KEY || "";
    if (!key) {
      console.error("No Gemini API key found in REACT_APP_GEMINI_API_KEY");
      return;
    }

    // (B) Fire the test on mount
    testGeminiApiKey(key);
  }, []);

  return (
    <div className="text-sm text-gray-400">
      {/* This component only logs to the console; it has no visible UI. */}
      <p>Checking Gemini connection… (look at the console for results)</p>
    </div>
  );
};

export default CheckGeminiConnection;
