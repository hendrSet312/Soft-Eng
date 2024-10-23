import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage, SignUpPage } from './pages';

function App() {
  return (
    <Router>
      <div className="App h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUpPage />} />  
        </Routes>
      </div>
    </Router>
  );
}

export default App;
