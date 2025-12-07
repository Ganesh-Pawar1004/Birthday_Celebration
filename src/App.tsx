import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { Cake } from './pages/Cake';
import { Celebration } from './pages/Celebration';

import { Intro } from './pages/Intro';
import { WishPage } from './pages/WishPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/intro/:id" element={<Intro />} />
        <Route path="/cake/:id" element={<Cake />} />
        <Route path="/celebration/:id" element={<Celebration />} />
        <Route path="/wish/:id" element={<WishPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
