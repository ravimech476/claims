import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const FilterSidebar = ({ 
  isOpen, 
  onClose,
  allColumns, // All possible columns for filtering
  activeFilters,
  onFilterChange,
  activatedField, // Field that was clicked "Filter by" from column header
  data
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFields, setExpandedFields] = useState(new Set());

  // Auto-expand the activated field when sidebar opens
  useEffect(() => {
    if (activatedField && isOpen) {
      setExpandedFields(prev => new Set([...prev, activatedField]));
    }
  }, [activatedField, isOpen]);

  const getUniqueValues = (columnKey) => {
    return [...new Set(data.map(row => row[columnKey]).filter(val => val !== null && val !== undefined))];
  };

  const handleValueToggle = (columnKey, value) => {
    const currentFilters = activeFilters[columnKey] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    onFilterChange(columnKey, newFilters);
  };

  const clearAllFilters = () => {
    Object.keys(activeFilters).forEach(key => {
      onFilterChange(key, []);
    });
  };

  const toggleFieldExpansion = (fieldKey) => {
    const newExpanded = new Set(expandedFields);
    if (newExpanded.has(fieldKey)) {
      newExpanded.delete(fieldKey);
    } else {
      newExpanded.add(fieldKey);
    }
    setExpandedFields(newExpanded);
  };

  const handleFilterConditionChange = (columnKey, condition, value) => {
    if (condition === 'contains' && value) {
      const filteredValues = getUniqueValues(columnKey).filter(val => 
        val.toString().toLowerCase().includes(value.toLowerCase())
      );
      onFilterChange(columnKey, filteredValues);
    } else if (condition === 'is' && value) {
      onFilterChange(columnKey, [value]);
    } else {
      onFilterChange(columnKey, []);
    }
  };

  const getFilteredFields = () => {
    const allFields = Object.entries(allColumns).map(([key, config]) => ({
      key,
      ...config
    }));
    
    if (!searchTerm) return allFields;
    
    return allFields.filter(field => 
      field.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredFields = getFilteredFields();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Filter Claims by</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Clear All Filters */}
        {Object.keys(activeFilters).some(key => activeFilters[key]?.length > 0) && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Filter Fields - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Filter By Fields</h4>
            
            {filteredFields.map(field => {
              const uniqueValues = getUniqueValues(field.key);
              const currentFilters = activeFilters[field.key] || [];
              const isExpanded = expandedFields.has(field.key);
              const isActivated = activatedField === field.key;
              
              return (
                <div key={field.key} className={`mb-3 ${isActivated ? 'bg-blue-50 p-2 rounded border border-blue-200' : ''}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      checked={isExpanded}
                      onChange={() => toggleFieldExpansion(field.key)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                    />
                    <span className={`text-sm font-medium ${
                      isActivated ? 'text-blue-700 font-semibold' : 'text-gray-700'
                    }`}>
                      {field.label}
                      {isActivated && <span className="ml-2 text-xs">(Selected from table)</span>}
                    </span>
                    {currentFilters.length > 0 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                        {currentFilters.length}
                      </span>
                    )}
                  </div>
                  
                  {isExpanded && (
                    <div className="ml-6 space-y-2">
                      {/* Filter condition selector */}
                      <div className="flex items-center gap-2">
                        <select 
                          className="text-sm border border-gray-300 rounded px-2 py-1 flex-1"
                          onChange={(e) => {
                            // Handle condition change
                          }}
                        >
                          <option value="contains">contains</option>
                          <option value="is">is</option>
                          <option value="starts_with">starts with</option>
                          <option value="ends_with">ends with</option>
                        </select>
                      </div>
                      
                      {/* Input for filter value */}
                      <div>
                        <input
                          type="text"
                          placeholder="Type here"
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                          onChange={(e) => {
                            // Handle text input filtering
                            const value = e.target.value;
                            if (value) {
                              const filteredValues = uniqueValues.filter(val => 
                                val.toString().toLowerCase().includes(value.toLowerCase())
                              );
                              onFilterChange(field.key, filteredValues);
                            } else {
                              onFilterChange(field.key, []);
                            }
                          }}
                        />
                      </div>
                      
                      {/* Available values */}
                      <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded border">
                        {uniqueValues.slice(0, 15).map(value => (
                          <label key={value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-white p-1 rounded">
                            <input
                              type="checkbox"
                              checked={currentFilters.includes(value)}
                              onChange={() => handleValueToggle(field.key, value)}
                              className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                            />
                            <span className="truncate">{value}</span>
                          </label>
                        ))}
                        {uniqueValues.length > 15 && (
                          <p className="text-xs text-gray-500 mt-1 text-center">
                            +{uniqueValues.length - 15} more values...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            
            {filteredFields.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No fields found</p>
                <p className="text-sm">Try adjusting your search</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;