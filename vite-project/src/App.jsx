import React from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import ColdStart from "./components/ColdStart";
import RecommendationsDashboard from "./components/RecommendationsDashboard";

function App() {
  return (
    <div className="relative">
      {/* Slide 1: Landing Page */}
      <div className="sticky top-0 h-screen flex flex-col justify-center bg-gradient-to-b from-white to-green-50">
        <LandingPage />
      </div>

      {/* Slide 2: Recommendations Dashboard */}
      <div className="sticky top-0 h-screen flex flex-col justify-center bg-gradient-to-b from-white to-green-50">
        <RecommendationsDashboard />
      </div>

       {/* Slide 3: Cold Start Dashboard */}
       <div className="sticky top-0 h-screen flex flex-col justify-center bg-gradient-to-b from-white to-green-0">
        <ColdStart/>
      </div>     

    </div>
  );
}

export default App;
