import React from "react";
import landingImage from '../assets/landing-image.png';


export default function LandingPage() {
    return (
      <div className="flex items-center bg-transparent justify-between px-25 py-20">
        {/* Left Side Content */}
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold text-black mb-10 px-6">
            Harness AI for Exceptional eCommerce Experiences
          </h1>
          <p className="text-gray-700 text-lg mb-6 px-6">
            RecoAI revolutionizes customer interactions through perfectly tailored product recommendations that align with individual preferences and behaviors.
          </p>
          <div className="px-6">

          </div>
        </div>
        
        {/* Right Side Illustration */}
        <div className="w-1/2 px-6 flex justify-end">
        <img src={landingImage} alt="AI-powered eCommerce" className="max-w-md" />

        </div>
      </div>
    );
}
