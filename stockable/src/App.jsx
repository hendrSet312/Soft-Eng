import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { DashboardPage, SignUpPage, LoginPage, Details } from './pages'; 

function App() {
  return (
    <Router>
      <div className="App h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/details/:symbol" element={<Details />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
