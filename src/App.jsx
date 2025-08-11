import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ClaimsTable from './components/ClaimsTable';
import ClaimImportPage from './components/ClaimImportPage';
import ClaimImportPageTest from './components/ClaimImportPageTest';
import ClaimImportPageSimple from './components/ClaimImportPageSimple';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default route - redirect to claims table */}
          <Route path="/" element={<ClaimsTable />} />
          
          {/* Claims routes */}
          <Route path="/claims" element={<ClaimsTable />} />
          {/* Use simplified version that should work */}
          <Route path="/claims/import" element={<ClaimImportPageSimple />} />
          <Route path="/claims/import-test" element={<ClaimImportPageTest />} />
          <Route path="/claims/import-full" element={<ClaimImportPage />} />
          
          {/* Test navigation */}
          <Route path="/test" element={
            <div className="p-8">
              <h1 className="text-2xl font-bold mb-4">Navigation Test</h1>
              <div className="space-y-2">
                <Link to="/claims" className="block text-blue-600 hover:underline">
                  Go to Claims Table
                </Link>
                <Link to="/claims/import" className="block text-blue-600 hover:underline">
                  Go to Import Page (Simple)
                </Link>
                <Link to="/claims/import-test" className="block text-blue-600 hover:underline">
                  Go to Import Page (Test)
                </Link>
                <Link to="/claims/import-full" className="block text-blue-600 hover:underline">
                  Go to Import Page (Full)
                </Link>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;