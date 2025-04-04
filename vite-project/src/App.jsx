import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import LandingPage from "./components/LandingPage";
import RecommendationsDashboard from "./components/RecommendationsDashboard";
import ColdStart from "./components/ColdStart";
import HowItWorks from "./components/HowItWorks";
import Demo from "./components/Demo";

function App() {
  const location = useLocation();

  // If the URL is "/demo", render the Demo component only
  if (location.pathname === "/demo") {
    return <Demo />;
  }

  // Otherwise, render the full one-page app
  return (
    <div className="relative scroll-smooth">
      <Navbar />

      <div id="landing">
        <LandingPage />
      </div>

      <div id="how-it-works">
        <HowItWorks />
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
