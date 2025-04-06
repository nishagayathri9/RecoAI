import React from "react";
import landingImage from '../assets/landing-image.png';

export default function LandingPage() {
  return (
    <div className="flex items-start bg-transparent justify-between px-25 py-20 "> 
      {/* You can adjust mt-32 to mt-40 or more for more vertical space */}

      {/* Left Side Content */}
      <div className="max-w-xl">
        <h1 className="text-5xl font-bold animated-gradient mt-24 mb-8 px-6">
          Harness AI for Exceptional eCommerce Experiences
        </h1>
        <p className="text-gray-700 text-lg mb-6 px-6">
          RecoAI revolutionizes customer interactions through perfectly tailored product recommendations that align with individual preferences and behaviors.
        </p>
      </div>

      {/* Right Side Illustration */}
      <div className="w-1/2 px-6 flex justify-end mt-25">
        <img src={landingImage} alt="AI-powered eCommerce" className="max-w-md" />
      </div>
    </div>
  );
}
