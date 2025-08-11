import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {
  // For demo purposes, start with authenticated = true
  // You can change this back to false if you want login functionality
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Router>
          <Dashboard onLogout={handleLogout} />
        </Router>
      )}
    </div>
  );
}

export default App;