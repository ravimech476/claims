class ClaimImportService {
  // Sample claim data structure for reference
  static sampleClaimStructure = {
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
  };

  // System fields for field mapping
  static systemFields = [
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

  // Generate sample Excel data as JSON (simulating what would be in Excel)
  static generateSampleData() {
    return [
      {
        'Claim ID': 'CLM001',
        'Patient ID': 'PAT12345',
        'Patient Name': 'John Smith',
        'Status': 'Pending Review',
        'Submission Date': '2025-08-01',
        'Total Amount': 1250.00,
        'Primary Diagnosis': 'Z51.11',
        'Secondary Diagnosis': 'C78.00',
        'Priority Level': 'High Priority',
        'Specialty': 'Oncology',
        'Assigned Doctor': 'Dr. Johnson',
        'Provider': 'City Medical Center',
        'Insurance Type': 'Medicare',
        'Age': 65,
        'Gender': 'Male',
        'Department': 'Oncology'
      },
      {
        'Claim ID': 'CLM002',
        'Patient ID': 'PAT67890',
        'Patient Name': 'Sarah Johnson',
        'Status': 'Approved',
        'Submission Date': '2025-08-02',
        'Total Amount': 850.75,
        'Primary Diagnosis': 'M79.3',
        'Secondary Diagnosis': 'M25.511',
        'Tertiary Diagnosis': 'Z87.891',
        'Priority Level': 'Standard',
        'Specialty': 'Orthopedic',
        'Assigned Doctor': 'Dr. Smith',
        'Provider': 'Wellness Clinic',
        'Insurance Type': 'Private',
        'Age': 42,
        'Gender': 'Female',
        'Department': 'Orthopedic'
      },
      {
        'Claim ID': 'CLM003',
        'Patient ID': 'PAT11111',
        'Patient Name': 'Michael Brown',
        'Status': 'Denied',
        'Submission Date': '2025-08-03',
        'Total Amount': 2100.50,
        'Primary Diagnosis': 'I25.10',
        'Secondary Diagnosis': 'E11.9',
        'Tertiary Diagnosis': 'Z95.1',
        'Priority Level': 'Rush',
        'Specialty': 'Cardiology',
        'Assigned Doctor': 'Dr. Wilson',
        'Provider': 'Heart Institute',
        'Insurance Type': 'Medicaid',
        'Age': 58,
        'Gender': 'Male',
        'Department': 'Cardiology'
      }
    ];
  }

  // Simulate downloading sample file
  static async downloadSampleDirect() {
    try {
      // Generate sample data
      const sampleData = this.generateSampleData();
      
      // Convert to CSV format
      const headers = Object.keys(sampleData[0]);
      const csvContent = [
        headers.join(','),
        ...sampleData.map(row => 
          headers.map(header => {
            const value = row[header];
            // Handle values that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value || '';
          }).join(',')
        )
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'claims_import_sample.csv';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true, message: "Sample file downloaded successfully" };
    } catch (error) {
      console.error("Download error:", error);
      throw error;
    }
  }

  // Parse CSV file content
  static parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    if (lines.length < 2) {
      throw new Error('File must contain at least a header row and one data row');
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      rows.push(row);
    }

    return { headers, rows };
  }

  // Preview file content
  static async previewFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let parsedData;

          if (file.name.endsWith('.csv')) {
            parsedData = this.parseCSV(content);
          } else {
            throw new Error('Only CSV files are supported in this demo');
          }

          // Get first few rows for preview
          const previewData = parsedData.rows.slice(0, 5);
          
          resolve({
            success: true,
            data: {
              fileColumns: parsedData.headers,
              systemFields: this.systemFields,
              previewData: previewData,
              totalRows: parsedData.rows.length
            }
          });
        } catch (error) {
          reject({
            success: false,
            message: error.message
          });
        }
      };

      reader.onerror = () => {
        reject({
          success: false,
          message: 'Failed to read file'
        });
      };

      reader.readAsText(file);
    });
  }

  // Process import with field mapping
  static async processImport(file, fieldMapping, email = "") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          let parsedData;

          if (file.name.endsWith('.csv')) {
            parsedData = this.parseCSV(content);
          } else {
            throw new Error('Only CSV files are supported');
          }

          // Transform data using field mapping
          const transformedData = parsedData.rows.map((row, index) => {
            const transformedRow = {};
            
            // Apply field mapping
            Object.entries(fieldMapping).forEach(([fileColumn, systemField]) => {
              if (systemField && row[fileColumn] !== undefined) {
                transformedRow[systemField] = row[fileColumn];
              }
            });

            // Generate ID if not provided
            if (!transformedRow.id) {
              transformedRow.id = `CLM${String(Date.now() + index).slice(-6)}`;
            }

            // Set default status if not provided
            if (!transformedRow.status) {
              transformedRow.status = 'Pending Review';
            }

            // Set last updated date
            transformedRow.lastUpdated = new Date().toISOString().split('T')[0];

            return transformedRow;
          });

          // Simulate processing time
          setTimeout(() => {
            // Save to localStorage (simulating database save)
            const existingClaims = JSON.parse(localStorage.getItem('importedClaims') || '[]');
            const allClaims = [...existingClaims, ...transformedData];
            localStorage.setItem('importedClaims', JSON.stringify(allClaims));

            // Create import history record
            const importRecord = {
              id: Date.now(),
              module_name: 'Claims',
              original_filename: file.name,
              processed_records: transformedData.length,
              failed_records: 0,
              total_records: transformedData.length,
              upload_status: 'completed',
              uploaded_at: new Date().toISOString(),
              email: email
            };

            const importHistory = JSON.parse(localStorage.getItem('importHistory') || '[]');
            importHistory.unshift(importRecord);
            localStorage.setItem('importHistory', JSON.stringify(importHistory));

            resolve({
              success: true,
              message: `Successfully imported ${transformedData.length} claims`,
              data: {
                imported: transformedData.length,
                failed: 0,
                total: transformedData.length
              }
            });
          }, 1500); // Simulate processing delay

        } catch (error) {
          reject({
            success: false,
            message: error.message
          });
        }
      };

      reader.onerror = () => {
        reject({
          success: false,
          message: 'Failed to read file'
        });
      };

      reader.readAsText(file);
    });
  }

  // Get import history
  static async getImportHistory(params = {}) {
    try {
      const history = JSON.parse(localStorage.getItem('importHistory') || '[]');
      
      // Apply filtering if needed
      let filteredHistory = history;
      if (params.limit) {
        filteredHistory = history.slice(0, params.limit);
      }

      return {
        success: true,
        data: {
          imports: filteredHistory
        }
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to load import history'
      };
    }
  }

  // Get imported claims
  static getImportedClaims() {
    return JSON.parse(localStorage.getItem('importedClaims') || '[]');
  }

  // Clear all imported data (for testing)
  static clearImportedData() {
    localStorage.removeItem('importedClaims');
    localStorage.removeItem('importHistory');
  }
}

export default ClaimImportService;