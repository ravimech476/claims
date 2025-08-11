import React from 'react';

const EmptyPage = ({ title }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-12 text-center max-w-md w-full">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          {title}
        </h1>
        
        <p className="text-gray-600 mb-6">
          This page is under development. Please check back later for updates.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-700 text-sm">
            💡 <strong>Note:</strong> Currently, only the Claims Management page is fully functional. 
            Other features will be implemented soon.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyPage;