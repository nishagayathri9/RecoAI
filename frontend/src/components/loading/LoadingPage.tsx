// src/components/LoadingPage.tsx
import React from 'react';
import './LoadingPage.css'; // make sure to import the CSS

const LoadingPage: React.FC = () => (
  <div className="card">
    <div className="loader">
      <p>loading</p>
      <div className="words">
        <span className="word">buttons</span>
        <span className="word">forms</span>
        <span className="word">switches</span>
        <span className="word">cards</span>
        <span className="word">buttons</span>
      </div>
    </div>
  </div>
);

export default LoadingPage;
