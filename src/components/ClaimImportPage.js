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
import ClaimImportService from "../services/ClaimImportService";

// Toast notification component
const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300`}>
      <div className="flex items-center">
        {type === "error" ? (
          <AlertCircle className="h-5 w-5 mr-2" />
        ) : (
          <CheckCircle className="h-5 w-5 mr-2" />
        )}
        {message}
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ClaimImportPage = () => {
  // State management
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fieldMapping, setFieldMapping] = useState({});
  const [loading, setLoading] = useState(false);
  const [importHistory, setImportHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    // Get user email from localStorage or set default
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    if (userData.email) {
      setEmail(userData.email);
    } else {
      setEmail("user@example.com"); // Default email for demo
    }

    // Load import history
    loadImportHistory();
  }, []);

  // Toast notification function
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Close toast manually
  const closeToast = () => {
    setToast({ show: false, message: "", type: "" });
  };

  const loadImportHistory = async () => {
    try {
      const response = await ClaimImportService.getImportHistory({
        limit: 10,
      });
      if (response.success) {
        setImportHistory(response.data.imports);
      }
    } catch (error) {
      console.error("Failed to load import history:", error);
    }
  };

  const handleDirectDownload = async () => {
    try {
      setLoading(true);
      await ClaimImportService.downloadSampleDirect();
      showToast("Sample file downloaded successfully!");
    } catch (error) {
      showToast("Failed to download sample file", "error");
      console.error("Direct download error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ["text/csv"];
      
      if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv')) {
        showToast("Please select a CSV file", "error");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        showToast("File size should be less than 10MB", "error");
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      showToast("Please select a file first", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await ClaimImportService.previewFile(selectedFile);
      if (response.success) {
        setFilePreview(response.data);
        setCurrentStep(2);
        showToast("File uploaded successfully!");
      } else {
        showToast(response.message || "Failed to process file", "error");
      }
    } catch (error) {
      showToast("Failed to upload file", "error");
      console.error("File upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldMappingChange = (fileColumn, systemField) => {
    setFieldMapping((prev) => ({
      ...prev,
      [fileColumn]: systemField,
    }));
  };

  const handleImportProcess = async () => {
    const mappedFields = Object.keys(fieldMapping).filter(
      (key) => fieldMapping[key]
    );
    if (mappedFields.length === 0) {
      showToast("Please map at least one field", "error");
      return;
    }

    try {
      setLoading(true);
      const response = await ClaimImportService.processImport(
        selectedFile,
        fieldMapping,
        email
      );
      if (response.success) {
        setCurrentStep(3);
        showToast(response.message);
        loadImportHistory();
      } else {
        showToast(response.message || "Import failed", "error");
      }
    } catch (error) {
      showToast("Import failed", "error");
      console.error("Import process error:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "failed":
        return <FileX className="h-4 w-4 text-red-600" />;
      case "processing":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      completed: "bg-green-100 text-green-800",
      failed: "bg-red-100 text-red-800",
      processing: "bg-yellow-100 text-yellow-800",
      pending: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </span>
    );
  };



  if (showHistory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Toast 
          show={toast.show} 
          message={toast.message} 
          type={toast.type} 
          onClose={closeToast} 
        />
        
        {/* History Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Clock className="h-6 w-6 mr-3 text-blue-600" />
                Import History
              </h1>
              <p className="text-gray-600 mt-1">
                Track all your claim import activities
              </p>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Import
            </button>
          </div>
        </div>

        {/* History Table */}
        <div className="p-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Records
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {importHistory.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No import history found
                      </td>
                    </tr>
                  ) : (
                    importHistory.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">
                            {record.module_name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {record.original_filename}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-green-600 font-medium">
                              {record.processed_records} processed
                            </div>
                            {record.failed_records > 0 && (
                              <div className="text-red-600">
                                {record.failed_records} failed
                              </div>
                            )}
                            <div className="text-gray-500">
                              {record.total_records} total
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {getStatusIcon(record.upload_status)}
                            <span className="ml-2">
                              {getStatusBadge(record.upload_status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600">
                            {new Date(record.uploaded_at).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
        onClose={closeToast} 
      />
      
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
              onClick={() => setShowHistory(true)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center"
            >
              <Clock className="h-4 w-4 mr-2" />
              View History
            </button>
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
                <div className="font-medium text-gray-800">
                  Upload File
                </div>
                <div className="text-sm text-gray-600">
                  Select your data file
                </div>
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
                <div className="font-medium text-gray-800">
                  Map Fields
                </div>
                <div className="text-sm text-gray-600">
                  Match your columns
                </div>
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
                <div className="text-sm text-gray-600">
                  Import finished
                </div>
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
                    Get a sample CSV file with example claim data to
                    understand the correct format.
                  </p>

                  <button
                    onClick={handleDirectDownload}
                    disabled={loading}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-3" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="h-5 w-5 mr-3" />
                        Download Sample File
                      </>
                    )}
                  </button>

                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">
                      📋 <strong>Includes:</strong> Claim IDs, patient info, diagnosis codes, amounts
                    </p>
                  </div>
                </div>
              </div>

              {/* Email for Notifications */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  📧 Email for Import Notifications
                </h2>

                <div className="max-w-md mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    🔔 You'll receive import status notifications
                    (success/failure) at this email address.
                  </p>
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
                  disabled={loading || !email}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                      Processing...
                    </>
                  ) : !email ? (
                    <>
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Please enter email address first
                    </>
                  ) : (
                    <>
                      Upload and Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}

              {selectedFile && !email && (
                <p className="text-sm text-yellow-600 mt-3 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Email is required for import notifications
                </p>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && filePreview && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Field Mapping
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {filePreview.fileColumns.map((fileColumn, index) => {
                // Get list of already selected system fields (excluding current column)
                const selectedFields = Object.keys(fieldMapping)
                  .filter(key => key !== fileColumn && fieldMapping[key])
                  .map(key => fieldMapping[key]);

                return (
                  <div key={index} className="">
                    {/* Dropdown */}
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
                    </div>

                    {/* Preview box */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium text-gray-800 mb-2">
                        {fileColumn}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Preview Values:
                        <div className="mt-1 space-y-1">
                          {filePreview.previewData
                            .slice(0, 2)
                            .map((row, rowIndex) => (
                              <div
                                key={rowIndex}
                                className="text-xs bg-white px-2 py-1 rounded border"
                              >
                                {row[fileColumn] || "Empty"}
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
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
                    Start Import
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

export default ClaimImportPage;