import React, { useEffect } from 'react';
import './loadingpage.css';

interface LoadingPageProps {
  /** Duration of loader in milliseconds */
  duration?: number;
  /** Callback when loading finishes */
  onFinish?: () => void;
}

const wordsList = [
  'buttons',
  'forms',
  'switches',
  'cards',
  'buttons'
];

const LoadingPage: React.FC<LoadingPageProps> = ({ duration = 8000, onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onFinish]);

  return (
    <div className="card">
      <div className="loader">
        <p>loading</p>
        <div className="words">
          {wordsList.map((word, idx) => (
            <span key={idx} className="word">
              {word}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
