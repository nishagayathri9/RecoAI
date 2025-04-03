import React from "react";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import RecommendationsDashboard from "./components/RecommendationsDashboard";
import ColdStart from "./components/ColdStart";

function App() {
  return (
    <div className="relative scroll-smooth">
      <Navbar />

      <div id="landing">
        <LandingPage />
      </div>

      <div id="product-rec">
        <RecommendationsDashboard />
      </div>

      <div id="cold-start">
        <ColdStart />
      </div>
    </div>
  );
}

export default App;
