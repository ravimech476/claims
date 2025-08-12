import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import ClaimsTable from './ClaimsTable';
import ClaimsDashboard from './ClaimsDashboard';
import ClaimImportPageSimple from './ClaimImportPageSimple';
import GroupPage from './GroupPage';
import EmptyPage from './EmptyPage';
import { Menu } from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // Changed default to true
  const location = useLocation();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    switch(path) {
      case '/':
      case '/claims':
        return 'Claims Management';
      case '/claims/import':
        return 'Import Claims';
      case '/dashboard':
        return 'Dashboard';
      case '/groups':
        return 'Group Management';
      case '/members':
        return 'Members Management';
      case '/providers':
        return 'Providers Management';
      case '/payments':
        return 'Payments Management';
      case '/analytics':
        return 'Analytics & Reports';
      case '/reports':
        return 'Reports';
      case '/settings':
        return 'Settings';
      default:
        return 'Claims Management';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={toggleSidebar}
        onLogout={onLogout}
      />
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        {/* Toggle button for collapsed sidebar */}
        {!sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="fixed top-4 left-4 z-30 lg:block hidden p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
            title="Expand sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        
        {/* Header - Only show for non-claims pages */}
        {location.pathname !== '/' && location.pathname !== '/claims' && (
          <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar}
                  className="mr-4 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Menu size={24} />
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">{getPageTitle()}</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Welcome, User
                </div>
              </div>
            </div>
          </header>
        )}
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<ClaimsTable sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />} />
            <Route path="/claims" element={<ClaimsTable sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />} />
            <Route path="/claims/import" element={<ClaimImportPageSimple />} />
            <Route path="/dashboard" element={<ClaimsDashboard />} />
            <Route path="/groups" element={<GroupPage sidebarOpen={sidebarOpen} onToggleSidebar={toggleSidebar} />} />
            <Route path="/members" element={<EmptyPage title="Members Management" />} />
            <Route path="/providers" element={<EmptyPage title="Providers Management" />} />
            <Route path="/payments" element={<EmptyPage title="Payments Management" />} />
            <Route path="/analytics" element={<EmptyPage title="Analytics & Reports" />} />
            <Route path="/reports" element={<EmptyPage title="Reports" />} />
            <Route path="/settings" element={<EmptyPage title="Settings" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;