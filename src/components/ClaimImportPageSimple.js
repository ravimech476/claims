import React, { useState, useEffect } from "react";
import {
  Upload,
  Download,
  FileSpreadsheet,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  FileX,
  Loader,
  Eye,
  Trash2,
} from "lucide-react";

const ClaimImportPageSimple = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("user@example.com");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [fieldMapping, setFieldMapping] = useState({});

  // System fields for mapping
  const systemFields = [
    { key: 'id', label: 'Claim ID', required: true, type: 'text' },
    { key: 'patientId', label: 'Patient ID', required: true, type: 'text' },
    { key: 'patientName', label: 'Patient Name', required: true, type: 'text' },
    { key: 'status', label: 'Status', required: false, type: 'select', options: ['Pending Review', 'Approved', 'Denied', 'In Progress'] },
    { key: 'submissionDate', label: 'Submission Date', required: true, type: 'date' },
    { key: 'totalAmount', label: 'Total Amount', required: true, type: 'number' },
    { key: 'diag1', label: 'Primary Diagnosis', required: false, type: 'text' },
    { key: 'diag2', label: 'Secondary Diagnosis', required: false, type: 'text' },
    { key: 'diag3', label: 'Tertiary Diagnosis', required: false, type: 'text' },
    { key: 'udf1', label: 'Priority Level', required: false, type: 'text' },
    { key: 'udf2', label: 'Specialty', required: false, type: 'text' },
    { key: 'udf3', label: 'Assigned Doctor', required: false, type: 'text' },
    { key: 'provider', label: 'Provider', required: false, type: 'text' },
    { key: 'insuranceType', label: 'Insurance Type', required: false, type: 'select', options: ['Medicare', 'Medicaid', 'Private'] },
    { key: 'age', label: 'Age', required: false, type: 'number' },
    { key: 'gender', label: 'Gender', required: false, type: 'select', options: ['Male', 'Female', 'Other'] },
    { key: 'department', label: 'Department', required: false, type: 'text' }
  ];

  const handleDirectDownload = () => {
    // Simple CSV content with proper headers
    const csvContent = `Claim ID,Patient ID,Patient Name,Status,Submission Date,Total Amount,Primary Diagnosis,Secondary Diagnosis,Priority Level,Specialty,Assigned Doctor,Provider,Insurance Type,Age,Gender,Department
CLM001,PAT001,John Doe,Pending Review,2025-08-01,1500.00,Z51.11,C78.00,High Priority,Oncology,Dr. Johnson,City Medical Center,Medicare,65,Male,Oncology
CLM002,PAT002,Jane Smith,Approved,2025-08-02,850.75,M79.3,M25.511,Standard,Orthopedic,Dr. Smith,Wellness Clinic,Private,42,Female,Orthopedic
CLM003,PAT003,Mike Wilson,Denied,2025-08-03,2100.50,I25.10,E11.9,Rush,Cardiology,Dr. Wilson,Heart Institute,Medicaid,58,Male,Cardiology`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'claims_sample.csv';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < Math.min(lines.length, 6); i++) { // Only take first 5 data rows for preview
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return { headers, rows };
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    setLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const parsedData = parseCSV(content);
        
        setFilePreview({
          fileColumns: parsedData.headers,
          systemFields: systemFields,
          previewData: parsedData.rows,
          totalRows: parsedData.rows.length
        });
        
        setLoading(false);
        setCurrentStep(2);
      } catch (error) {
        setLoading(false);
        alert('Error processing file: ' + error.message);
      }
    };

    reader.onerror = () => {
      setLoading(false);
      alert('Failed to read file');
    };

    reader.readAsText(selectedFile);
  };

  const handleFieldMappingChange = (fileColumn, systemField) => {
    setFieldMapping((prev) => ({
      ...prev,
      [fileColumn]: systemField,
    }));
  };

  const handleImportProcess = () => {
    const mappedFields = Object.keys(fieldMapping).filter(
      (key) => fieldMapping[key]
    );
    if (mappedFields.length === 0) {
      alert("Please map at least one field");
      return;
    }

    setLoading(true);
    // Simulate processing
    setTimeout(() => {
      setLoading(false);
      setCurrentStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Upload className="h-6 w-6 mr-3 text-blue-600" />
              Import Claims
            </h1>
            <p className="text-gray-600 mt-1">
              Import claim data from CSV files
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => window.history.back()}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Claims
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            {/* Step 1 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 1 ? <CheckCircle className="h-5 w-5" /> : "1"}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Upload File</div>
                <div className="text-sm text-gray-600">Select your data file</div>
              </div>
            </div>

            <div
              className={`h-0.5 flex-1 mx-4 ${
                currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"
              }`}
            />

            {/* Step 2 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep > 2 ? <CheckCircle className="h-5 w-5" /> : "2"}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Map Fields</div>
                <div className="text-sm text-gray-600">Match your columns</div>
              </div>
            </div>

            <div
              className={`h-0.5 flex-1 mx-4 ${
                currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"
              }`}
            />

            {/* Step 3 */}
            <div className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {currentStep >= 3 ? <CheckCircle className="h-5 w-5" /> : "3"}
              </div>
              <div className="ml-3">
                <div className="font-medium text-gray-800">Complete</div>
                <div className="text-sm text-gray-600">Import finished</div>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Download Sample File */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Download Sample Import File
                </h2>

                <div className="text-center py-6">
                  <FileSpreadsheet className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-600 mb-6">
                    Get a sample CSV file with example claim data.
                  </p>

                  <button
                    onClick={handleDirectDownload}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center"
                  >
                    <Download className="h-5 w-5 mr-3" />
                    Download Sample File
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📋 <strong>Includes:</strong> Claim IDs, patient info, diagnosis codes, amounts
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  📧 Email for Notifications
                </h2>

                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Upload Your File
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileSpreadsheet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <div className="text-gray-600 mb-2">
                    {selectedFile ? selectedFile.name : "Choose a file"}
                  </div>
                  <div className="text-sm text-gray-500">
                    (.csv files up to 10MB)
                  </div>
                </label>
              </div>

              {selectedFile && (
                <button
                  onClick={handleFileUpload}
                  disabled={loading}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Upload and Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && filePreview && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Field Mapping
            </h2>
            
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Instructions:</strong> Map each column from your CSV file to the corresponding system field. 
                Required fields are marked with an asterisk (*).
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filePreview.fileColumns.map((fileColumn, index) => {
                // Get list of already selected system fields (excluding current column)
                const selectedFields = Object.keys(fieldMapping)
                  .filter(key => key !== fileColumn && fieldMapping[key])
                  .map(key => fieldMapping[key]);

                return (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    {/* Dropdown moved to top */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Map to System Field
                      </label>
                      <select
                        value={fieldMapping[fileColumn] || ""}
                        onChange={(e) =>
                          handleFieldMappingChange(fileColumn, e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">Select Field</option>
                        {filePreview.systemFields.map((field) => {
                          const isDisabled = selectedFields.includes(field.key);
                          return (
                            <option 
                              key={field.key} 
                              value={field.key}
                              disabled={isDisabled}
                              style={isDisabled ? { color: '#9CA3AF', backgroundColor: '#F3F4F6' } : {}}
                            >
                              {field.label} {field.required ? "*" : ""} {isDisabled ? "(Already mapped)" : ""}
                            </option>
                          );
                        })}
                      </select>
                      
                      {/* Show field type info */}
                      {fieldMapping[fileColumn] && (
                        <div className="mt-1 text-xs text-gray-500">
                          {(() => {
                            const field = systemFields.find(f => f.key === fieldMapping[fileColumn]);
                            return field ? `Type: ${field.type}${field.required ? ' (Required)' : ''}` : '';
                          })()}
                        </div>
                      )}
                    </div>

                    {/* Preview box moved below dropdown */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2 flex items-center">
                        <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
                        {fileColumn}
                      </h3>
                      <div className="text-sm text-gray-600">
                        <div className="font-medium mb-1">Preview Values:</div>
                        <div className="space-y-1">
                          {filePreview.previewData
                            .slice(0, 3)
                            .map((row, rowIndex) => (
                              <div
                                key={rowIndex}
                                className="text-xs bg-white px-2 py-1 rounded border truncate"
                                title={row[fileColumn] || "Empty"}
                              >
                                {row[fileColumn] || <span className="text-gray-400 italic">Empty</span>}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mapping Summary */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">Mapping Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-green-700 mb-2">Mapped Fields ({Object.keys(fieldMapping).filter(key => fieldMapping[key]).length})</h4>
                  <div className="space-y-1">
                    {Object.entries(fieldMapping).filter(([key, value]) => value).map(([fileCol, sysField]) => {
                      const field = systemFields.find(f => f.key === sysField);
                      return (
                        <div key={fileCol} className="text-xs text-gray-600">
                          <span className="font-medium">{fileCol}</span> → {field?.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-red-700 mb-2">Required Fields Missing</h4>
                  <div className="space-y-1">
                    {systemFields.filter(field => field.required && !Object.values(fieldMapping).includes(field.key)).map(field => (
                      <div key={field.key} className="text-xs text-red-600">
                        {field.label} *
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </button>

              <button
                onClick={handleImportProcess}
                disabled={
                  loading ||
                  Object.keys(fieldMapping).filter((key) => fieldMapping[key])
                    .length === 0
                }
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Processing Import...
                  </>
                ) : (
                  <>
                    Start Import ({Object.keys(fieldMapping).filter(key => fieldMapping[key]).length} fields mapped)
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Import Completed!
            </h2>
            <p className="text-gray-600 mb-6">
              Your claim data has been successfully imported.
            </p>

            <div className="mb-6 p-4 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800">
                <div className="font-medium">Import Summary:</div>
                <div className="mt-2 space-y-1">
                  <div>✅ {Object.keys(fieldMapping).filter(key => fieldMapping[key]).length} fields mapped</div>
                  <div>✅ Data processed successfully</div>
                  <div>✅ Records saved to system</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View Claims
              </button>
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setSelectedFile(null);
                  setFilePreview(null);
                  setFieldMapping({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Import More
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimImportPageSimple;