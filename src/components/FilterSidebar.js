import React, { useState, useEffect } from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';

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
  const [tempFilters, setTempFilters] = useState({}); // Temporary filters before applying

  // Initialize temp filters when sidebar opens
  useEffect(() => {
    if (isOpen) {
      setTempFilters({ ...activeFilters });
    } else {
      // Reset expanded fields when sidebar closes
      setExpandedFields(new Set());
      setSearchTerm('');
    }
  }, [isOpen, activeFilters]);

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
    const currentFilters = tempFilters[columnKey] || [];
    const newFilters = currentFilters.includes(value)
      ? currentFilters.filter(f => f !== value)
      : [...currentFilters, value];
    
    setTempFilters(prev => ({
      ...prev,
      [columnKey]: newFilters
    }));
  };

  const handleApplyFilters = () => {
    // Apply all temp filters
    Object.keys(tempFilters).forEach(key => {
      onFilterChange(key, tempFilters[key] || []);
    });
    // Reset expanded fields
    setExpandedFields(new Set());
    onClose();
  };

  const handleCancelFilters = () => {
    // Clear all filters and close
    Object.keys(activeFilters).forEach(key => {
      onFilterChange(key, []);
    });
    // Reset temp filters and expanded fields
    setTempFilters({});
    setExpandedFields(new Set());
    onClose();
  };

  const clearAllTempFilters = () => {
    setTempFilters({});
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

  const handleTextFilter = (columnKey, value) => {
    if (value) {
      const uniqueValues = getUniqueValues(columnKey);
      const filteredValues = uniqueValues.filter(val => 
        val.toString().toLowerCase().includes(value.toLowerCase())
      );
      setTempFilters(prev => ({
        ...prev,
        [columnKey]: filteredValues
      }));
    } else {
      setTempFilters(prev => ({
        ...prev,
        [columnKey]: []
      }));
    }
  };

  const handleConditionFilter = (columnKey, condition, value) => {
    if (!value) {
      setTempFilters(prev => ({
        ...prev,
        [columnKey]: []
      }));
      return;
    }

    const uniqueValues = getUniqueValues(columnKey);
    let filteredValues = [];

    switch (condition) {
      case 'contains':
        filteredValues = uniqueValues.filter(val => 
          val.toString().toLowerCase().includes(value.toLowerCase())
        );
        break;
      case 'is':
        filteredValues = uniqueValues.filter(val => 
          val.toString().toLowerCase() === value.toLowerCase()
        );
        break;
      case 'starts_with':
        filteredValues = uniqueValues.filter(val => 
          val.toString().toLowerCase().startsWith(value.toLowerCase())
        );
        break;
      case 'ends_with':
        filteredValues = uniqueValues.filter(val => 
          val.toString().toLowerCase().endsWith(value.toLowerCase())
        );
        break;
      default:
        filteredValues = uniqueValues.filter(val => 
          val.toString().toLowerCase().includes(value.toLowerCase())
        );
    }

    setTempFilters(prev => ({
      ...prev,
      [columnKey]: filteredValues
    }));
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
  const hasAnyTempFilters = Object.keys(tempFilters).some(key => tempFilters[key]?.length > 0);
  const hasActiveFilters = Object.keys(activeFilters).some(key => activeFilters[key]?.length > 0);

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
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Filter Claims</h3>
          </div>
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
              placeholder="Search fields..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Status */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {hasActiveFilters ? 
                `${Object.keys(activeFilters).filter(key => activeFilters[key]?.length > 0).length} active filters` : 
                'No active filters'
              }
            </span>
            {hasAnyTempFilters && (
              <button
                onClick={clearAllTempFilters}
                className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
              >
                <RotateCcw size={14} />
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Filter Fields - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Available Fields</h4>
            
            {filteredFields.map(field => {
              const uniqueValues = getUniqueValues(field.key);
              const currentTempFilters = tempFilters[field.key] || [];
              const currentActiveFilters = activeFilters[field.key] || [];
              const isExpanded = expandedFields.has(field.key);
              const isActivated = activatedField === field.key;
              
              return (
                <div key={field.key} className={`mb-3 border rounded-lg p-3 ${
                  isActivated ? 'bg-blue-50 border-blue-200' : 
                  currentActiveFilters.length > 0 ? 'bg-green-50 border-green-200' :
                  'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      onClick={() => toggleFieldExpansion(field.key)}
                      className="flex items-center gap-2 flex-1 text-left"
                    >
                      <span className={`text-sm font-medium ${
                        isActivated ? 'text-blue-700' : 
                        currentActiveFilters.length > 0 ? 'text-green-700' :
                        'text-gray-700'
                      }`}>
                        {field.label}
                        {isActivated && <span className="ml-2 text-xs">(From table)</span>}
                      </span>
                    </button>
                    
                    <div className="flex items-center gap-2">
                      {currentTempFilters.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                          {currentTempFilters.length} selected
                        </span>
                      )}
                      {currentActiveFilters.length > 0 && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      )}
                      <button
                        onClick={() => toggleFieldExpansion(field.key)}
                        className="p-1 hover:bg-white rounded transition-colors"
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="space-y-3 border-t border-gray-200 pt-3">
                      {/* Filter condition selector */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Filter Type
                        </label>
                        <select 
                          className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                          onChange={(e) => {
                            const condition = e.target.value;
                            const input = e.target.parentElement.nextElementSibling.querySelector('input');
                            if (input && input.value) {
                              handleConditionFilter(field.key, condition, input.value);
                            }
                          }}
                        >
                          <option value="contains">Contains</option>
                          <option value="is">Is exactly</option>
                          <option value="starts_with">Starts with</option>
                          <option value="ends_with">Ends with</option>
                        </select>
                      </div>
                      
                      {/* Quick text filter */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Filter Value
                        </label>
                        <input
                          type="text"
                          placeholder="Type to filter values..."
                          className="w-full text-sm border border-gray-300 rounded px-3 py-2 focus:ring-1 focus:ring-blue-500"
                          onChange={(e) => {
                            const condition = e.target.parentElement.previousElementSibling.querySelector('select').value;
                            handleConditionFilter(field.key, condition, e.target.value);
                          }}
                        />
                      </div>
                      
                      {/* Available values */}
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-2">
                          Select Values ({uniqueValues.length} available)
                        </label>
                        <div className="max-h-40 overflow-y-auto bg-white border border-gray-200 rounded p-2">
                          {uniqueValues.slice(0, 20).map(value => (
                            <label key={value} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                              <input
                                type="checkbox"
                                checked={currentTempFilters.includes(value)}
                                onChange={() => handleValueToggle(field.key, value)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                              />
                              <span className="truncate flex-1">{value}</span>
                            </label>
                          ))}
                          {uniqueValues.length > 20 && (
                            <p className="text-xs text-gray-500 mt-2 text-center border-t border-gray-100 pt-2">
                              +{uniqueValues.length - 20} more values (use quick filter above)
                            </p>
                          )}
                        </div>
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

        {/* Action Buttons */}
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <button
              onClick={handleCancelFilters}
              className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-100 transition-colors font-medium flex items-center justify-center gap-1"
            >
              <RotateCcw size={14} />
              Cancel & Clear
            </button>
            <button
              onClick={handleApplyFilters}
              disabled={!hasAnyTempFilters}
              className="flex-1 px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-1"
            >
              <Filter size={14} />
              Apply Filters
            </button>
          </div>
          
          {hasAnyTempFilters && (
            <div className="mt-1.5 text-center">
              <span className="text-xs text-gray-600">
                {Object.keys(tempFilters).filter(key => tempFilters[key]?.length > 0).length} field(s) will be filtered
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;