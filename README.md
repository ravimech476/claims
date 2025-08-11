# Medical Claims Management System

This is a React-based medical claims management system with import functionality.

## Features

### Claims Management
- View and manage medical claims in a comprehensive table
- Advanced filtering and sorting capabilities
- Column grouping (Patient Info, Claim Status, Diagnosis Codes, User Fields, Financial)
- Pagination with customizable page sizes
- Pin/hide columns functionality
- Export functionality

### Import Claims
- **Step 1: File Upload**
  - Download sample CSV template
  - Upload CSV files (up to 10MB)
  - Email notifications for import status

- **Step 2: Field Mapping**
  - Map CSV columns to system fields
  - Visual preview of data
  - Validation for required fields

- **Step 3: Import Processing**
  - Frontend-only processing (no API required)
  - Data stored in localStorage
  - Import history tracking

### Supported Fields
- **Basic Info**: Claim ID, Patient ID, Patient Name
- **Status**: Pending Review, Approved, Denied, In Progress
- **Financial**: Total Amount, Provider, Insurance Type
- **Medical**: Primary/Secondary/Tertiary Diagnosis codes
- **User Defined**: Priority Level, Specialty, Assigned Doctor
- **Demographics**: Age, Gender, Department

## Installation

1. Navigate to the project directory:
   ```bash
   cd D:\Cliamfontend\claim
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and go to `http://localhost:3000`

## Usage

### Viewing Claims
1. The main page shows the claims table
2. Use filters to narrow down results
3. Click column headers to sort
4. Use the pagination controls at the bottom

### Importing Claims
1. Click the "Import Claims" button in the header
2. Download the sample CSV file to see the expected format
3. Prepare your CSV file with claim data
4. Upload the file and map columns to system fields
5. Review the import and click "Start Import"
6. View import history to track all imports

### Sample Data Format
The CSV should include columns like:
```
Claim ID,Patient ID,Patient Name,Status,Submission Date,Total Amount,Primary Diagnosis,Provider,Insurance Type,Age,Gender,Department
CLM001,PAT12345,John Smith,Pending Review,2025-08-01,1250.00,Z51.11,City Medical Center,Medicare,65,Male,Oncology
```

## Technical Details

### Frontend-Only Architecture
- No backend API required
- Data processing using File Reader API
- CSV parsing with custom JavaScript functions
- Data persistence using localStorage
- React Router for navigation

### File Structure
```
src/
├── components/
│   ├── ClaimsTable.js          # Main claims table component
│   ├── ClaimImportPage.js      # Import functionality
│   ├── ExcelFilter.js          # Column filtering
│   └── FilterSidebar.js        # Advanced filtering
├── services/
│   └── ClaimImportService.js   # Import logic and data processing
└── App.jsx                     # Main app with routing
```

### Technologies Used
- React 18
- React Router DOM
- Tailwind CSS
- Lucide React Icons
- Local Storage for data persistence

## Development

### Adding New Fields
1. Update `ClaimImportService.systemFields` array
2. Add the field to column groups in `ClaimsTable.js`
3. Update the sample data generation

### Customizing Import Logic
- Modify `ClaimImportService.js` for different file formats
- Update field validation rules
- Customize data transformation logic

## Demo Features

### Test Data
- Includes 30+ sample claims for testing
- Various statuses, departments, and diagnosis codes
- Realistic patient and provider information

### Import Testing
1. Use the "Download Sample File" to get a CSV template
2. Modify the CSV with your own data
3. Test the import process end-to-end
4. Check localStorage to see persisted data

## Browser Support
- Modern browsers with ES6+ support
- File Reader API support required
- localStorage support required

## Notes
- All data is stored locally in the browser
- Refresh the page to see imported claims in the main table
- Import history is maintained across sessions
- No server-side processing required
