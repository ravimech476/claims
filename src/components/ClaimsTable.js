import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Download,
  Settings,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  X,
  ChevronLeft,
  ChevronFirst,
  ChevronLast,
  TrendingUp,
  Menu,
  Filter,
  Pin,
  Upload,
  FileSpreadsheet,
  RefreshCw,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import ExcelFilter from './ExcelFilter';
import FilterSidebar from './FilterSidebar';
// import ClaimImportService from '../services/ClaimImportService';

// Filter Dropdown Component
const FilterDropdown = ({
  column,
  onClose,
  getUniqueValues,
  formatCellContent,
  applyFilter,
  removeFilter,
  buttonRef,
}) => {
  const [filterType, setFilterType] = useState("values");
  const [searchText, setSearchText] = useState("");
  const [selectedValues, setSelectedValues] = useState(new Set());
  const [selectAll, setSelectAll] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const [numberMin, setNumberMin] = useState("");
  const [numberMax, setNumberMax] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isPositioned, setIsPositioned] = useState(false);

  // Calculate position based on button ref
  useEffect(() => {
    if (buttonRef?.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const dropdownWidth = 320;

      let left = rect.left;
      let top = rect.bottom + 8;

      if (left + dropdownWidth > viewportWidth) {
        left = viewportWidth - dropdownWidth - 16;
      }

      if (top + 400 > window.innerHeight) {
        top = rect.top - 400 - 8;
      }

      setPosition({ top, left });
      setIsPositioned(true);
    }
  }, [buttonRef]);

  const uniqueValues = getUniqueValues(column.key);
  const filteredValues = uniqueValues.filter((value) =>
    String(value).toLowerCase().includes(searchText.toLowerCase())
  );

  const sortedValues = [...filteredValues].sort((a, b) => {
    if (sortOrder === "asc") {
      return String(a).localeCompare(String(b));
    } else {
      return String(b).localeCompare(String(a));
    }
  });

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedValues(new Set());
    } else {
      setSelectedValues(new Set(filteredValues));
    }
    setSelectAll(!selectAll);
  };

  const handleValueToggle = (value) => {
    setSelectedValues((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  const handleApplyFilter = () => {
    let filterConfig = {};

    if (filterType === "values" && selectedValues.size > 0) {
      filterConfig = { type: "values", selectedValues };
    } else if (filterType === "text" && searchText) {
      filterConfig = { type: "text", searchText };
    } else if (filterType === "number" && (numberMin || numberMax)) {
      filterConfig = {
        type: "number",
        min: numberMin ? parseFloat(numberMin) : undefined,
        max: numberMax ? parseFloat(numberMax) : undefined,
      };
    } else if (filterType === "date" && (dateFrom || dateTo)) {
      filterConfig = { type: "date", dateFrom, dateTo };
    }

    if (Object.keys(filterConfig).length > 0) {
      applyFilter(column.key, filterConfig);
    }
    onClose();
  };

  // Don't render until position is calculated
  if (!isPositioned) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-10"
        onClick={onClose}
      />

      {/* Tooltip-style Dropdown */}
      <div
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-2xl w-80"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          transition: "none",
          transform: "none",
        }}
      >
        {/* Arrow pointing to button */}
        <div
          className="absolute -top-2 w-4 h-4 bg-white border-l border-t border-gray-200 transform rotate-45"
          style={{
            left: buttonRef?.current
              ? Math.min(
                  Math.max(
                    buttonRef.current.getBoundingClientRect().left -
                      position.left +
                      8,
                    16
                  ),
                  304
                )
              : 16,
            transition: "none",
          }}
        />

        {/* Filter Header */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Filter: {column.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-200 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Type Tabs */}
        <div className="p-3 border-b border-gray-200">
          <div className="flex gap-1">
            <button
              onClick={() => setFilterType("values")}
              className={`px-3 py-1 text-sm rounded ${
                filterType === "values"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Values
            </button>
            <button
              onClick={() => setFilterType("text")}
              className={`px-3 py-1 text-sm rounded ${
                filterType === "text"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Text Filter
            </button>
            {(column.type === "currency" || column.type === "number") && (
              <button
                onClick={() => setFilterType("number")}
                className={`px-3 py-1 text-sm rounded ${
                  filterType === "number"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Number
              </button>
            )}
            {column.type === "date" && (
              <button
                onClick={() => setFilterType("date")}
                className={`px-3 py-1 text-sm rounded ${
                  filterType === "date"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                Date
              </button>
            )}
          </div>
        </div>

        {/* Filter Content */}
        <div className="p-3 max-h-80 overflow-y-auto">
          {filterType === "values" && (
            <>
              {/* Search Box */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search values..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Sort Controls */}
              <div className="flex items-center gap-2 mb-3">
                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex items-center gap-1 px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                >
                  {sortOrder === "asc" ? (
                    <SortAsc className="w-3 h-3" />
                  ) : (
                    <SortDesc className="w-3 h-3" />
                  )}
                  Sort
                </button>
              </div>

              {/* Select All */}
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
                <span className="text-sm font-medium">(Select All)</span>
              </div>

              {/* Values List */}
              <div className="max-h-48 overflow-y-auto">
                {sortedValues.map((value, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 py-1 hover:bg-gray-50 rounded px-1"
                  >
                    <input
                      type="checkbox"
                      checked={selectedValues.has(value)}
                      onChange={() => handleValueToggle(value)}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">
                      {formatCellContent(value, column.type)}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}

          {filterType === "text" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contains text:
              </label>
              <input
                type="text"
                placeholder="Enter text to search..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          )}

          {filterType === "number" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Value:
                </label>
                <input
                  type="number"
                  placeholder="Min"
                  value={numberMin}
                  onChange={(e) => setNumberMin(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Value:
                </label>
                <input
                  type="number"
                  placeholder="Max"
                  value={numberMax}
                  onChange={(e) => setNumberMax(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {filterType === "date" && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  From Date:
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To Date:
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Filter Actions */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 flex gap-2 rounded-b-lg">
          <button
            onClick={handleApplyFilter}
            className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
          >
            Apply Filter
          </button>
          <button
            onClick={() => removeFilter(column.key)}
            className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
    </>
  );
};

// SubHeader Component
const SubHeader = ({
  column,
  appliedFilters,
  activeFilter,
  setActiveFilter,
  getUniqueValues,
  formatCellContent,
  applyFilter,
  removeFilter,
  pinnedColumns,
  sortConfig,
  handleSortChange
}) => {
  const buttonRef = useRef(null);

  return (
    <th
      key={`${column.key}`}
      className="bg-gray-100 border-b border-gray-200 p-3 text-left text-xs text-gray-600 font-medium transition-all duration-300 relative"
      style={{ width: column.width }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {pinnedColumns.has(column.key) && (
            <Pin size={12} className="text-blue-500" />
          )}
          <button
            onClick={() => handleSortChange(column.key)}
            className="flex items-center gap-1 hover:text-gray-800 transition-colors"
            title={`Sort by ${column.title}`}
          >
            <span>{column.title}</span>
            {sortConfig.key === column.key && (
              <span className="text-blue-500">
                {sortConfig.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </button>
        </div>
        <div className="flex items-center gap-1">
          {appliedFilters[column.key] && (
            <div className="w-2 h-2 bg-blue-500 rounded-full" title="Filter applied"></div>
          )}
          <button
            ref={buttonRef}
            onClick={() =>
              setActiveFilter(activeFilter === column.key ? null : column.key)
            }
            className={`p-1 rounded hover:bg-gray-200 transition-colors ${
              appliedFilters[column.key]
                ? "text-blue-600"
                : "text-gray-400 hover:text-gray-600"
            }`}
            title={`Filter ${column.title}`}
          >
            <Filter className="w-3 h-3" />
          </button>
        </div>
      </div>

      {activeFilter === column.key && (
        <FilterDropdown
          column={column}
          onClose={() => setActiveFilter(null)}
          getUniqueValues={getUniqueValues}
          formatCellContent={formatCellContent}
          applyFilter={applyFilter}
          removeFilter={removeFilter}
          buttonRef={buttonRef}
        />
      )}
    </th>
  );
};
 
const ClaimsTable = ({ sidebarOpen = true, onToggleSidebar }) => {
  // State management
  const [selectedClaims, setSelectedClaims] = useState(new Set());
  const [expandedGroups, setExpandedGroups] = useState(new Set(['patient_info', 'claim_status']));
  const [activeFilters, setActiveFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [pinnedColumns, setPinnedColumns] = useState(new Set());
  const [hiddenColumns, setHiddenColumns] = useState(new Set());
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [activatedFilterField, setActivatedFilterField] = useState(null);
  const [importedClaims, setImportedClaims] = useState([]);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);
  const [appliedFilters, setAppliedFilters] = useState({});

  // Load imported claims from localStorage
  useEffect(() => {
    // const imported = ClaimImportService.getImportedClaims();
    // setImportedClaims(imported);
    setImportedClaims([]); // For now, just use empty array
  }, []);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExportMenu && !event.target.closest('.export-dropdown')) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showExportMenu]);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeFilter && !event.target.closest('.relative')) {
        setActiveFilter(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeFilter]);
 
  // Enhanced sample claims data - More records for pagination testing
  const baseSampleClaims = [
    {
      id: 'CLM001',
      patientId: 'PAT12345',
      patientName: 'John Smith',
      status: 'Pending Review',
      submissionDate: '2025-08-01',
      totalAmount: 1250.00,
      diag1: 'Z51.11',
      diag2: 'C78.00',
      diag3: null,
      udf1: 'High Priority',
      udf2: 'Oncology',
      udf3: 'Dr. Johnson',
      provider: 'City Medical Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-07',
      age: 65,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM002',
      patientId: 'PAT67890',
      patientName: 'Sarah Johnson',
      status: 'Approved',
      submissionDate: '2025-08-02',
      totalAmount: 850.75,
      diag1: 'M79.3',
      diag2: 'M25.511',
      diag3: 'Z87.891',
      udf1: 'Standard',
      udf2: 'Orthopedic',
      udf3: 'Dr. Smith',
      provider: 'Wellness Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-06',
      age: 42,
      gender: 'Female',
      department: 'Orthopedic'
    },
    {
      id: 'CLM003',
      patientId: 'PAT11111',
      patientName: 'Michael Brown',
      status: 'Denied',
      submissionDate: '2025-08-03',
      totalAmount: 2100.50,
      diag1: 'I25.10',
      diag2: 'E11.9',
      diag3: 'Z95.1',
      udf1: 'Rush',
      udf2: 'Cardiology',
      udf3: 'Dr. Wilson',
      provider: 'Heart Institute',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-05',
      age: 58,
      gender: 'Male',
      department: 'Cardiology'
    },
    {
      id: 'CLM004',
      patientId: 'PAT22222',
      patientName: 'Emily Davis',
      status: 'In Progress',
      submissionDate: '2025-08-04',
      totalAmount: 675.25,
      diag1: 'N39.0',
      diag2: null,
      diag3: null,
      udf1: 'Standard',
      udf2: 'Urology',
      udf3: 'Dr. Brown',
      provider: 'Specialty Care',
      insuranceType: 'Private',
      lastUpdated: '2025-08-08',
      age: 35,
      gender: 'Female',
      department: 'Urology'
    },
    {
      id: 'CLM005',
      patientId: 'PAT33333',
      patientName: 'Robert Wilson',
      status: 'Approved',
      submissionDate: '2025-08-05',
      totalAmount: 1450.00,
      diag1: 'F32.9',
      diag2: 'Z91.19',
      diag3: null,
      udf1: 'High Priority',
      udf2: 'Psychiatry',
      udf3: 'Dr. Lee',
      provider: 'Mental Health Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-07',
      age: 72,
      gender: 'Male',
      department: 'Psychiatry'
    },
    {
      id: 'CLM006',
      patientId: 'PAT44444',
      patientName: 'Lisa Anderson',
      status: 'Pending Review',
      submissionDate: '2025-08-06',
      totalAmount: 925.80,
      diag1: 'O80.1',
      diag2: 'Z37.0',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Obstetrics',
      udf3: 'Dr. Martinez',
      provider: 'Women\'s Hospital',
      insuranceType: 'Private',
      lastUpdated: '2025-08-08',
      age: 28,
      gender: 'Female',
      department: 'Obstetrics'
    },
    {
      id: 'CLM007',
      patientId: 'PAT55555',
      patientName: 'David Rodriguez',
      status: 'Approved',
      submissionDate: '2025-08-07',
      totalAmount: 1875.30,
      diag1: 'J44.1',
      diag2: 'Z87.891',
      diag3: 'I10',
      udf1: 'High Priority',
      udf2: 'Pulmonology',
      udf3: 'Dr. Davis',
      provider: 'Respiratory Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-09',
      age: 68,
      gender: 'Male',
      department: 'Pulmonology'
    },
    {
      id: 'CLM008',
      patientId: 'PAT66666',
      patientName: 'Jennifer Garcia',
      status: 'In Progress',
      submissionDate: '2025-08-08',
      totalAmount: 1125.45,
      diag1: 'M17.12',
      diag2: 'M25.561',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Orthopedic',
      udf3: 'Dr. Thompson',
      provider: 'Joint Care Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-10',
      age: 55,
      gender: 'Female',
      department: 'Orthopedic'
    },
    {
      id: 'CLM009',
      patientId: 'PAT77777',
      patientName: 'James Miller',
      status: 'Denied',
      submissionDate: '2025-08-09',
      totalAmount: 2250.00,
      diag1: 'C25.9',
      diag2: 'Z51.11',
      diag3: 'K92.2',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Anderson',
      provider: 'Cancer Treatment Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-11',
      age: 62,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM010',
      patientId: 'PAT88888',
      patientName: 'Maria Lopez',
      status: 'Pending Review',
      submissionDate: '2025-08-10',
      totalAmount: 750.90,
      diag1: 'N18.6',
      diag2: 'E11.22',
      diag3: 'I12.9',
      udf1: 'High Priority',
      udf2: 'Nephrology',
      udf3: 'Dr. Kim',
      provider: 'Kidney Care Institute',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-11',
      age: 71,
      gender: 'Female',
      department: 'Nephrology'
    },
    {
      id: 'CLM011',
      patientId: 'PAT99999',
      patientName: 'Christopher Lee',
      status: 'Approved',
      submissionDate: '2025-08-11',
      totalAmount: 1650.75,
      diag1: 'S72.001A',
      diag2: 'W19.XXXA',
      diag3: null,
      udf1: 'Rush',
      udf2: 'Emergency',
      udf3: 'Dr. White',
      provider: 'Emergency Medical Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 45,
      gender: 'Male',
      department: 'Emergency'
    },
    {
      id: 'CLM012',
      patientId: 'PAT10001',
      patientName: 'Amanda Taylor',
      status: 'In Progress',
      submissionDate: '2025-07-25',
      totalAmount: 980.25,
      diag1: 'G93.1',
      diag2: 'S06.2X1A',
      diag3: 'Z87.820',
      udf1: 'High Priority',
      udf2: 'Neurology',
      udf3: 'Dr. Roberts',
      provider: 'Neurological Institute',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-05',
      age: 67,
      gender: 'Female',
      department: 'Neurology'
    },
    {
      id: 'CLM013',
      patientId: 'PAT10002',
      patientName: 'Thomas Clark',
      status: 'Approved',
      submissionDate: '2025-07-28',
      totalAmount: 1320.60,
      diag1: 'I48.91',
      diag2: 'I50.9',
      diag3: 'Z95.0',
      udf1: 'Standard',
      udf2: 'Cardiology',
      udf3: 'Dr. Johnson',
      provider: 'Heart Specialists',
      insuranceType: 'Private',
      lastUpdated: '2025-08-03',
      age: 59,
      gender: 'Male',
      department: 'Cardiology'
    },
    {
      id: 'CLM014',
      patientId: 'PAT10003',
      patientName: 'Patricia Martinez',
      status: 'Denied',
      submissionDate: '2025-07-30',
      totalAmount: 2450.80,
      diag1: 'C50.911',
      diag2: 'Z85.3',
      diag3: 'Z51.11',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Parker',
      provider: 'Breast Cancer Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-07',
      age: 48,
      gender: 'Female',
      department: 'Oncology'
    },
    {
      id: 'CLM015',
      patientId: 'PAT10004',
      patientName: 'Daniel Harris',
      status: 'Pending Review',
      submissionDate: '2025-08-01',
      totalAmount: 875.40,
      diag1: 'K21.9',
      diag2: 'K59.00',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Gastroenterology',
      udf3: 'Dr. Lewis',
      provider: 'Digestive Health Clinic',
      insuranceType: 'Private',
      lastUpdated: '2025-08-10',
      age: 52,
      gender: 'Male',
      department: 'Gastroenterology'
    },
    {
      id: 'CLM016',
      patientId: 'PAT10005',
      patientName: 'Elizabeth Walker',
      status: 'Approved',
      submissionDate: '2025-08-03',
      totalAmount: 1195.25,
      diag1: 'H25.13',
      diag2: 'H52.4',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Ophthalmology',
      udf3: 'Dr. Turner',
      provider: 'Eye Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-09',
      age: 73,
      gender: 'Female',
      department: 'Ophthalmology'
    },
    {
      id: 'CLM017',
      patientId: 'PAT10006',
      patientName: 'Kevin Young',
      status: 'In Progress',
      submissionDate: '2025-08-05',
      totalAmount: 1750.90,
      diag1: 'M06.9',
      diag2: 'M79.3',
      diag3: 'Z87.891',
      udf1: 'High Priority',
      udf2: 'Rheumatology',
      udf3: 'Dr. Green',
      provider: 'Arthritis Treatment Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 39,
      gender: 'Male',
      department: 'Rheumatology'
    },
    {
      id: 'CLM018',
      patientId: 'PAT10007',
      patientName: 'Michelle Robinson',
      status: 'Approved',
      submissionDate: '2025-08-07',
      totalAmount: 925.15,
      diag1: 'L40.9',
      diag2: 'L20.84',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Dermatology',
      udf3: 'Dr. Adams',
      provider: 'Skin Care Specialists',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 34,
      gender: 'Female',
      department: 'Dermatology'
    },
    {
      id: 'CLM019',
      patientId: 'PAT10008',
      patientName: 'Steven Allen',
      status: 'Denied',
      submissionDate: '2025-08-09',
      totalAmount: 2180.45,
      diag1: 'C78.30',
      diag2: 'C25.9',
      diag3: 'K92.2',
      udf1: 'Rush',
      udf2: 'Oncology',
      udf3: 'Dr. Mitchell',
      provider: 'Cancer Research Institute',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-11',
      age: 64,
      gender: 'Male',
      department: 'Oncology'
    },
    {
      id: 'CLM020',
      patientId: 'PAT10009',
      patientName: 'Laura King',
      status: 'Pending Review',
      submissionDate: '2025-08-10',
      totalAmount: 1485.70,
      diag1: 'E10.22',
      diag2: 'H36.01',
      diag3: 'Z79.4',
      udf1: 'High Priority',
      udf2: 'Endocrinology',
      udf3: 'Dr. Scott',
      provider: 'Diabetes Care Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-11',
      age: 56,
      gender: 'Female',
      department: 'Endocrinology'
    },
    {
      id: 'CLM021',
      patientId: 'PAT10010',
      patientName: 'Paul Wright',
      status: 'Approved',
      submissionDate: '2025-07-20',
      totalAmount: 1150.30,
      diag1: 'M48.06',
      diag2: 'M54.16',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Orthopedic',
      udf3: 'Dr. Hill',
      provider: 'Spine Center',
      insuranceType: 'Private',
      lastUpdated: '2025-07-28',
      age: 47,
      gender: 'Male',
      department: 'Orthopedic'
    },
    {
      id: 'CLM022',
      patientId: 'PAT10011',
      patientName: 'Nancy Baker',
      status: 'In Progress',
      submissionDate: '2025-07-22',
      totalAmount: 2250.85,
      diag1: 'N20.0',
      diag2: 'N39.0',
      diag3: 'Z87.442',
      udf1: 'Rush',
      udf2: 'Urology',
      udf3: 'Dr. Cooper',
      provider: 'Kidney Stone Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-01',
      age: 69,
      gender: 'Female',
      department: 'Urology'
    },
    {
      id: 'CLM023',
      patientId: 'PAT10012',
      patientName: 'Mark Campbell',
      status: 'Approved',
      submissionDate: '2025-07-25',
      totalAmount: 875.20,
      diag1: 'H93.13',
      diag2: 'H90.3',
      diag3: null,
      udf1: 'Standard',
      udf2: 'ENT',
      udf3: 'Dr. Reed',
      provider: 'Hearing Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-02',
      age: 41,
      gender: 'Male',
      department: 'ENT'
    },
    {
      id: 'CLM024',
      patientId: 'PAT10013',
      patientName: 'Sandra Phillips',
      status: 'Denied',
      submissionDate: '2025-07-27',
      totalAmount: 1680.95,
      diag1: 'F41.1',
      diag2: 'F43.10',
      diag3: 'Z87.891',
      udf1: 'High Priority',
      udf2: 'Psychiatry',
      udf3: 'Dr. Morgan',
      provider: 'Mental Wellness Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-05',
      age: 38,
      gender: 'Female',
      department: 'Psychiatry'
    },
    {
      id: 'CLM025',
      patientId: 'PAT10014',
      patientName: 'Richard Evans',
      status: 'Pending Review',
      submissionDate: '2025-07-29',
      totalAmount: 1325.40,
      diag1: 'I25.700',
      diag2: 'I50.9',
      diag3: 'Z95.1',
      udf1: 'Standard',
      udf2: 'Cardiology',
      udf3: 'Dr. Bell',
      provider: 'Heart Institute',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-08',
      age: 75,
      gender: 'Male',
      department: 'Cardiology'
    },
    {
      id: 'CLM026',
      patientId: 'PAT10015',
      patientName: 'Carol Turner',
      status: 'Approved',
      submissionDate: '2025-08-01',
      totalAmount: 945.60,
      diag1: 'M79.603',
      diag2: 'M25.511',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Physical Therapy',
      udf3: 'Dr. Ward',
      provider: 'Rehabilitation Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-09',
      age: 29,
      gender: 'Female',
      department: 'Physical Therapy'
    },
    {
      id: 'CLM027',
      patientId: 'PAT10016',
      patientName: 'Brian Foster',
      status: 'In Progress',
      submissionDate: '2025-08-02',
      totalAmount: 1780.25,
      diag1: 'G35',
      diag2: 'G93.1',
      diag3: 'F32.9',
      udf1: 'High Priority',
      udf2: 'Neurology',
      udf3: 'Dr. Stone',
      provider: 'Multiple Sclerosis Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-10',
      age: 44,
      gender: 'Male',
      department: 'Neurology'
    },
    {
      id: 'CLM028',
      patientId: 'PAT10017',
      patientName: 'Deborah Gray',
      status: 'Approved',
      submissionDate: '2025-08-04',
      totalAmount: 1095.80,
      diag1: 'N95.1',
      diag2: 'E28.310',
      diag3: null,
      udf1: 'Standard',
      udf2: 'Gynecology',
      udf3: 'Dr. Price',
      provider: 'Women\'s Health Center',
      insuranceType: 'Private',
      lastUpdated: '2025-08-11',
      age: 51,
      gender: 'Female',
      department: 'Gynecology'
    },
    {
      id: 'CLM029',
      patientId: 'PAT10018',
      patientName: 'Gregory Cox',
      status: 'Denied',
      submissionDate: '2025-08-06',
      totalAmount: 2085.45,
      diag1: 'C61',
      diag2: 'N40.1',
      diag3: 'R97.20',
      udf1: 'Rush',
      udf2: 'Urology',
      udf3: 'Dr. Bryant',
      provider: 'Prostate Cancer Center',
      insuranceType: 'Medicaid',
      lastUpdated: '2025-08-11',
      age: 66,
      gender: 'Male',
      department: 'Urology'
    },
    {
      id: 'CLM030',
      patientId: 'PAT10019',
      patientName: 'Helen Ward',
      status: 'Pending Review',
      submissionDate: '2025-08-08',
      totalAmount: 1420.15,
      diag1: 'M05.79',
      diag2: 'M06.9',
      diag3: 'Z87.891',
      udf1: 'High Priority',
      udf2: 'Rheumatology',
      udf3: 'Dr. Ross',
      provider: 'Autoimmune Disease Center',
      insuranceType: 'Medicare',
      lastUpdated: '2025-08-11',
      age: 63,
      gender: 'Female',
      department: 'Rheumatology'
    }
  ];

  // Combine base claims with imported claims
  const sampleClaims = [...baseSampleClaims, ...importedClaims];
 
  // Enhanced column configuration with default visible columns
  const columnGroups = {
    patient_info: {
      id: 'patient_info',
      title: 'Patient Information',
      icon: '👤',
      color: 'blue',
      defaultColumn: 'patientId', // Always show this column
      columns: [
        { key: 'patientId', title: 'Patient ID', type: 'text', width: 120 },
        { key: 'patientName', title: 'Patient Name', type: 'text', width: 180 },
        { key: 'age', title: 'Age', type: 'number', width: 80 },
        { key: 'gender', title: 'Gender', type: 'text', width: 100 },
        { key: 'insuranceType', title: 'Insurance', type: 'text', width: 120 }
      ]
    },
    claim_status: {
      id: 'claim_status',
      title: 'Claim Information',
      icon: '📋',
      color: 'green',
      defaultColumn: 'id', // Always show this column
      columns: [
        { key: 'id', title: 'Claim ID', type: 'text', width: 120 },
        { key: 'status', title: 'Status', type: 'status', width: 150 },
        { key: 'submissionDate', title: 'Submitted', type: 'date', width: 120 },
        { key: 'lastUpdated', title: 'Last Updated', type: 'date', width: 120 },
        { key: 'department', title: 'Department', type: 'text', width: 120 }
      ]
    },
    diagnosis_codes: {
      id: 'diagnosis_codes',
      title: 'Diagnosis Codes',
      icon: '🏥',
      color: 'red',
      defaultColumn: 'diag1', // Always show this column
      columns: [
        { key: 'diag1', title: 'Primary Diagnosis', type: 'diagnosis', width: 140 },
        { key: 'diag2', title: 'Secondary Diagnosis', type: 'diagnosis', width: 140 },
        { key: 'diag3', title: 'Tertiary Diagnosis', type: 'diagnosis', width: 140 }
      ]
    },
    user_fields: {
      id: 'user_fields',
      title: 'User Defined Fields',
      icon: '⚙️',
      color: 'purple',
      defaultColumn: 'udf1', // Always show this column
      columns: [
        { key: 'udf1', title: 'Priority Level', type: 'text', width: 120 },
        { key: 'udf2', title: 'Specialty', type: 'text', width: 120 },
        { key: 'udf3', title: 'Assigned Doctor', type: 'text', width: 140 }
      ]
    },
    financial: {
      id: 'financial',
      title: 'Financial Information',
      icon: '💰',
      color: 'orange',
      defaultColumn: 'totalAmount', // Always show this column
      columns: [
        { key: 'totalAmount', title: 'Total Amount', type: 'currency', width: 130 },
        { key: 'provider', title: 'Provider', type: 'text', width: 200 }
      ]
    }
  };

  // All possible columns for filtering (includes hidden ones)
  const allFilterableColumns = {
    ...Object.fromEntries(
      Object.values(columnGroups).flatMap(group => 
        group.columns.map(col => [col.key, { label: col.title, ...col }])
      )
    )
  };
 
  // Get visible columns for each group
  const getVisibleColumnsForGroup = (group) => {
    let columns;
    if (expandedGroups.has(group.id)) {
      // Show all columns when expanded
      columns = group.columns;
    } else {
      // Show only default column when collapsed
      columns = group.columns.filter(col => col.key === group.defaultColumn);
    }
    // Filter out hidden columns
    return columns.filter(col => !hiddenColumns.has(col.key));
  };
 
  // Get all visible columns
  const allVisibleColumns = useMemo(() => {
    const columns = [];
    Object.values(columnGroups).forEach(group => {
      const visibleCols = getVisibleColumnsForGroup(group);
      columns.push(...visibleCols);
    });
    
    // Sort columns: pinned first, then regular
    return columns.sort((a, b) => {
      const aIsPinned = pinnedColumns.has(a.key);
      const bIsPinned = pinnedColumns.has(b.key);
      if (aIsPinned && !bIsPinned) return -1;
      if (!aIsPinned && bIsPinned) return 1;
      return 0;
    });
  }, [expandedGroups, hiddenColumns, pinnedColumns]);
 
  // Status styling
  const getStatusStyle = (status) => {
    const styles = {
      'Pending Review': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Approved': 'bg-green-100 text-green-800 border-green-200',
      'Denied': 'bg-red-100 text-red-800 border-red-200',
      'In Progress': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return styles[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };
 
  // Status icon
  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="w-4 h-4" />;
      case 'Denied': return <AlertCircle className="w-4 h-4" />;
      case 'In Progress': return <Clock className="w-4 h-4" />;
      default: return <Eye className="w-4 h-4" />;
    }
  };
 
  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = sampleClaims;
 
    // Apply filters from both activeFilters and appliedFilters
    Object.entries(activeFilters).forEach(([columnKey, filterValues]) => {
      if (filterValues && filterValues.length > 0) {
        filtered = filtered.filter(row => filterValues.includes(row[columnKey]));
      }
    });

    // Apply advanced filters from appliedFilters
    Object.entries(appliedFilters).forEach(([columnKey, filterConfig]) => {
      if (filterConfig.type === "values" && filterConfig.selectedValues.size > 0) {
        filtered = filtered.filter((row) =>
          filterConfig.selectedValues.has(row[columnKey])
        );
      } else if (filterConfig.type === "text" && filterConfig.searchText) {
        filtered = filtered.filter((row) =>
          String(row[columnKey] || "")
            .toLowerCase()
            .includes(filterConfig.searchText.toLowerCase())
        );
      } else if (
        filterConfig.type === "number" &&
        (filterConfig.min !== undefined || filterConfig.max !== undefined)
      ) {
        filtered = filtered.filter((row) => {
          const value = parseFloat(row[columnKey]);
          if (isNaN(value)) return false;
          if (filterConfig.min !== undefined && value < filterConfig.min)
            return false;
          if (filterConfig.max !== undefined && value > filterConfig.max)
            return false;
          return true;
        });
      } else if (
        filterConfig.type === "date" &&
        (filterConfig.dateFrom || filterConfig.dateTo)
      ) {
        filtered = filtered.filter((row) => {
          const rowDate = new Date(row[columnKey]);
          if (
            filterConfig.dateFrom &&
            rowDate < new Date(filterConfig.dateFrom)
          )
            return false;
          if (filterConfig.dateTo && rowDate > new Date(filterConfig.dateTo))
            return false;
          return true;
        });
      }
    });
 
    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
       
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
       
        const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        return sortConfig.direction === 'desc' ? -comparison : comparison;
      });
    }
 
    return filtered;
  }, [activeFilters, appliedFilters, sortConfig, sampleClaims]);
 
  // Toggle group expansion
  const toggleGroup = (groupId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };
 
  // Handle filtering
  const handleFilterChange = (columnKey, filterValues) => {
    setActiveFilters(prev => ({
      ...prev,
      [columnKey]: filterValues
    }));
    setCurrentPage(1);
  };
 
  // Handle sorting
  const handleSortChange = (columnKey) => {
    setSortConfig(prev => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle pin column
  const handlePinColumn = (columnKey) => {
    const newPinned = new Set(pinnedColumns);
    if (newPinned.has(columnKey)) {
      newPinned.delete(columnKey);
    } else {
      newPinned.add(columnKey);
    }
    setPinnedColumns(newPinned);
  };

  // Handle hide column
  const handleHideColumn = (columnKey) => {
    const newHidden = new Set(hiddenColumns);
    newHidden.add(columnKey);
    setHiddenColumns(newHidden);
  };

  // Handle show column
  const handleShowColumn = (columnKey) => {
    const newHidden = new Set(hiddenColumns);
    newHidden.delete(columnKey);
    setHiddenColumns(newHidden);
  };

  // Handle "Filter by" click from column header
  const handleFilterByClick = (columnKey) => {
    setActivatedFilterField(columnKey);
    setShowFilterSidebar(true);
  };

  // Get unique values for a column (for filter dropdown)
  const getUniqueValues = (columnKey) => {
    const values = sampleClaims
      .map((row) => row[columnKey])
      .filter((val) => val !== "" && val !== null && val !== undefined);
    return [...new Set(values)].sort();
  };

  // Handle filter application
  const applyFilter = (columnKey, filterConfig) => {
    setAppliedFilters((prev) => ({
      ...prev,
      [columnKey]: filterConfig,
    }));
    setActiveFilter(null);
    setCurrentPage(1);
  };

  // Remove specific filter
  const removeFilter = (columnKey) => {
    setAppliedFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[columnKey];
      return newFilters;
    });
    // Close the dropdown after clearing
    setActiveFilter(null);
    // Reset current page to 1 when filters change
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setAppliedFilters({});
    setActiveFilters({});
    setActiveFilter(null);
    setCurrentPage(1);
  };

  // Format cell content based on type (for filter dropdown)
  const formatCellContent = (value, type) => {
    if (!value && value !== 0) return "-";

    switch (type) {
      case "currency":
        return `${parseFloat(value).toLocaleString("en-US", {
          minimumFractionDigits: 2,
        })}`;
      case "date":
        return new Date(value).toLocaleDateString();
      case "status":
        return value;
      case "code":
      case "diagnosis":
        return value;
      default:
        return value;
    }
  };

  // Export functions
  const exportToCSV = (data, filename = 'claims_export.csv') => {
    // Get all visible columns for export
    const headers = allVisibleColumns.map(col => col.title);
    const keys = allVisibleColumns.map(col => col.key);
    
    // Create CSV content
    const csvContent = [
      headers.join(','), // Header row
      ...data.map(row => 
        keys.map(key => {
          const value = row[key];
          // Handle null/undefined values
          if (value === null || value === undefined) return '';
          // Handle values that might contain commas
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const exportToExcel = (data, filename = 'claims_export.xlsx') => {
    // Create Excel-compatible CSV with BOM for proper encoding
    const headers = allVisibleColumns.map(col => col.title);
    const keys = allVisibleColumns.map(col => col.key);
    
    const csvContent = [
      headers.join('\t'), // Use tab separator for Excel
      ...data.map(row => 
        keys.map(key => {
          const value = row[key];
          if (value === null || value === undefined) return '';
          return value;
        }).join('\t')
      )
    ].join('\n');
    
    // Add BOM for proper Excel encoding
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { 
      type: 'application/vnd.ms-excel;charset=utf-8;' 
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.replace('.xlsx', '.xls'); // Use .xls for better compatibility
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleExport = (format) => {
    const dataToExport = selectedClaims.size > 0 
      ? filteredAndSortedData.filter(claim => selectedClaims.has(claim.id))
      : filteredAndSortedData;
    
    const timestamp = new Date().toISOString().split('T')[0];
    const recordCount = dataToExport.length;
    const exportType = selectedClaims.size > 0 ? 'selected' : 'all';
    
    if (format === 'csv') {
      exportToCSV(dataToExport, `claims_${exportType}_${recordCount}_${timestamp}.csv`);
    } else if (format === 'excel') {
      exportToExcel(dataToExport, `claims_${exportType}_${recordCount}_${timestamp}.xlsx`);
    }
    
    setShowExportMenu(false);
  };

  // Refresh function
  const handleRefresh = () => {
    // Reset all states to refresh the view
    setSelectedClaims(new Set());
    setCurrentPage(1);
    setActiveFilters({});
    setAppliedFilters({});
    setActiveFilter(null);
    setSortConfig({ key: null, direction: null });
    setShowFilterSidebar(false);
    setShowExportMenu(false);
    
    // Reload imported claims from localStorage
    // const imported = ClaimImportService.getImportedClaims();
    // setImportedClaims(imported);
    setImportedClaims([]);
    
    // You could also add a success message here
    console.log('Claims data refreshed - all filters cleared');
  };

  // Open filter sidebar
  const handleOpenFilters = () => {
    setShowFilterSidebar(true);
    setActivatedFilterField(null); // Don't activate any specific field
  };
 
  // Handle row selection
  const toggleRowSelection = (claimId) => {
    const newSelected = new Set(selectedClaims);
    if (newSelected.has(claimId)) {
      newSelected.delete(claimId);
    } else {
      newSelected.add(claimId);
    }
    setSelectedClaims(newSelected);
  };
 
  // Select all functionality
  const toggleSelectAll = () => {
    if (selectedClaims.size === filteredAndSortedData.length) {
      setSelectedClaims(new Set());
    } else {
      setSelectedClaims(new Set(filteredAndSortedData.map(claim => claim.id)));
    }
  };
 
  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredAndSortedData.length);
  const paginatedClaims = filteredAndSortedData.slice(startIndex, endIndex);
 
  // Statistics
  const stats = {
    total: sampleClaims.length,
    approved: sampleClaims.filter(c => c.status === 'Approved').length,
    pending: sampleClaims.filter(c => c.status === 'Pending Review').length,
    denied: sampleClaims.filter(c => c.status === 'Denied').length,
    totalAmount: sampleClaims.reduce((sum, c) => sum + c.totalAmount, 0)
  };
 
  // Render cell content
  const renderCellContent = (claim, column) => {
    const value = claim[column.key];
   
    if (value === null || value === undefined) {
      return <span className="text-gray-400">—</span>;
    }
 
    switch (column.type) {
      case 'status':
        return (
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(value)}`}>
            {getStatusIcon(value)}
            {value}
          </span>
        );
      case 'currency':
        return <span className="font-semibold text-green-600">${value.toFixed(2)}</span>;
      case 'date':
        return <span className="text-sm">{new Date(value).toLocaleDateString()}</span>;
      case 'diagnosis':
        return value ? (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono border">
            {value}
          </span>
        ) : <span className="text-gray-400">—</span>;
      default:
        return <span>{value}</span>;
    }
  };
 
  return (
    <>
      {/* Add custom CSS for hiding scrollbars */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
      
    <div className="min-h-screen bg-gray-50 relative">
      {/* Floating toggle button for collapsed sidebar - only show when sidebar is collapsed */}
      {!sidebarOpen && onToggleSidebar && (
        <button
          onClick={onToggleSidebar}
          className="fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-all duration-300"
          title="Expand sidebar"
        >
          <Menu size={20} />
        </button>
      )}
      
      {/* Header - Clean version */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-800">
                Claims Management
              </h1>
            </div>
            
            <div className="flex items-center gap-3">
              {selectedClaims.size > 0 && (
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium">
                  {selectedClaims.size} selected
                </div>
              )}
              
              {/* Show active filters count */}
              {Object.keys(appliedFilters).length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded text-sm font-medium">
                    {Object.keys(appliedFilters).length} filter{Object.keys(appliedFilters).length > 1 ? 's' : ''} active
                  </div>
                  <button 
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-2 py-1 border border-orange-300 text-orange-700 rounded text-sm hover:bg-orange-50 transition-colors"
                    title="Clear all filters"
                  >
                    <X size={12} />
                    Clear All
                  </button>
                </div>
              )}
              
              {/* Refresh Button */}
              <button 
                onClick={handleRefresh}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                title="Refresh claims data"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              
              {/* Filter Button */}
              <button 
                onClick={handleOpenFilters}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                title="Filter claims"
              >
                <Filter size={16} />
                Filter Claims
              </button>
              
              <a 
                href="/claims/import"
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-decoration-none"
              >
                <Upload size={16} />
                Import Claims
              </a>
              
              {/* Export Dropdown */}
              <div className="relative export-dropdown">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <Download size={16} />
                  Export
                  <ChevronDown size={14} className={`transition-transform ${showExportMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        Export Options
                      </div>
                      
                      <button
                        onClick={() => handleExport('csv')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors mt-1"
                      >
                        <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                          <Download size={14} className="text-green-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">Download as CSV</div>
                          <div className="text-xs text-gray-500">
                            {selectedClaims.size > 0 ? `${selectedClaims.size} selected records` : `${filteredAndSortedData.length} records`}
                          </div>
                        </div>
                      </button>
                      
                      <button
                        onClick={() => handleExport('excel')}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                          <FileSpreadsheet size={14} className="text-blue-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="font-medium">Download as Excel</div>
                          <div className="text-xs text-gray-500">
                            {selectedClaims.size > 0 ? `${selectedClaims.size} selected records` : `${filteredAndSortedData.length} records`}
                          </div>
                        </div>
                      </button>
                      
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <div className="px-3 py-1 text-xs text-gray-500">
                          💡 {selectedClaims.size > 0 ? 'Selected records will be exported' : 'All visible records will be exported'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Claims Table with Advanced Grouping */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[650px] flex flex-col">
        {/* FIXED HEADERS SECTION - Horizontally Scrollable (Hidden Scrollbar) */}
        <div
          className="flex-shrink-0 overflow-y-hidden scrollbar-hide"
          style={{
            scrollbarWidth: "none" /* Firefox */,
            msOverflowStyle: "none" /* IE and Edge */,
          }}
          onScroll={(e) => {
            // Sync body scroll with header scroll
            const bodyContainer = e.target.parentElement.querySelector(
              ".body-scroll-container"
            );
            if (bodyContainer) {
              bodyContainer.scrollLeft = e.target.scrollLeft;
            }
          }}
        >
          <table className="w-full table-fixed">
            <thead>
              {/* Group Headers */}
              <tr>
                <th
                  className="bg-gray-50 border-b border-gray-200 p-3 text-left sticky left-0 z-10"
                  style={{ width: "48px" }}
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedClaims.size === filteredAndSortedData.length &&
                      filteredAndSortedData.length > 0
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300"
                  />
                </th>
                {Object.values(columnGroups).map((group, index) => {
                  const visibleColumns = getVisibleColumnsForGroup(group);
                  const isExpanded = expandedGroups.has(group.id);
                  
                  if (visibleColumns.length === 0) return null;
                  
                  // Calculate total width for the group based on visible columns
                  const groupWidth = isExpanded
                    ? group.columns.reduce(
                        (total, col) => total + parseInt(col.width),
                        0
                      )
                    : parseInt(
                        group.columns.find(
                          (col) => col.key === group.defaultColumn
                        )?.width || "120"
                      );

                  return (
                    <th
                      key={group.id}
                      colSpan={visibleColumns.length}
                      className={`bg-${group.color}-100 border-b border-gray-200 px-3 text-left font-semibold transition-all h-[40px] duration-300`}
                      style={{ width: `${groupWidth}px` }}
                    >
                      <button
                        onClick={() => toggleGroup(group.id)}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity w-full"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                        <span className={`bg-${group.color}-50 border-${group.color}-200 text-${group.color}-800 px-3 rounded-full text-sm`}>
                          {group.title}
                        </span>
                        <span className="text-sm">{group.icon}</span>
                      </button>
                    </th>
                  );
                })}
              </tr>

              {/* Sub Headers */}
              <tr>
                <th
                  className="bg-gray-100 border-b border-gray-200 p-3 text-xs text-gray-600 font-medium sticky left-0 z-10"
                  style={{ width: "48px" }}
                >
                </th>
                {allVisibleColumns.map((column) => (
                  <SubHeader
                    key={`${column.key}`}
                    column={column}
                    appliedFilters={appliedFilters}
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                    getUniqueValues={getUniqueValues}
                    formatCellContent={formatCellContent}
                    applyFilter={applyFilter}
                    removeFilter={removeFilter}
                    pinnedColumns={pinnedColumns}
                    sortConfig={sortConfig}
                    handleSortChange={handleSortChange}
                  />
                ))}
              </tr>
            </thead>
          </table>
        </div>

        {/* SCROLLABLE BODY SECTION */}
        <div
          className="flex-1 overflow-auto body-scroll-container"
          onScroll={(e) => {
            // Sync header scroll with body scroll (only horizontal)
            const headerContainer =
              e.target.parentElement.querySelector(".flex-shrink-0");
            if (
              headerContainer &&
              Math.abs(headerContainer.scrollLeft - e.target.scrollLeft) > 1
            ) {
              headerContainer.scrollLeft = e.target.scrollLeft;
            }
          }}
        >
          <table className="w-full table-fixed">
            <tbody>
              {paginatedClaims.map((claim, rowIndex) => (
                <tr
                  key={claim.id}
                  className={`hover:bg-gray-50 transition-colors ${
                    selectedClaims.has(claim.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <td
                    className="border-b border-gray-100 p-3 sticky left-0 z-10 bg-white"
                    style={{ width: "48px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedClaims.has(claim.id)}
                      onChange={() => toggleRowSelection(claim.id)}
                      className="rounded border-gray-300"
                    />
                  </td>
                  {allVisibleColumns.map((column) => (
                    <td
                      key={`${rowIndex}-${column.key}`}
                      className="border-b border-gray-100 p-3 text-sm transition-all duration-300"
                      style={{ width: column.width }}
                    >
                      {renderCellContent(claim, column)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No claims found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* FIXED FOOTER - Enhanced Pagination */}
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            {/* Left side - Results info */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {startIndex + 1} to {endIndex} of {filteredAndSortedData.length} results
              </span>
              
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Show:</label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm text-gray-600">per page</span>
              </div>
              
              {selectedClaims.size > 0 && (
                <span className="ml-4 text-blue-600 font-medium">
                  {selectedClaims.size} selected
                </span>
              )}
            </div>
            
            {/* Right side - Pagination controls */}
            <div className="flex items-center gap-2">
              {/* First page */}
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="First page"
              >
                <ChevronFirst size={16} />
              </button>
              
              {/* Previous page */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Previous page"
              >
                <ChevronLeft size={16} />
              </button>
              
              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {(() => {
                  const pages = [];
                  const maxVisiblePages = 5;
                  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
                  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
                  
                  // Adjust start page if we're near the end
                  if (endPage - startPage + 1 < maxVisiblePages) {
                    startPage = Math.max(1, endPage - maxVisiblePages + 1);
                  }
                  
                  // Show first page and ellipsis if needed
                  if (startPage > 1) {
                    pages.push(
                      <button
                        key={1}
                        onClick={() => setCurrentPage(1)}
                        className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
                      >
                        1
                      </button>
                    );
                    if (startPage > 2) {
                      pages.push(
                        <span key="ellipsis1" className="px-2 text-gray-400">...</span>
                      );
                    }
                  }
                  
                  // Show visible page range
                  for (let i = startPage; i <= endPage; i++) {
                    pages.push(
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`px-3 py-1 rounded text-sm ${
                          i === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {i}
                      </button>
                    );
                  }
                  
                  // Show ellipsis and last page if needed
                  if (endPage < totalPages) {
                    if (endPage < totalPages - 1) {
                      pages.push(
                        <span key="ellipsis2" className="px-2 text-gray-400">...</span>
                      );
                    }
                    pages.push(
                      <button
                        key={totalPages}
                        onClick={() => setCurrentPage(totalPages)}
                        className="px-3 py-1 rounded text-sm text-gray-600 hover:bg-gray-100"
                      >
                        {totalPages}
                      </button>
                    );
                  }
                  
                  return pages;
                })()}
              </div>
              
              {/* Next page */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Next page"
              >
                <ChevronRight size={16} />
              </button>
              
              {/* Last page */}
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title="Last page"
              >
                <ChevronLast size={16} />
              </button>
              
              {/* Page input for quick navigation */}
              <div className="flex items-center gap-2 ml-4 border-l border-gray-300 pl-4">
                <span className="text-sm text-gray-600">Current: <span className="font-semibold text-blue-600">{currentPage}</span></span>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-600 font-medium">Go to page:</span>
                <input
                  type="number"
                  min={1}
                  max={totalPages}
                  defaultValue=""
                  placeholder="Enter page"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                        e.target.value = ''; // Clear after successful navigation
                      } else {
                        alert(`Please enter a page number between 1 and ${totalPages}`);
                      }
                    }
                  }}
                  onInput={(e) => {
                    const value = parseInt(e.target.value);
                    // Prevent entering numbers above total pages
                    if (value > totalPages) {
                      e.target.value = totalPages;
                    }
                    // Prevent entering numbers below 1
                    if (value < 1 && e.target.value !== '') {
                      e.target.value = 1;
                    }
                  }}
                  className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pagination-input"
                />
                <span className="text-sm text-gray-600">of <span className="font-medium text-gray-800">{totalPages}</span></span>
                <button
                  onClick={() => {
                    const input = document.querySelector('.pagination-input');
                    const page = parseInt(input.value);
                    if (page >= 1 && page <= totalPages) {
                      setCurrentPage(page);
                      input.value = ''; // Clear after successful navigation
                    } else if (input.value !== '') {
                      alert(`Please enter a page number between 1 and ${totalPages}`);
                    }
                  }}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  title="Go to page"
                >
                  Go
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
        

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilterSidebar}
        onClose={() => {
          setShowFilterSidebar(false);
          setActivatedFilterField(null);
        }}
        allColumns={allFilterableColumns}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        activatedField={activatedFilterField}
        data={sampleClaims}
      />
    </div>
    </>
  );
};
 
export default ClaimsTable;