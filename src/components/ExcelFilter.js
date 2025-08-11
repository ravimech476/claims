import React, { useState } from 'react';
import { ChevronDown, SortAsc, SortDesc, Pin, EyeOff, Filter } from 'lucide-react';

const ExcelFilter = ({ 
  column, 
  data, 
  onFilterChange, 
  activeFilters, 
  onSortChange, 
  sortDirection,
  onPinColumn,
  onHideColumn,
  onFilterByClick, // New prop to handle "Filter by" click
  isPinned = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSort = (direction) => {
    onSortChange(column.key);
    setIsOpen(false);
  };

  const handlePin = () => {
    onPinColumn(column.key);
    setIsOpen(false);
  };

  const handleHide = () => {
    onHideColumn(column.key);
    setIsOpen(false);
  };

  const handleFilterBy = () => {
    onFilterByClick(column.key); // Notify parent to open sidebar with this field
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-1 rounded hover:bg-gray-200 transition-colors flex items-center ${
          activeFilters[column.key]?.length > 0 || sortDirection || isPinned ? 'text-blue-600 bg-blue-50' : 'text-gray-400'
        }`}
        title="Column Options"
      >
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown Menu - Simple 5 options */}
          <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-40 w-48">
            <div className="py-1">
              <button
                onClick={() => handleSort('asc')}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 ${
                  sortDirection === 'asc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <SortAsc size={14} />
                Asc
              </button>
              
              <button
                onClick={() => handleSort('desc')}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 ${
                  sortDirection === 'desc' ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <SortDesc size={14} />
                Desc
              </button>
              
              <button
                onClick={handlePin}
                className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 ${
                  isPinned ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                }`}
              >
                <Pin size={14} />
                Pin Column
              </button>
              
              <button
                onClick={handleFilterBy}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                <Filter size={14} />
                Filter by
              </button>
              
              <button
                onClick={handleHide}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-gray-100 text-gray-700"
              >
                <EyeOff size={14} />
                Hide Column
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExcelFilter;