import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import RootLayout from './layouts/RootLayout';

// Pages
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import PlaygroundPage from './pages/PlaygroundPage';
import Test from './pages/Test.js';
import UserDashboardPage from './pages/UserDashboardPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="how-it-works" element={<HowItWorksPage />} />
            <Route path="playground" element={<PlaygroundPage />} />
            <Route path="dashboard" element={<UserDashboardPage />} />
            <Route path="test" element={<Test />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;