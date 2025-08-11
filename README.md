# Medical Insurance Claims Management System

A comprehensive React application for managing medical insurance claims with advanced table features and responsive design.

## Features

### 🔐 Authentication
- Secure login page with form validation
- Loading states and error handling
- Demo credentials for testing

### 📊 Claims Management
- **Dynamic Header Groups**: Organize columns into logical groups (Basic Info, Medical Details, Service Info, Insurance)
- **Column Operations**:
  - Sort (Ascending/Descending)
  - Pin/Unpin columns
  - Filter by column values
  - Hide/Show columns
  - Dynamic column addition

### 🎨 User Interface
- **Responsive Sidebar**: Collapsible navigation with medical insurance specific menu items
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Mobile Friendly**: Responsive design that works on all devices
- **Interactive Elements**: Hover effects, animations, and smooth transitions

### 📋 Table Features
- **Header Groups**: Click to show only columns from specific groups
- **Search Functionality**: Global search across all visible data
- **Column Management**: Pin important columns, hide unnecessary ones
- **Sorting & Filtering**: Sort any column, filter by specific values
- **Status Indicators**: Color-coded status badges (Approved, Pending, Denied)
- **Formatted Data**: Proper currency formatting, date handling

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

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

4. Open your browser and navigate to `http://localhost:3000`

### Demo Credentials
- Username: Any text
- Password: Any text

## Project Structure

```
D:\Cliamfontend\claim/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── LoginPage.js      # Authentication component
│   │   ├── Dashboard.js      # Main dashboard layout
│   │   ├── Sidebar.js        # Navigation sidebar
│   │   └── ClaimsTable.js    # Advanced claims table
│   ├── App.js               # Main application component
│   ├── App.css              # Application styles
│   ├── index.js             # React entry point
│   └── index.css            # Global styles
├── package.json
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Column Groups

The application organizes columns into the following groups:

1. **Basic Info**: Claim ID, Line ID, Patient ID, Date
2. **Medical Details**: Procedure, Diagnosis, Specialty, Provider
3. **Service Info**: Place of Service, Amount, Status
4. **Insurance**: Insurance Provider, Member Name

## Customization

### Adding New Columns
1. Update the `allColumns` object in `ClaimsTable.js`
2. Add sample data to the `sampleClaimsData` array
3. Optionally add the column to a group in `columnGroups`

### Adding New Menu Items
1. Update the `menuItems` array in `Sidebar.js`
2. Add corresponding icons from Lucide React
3. Implement navigation logic as needed

### Styling
- The application uses Tailwind CSS for styling
- Custom animations and colors are defined in `tailwind.config.js`
- Additional custom styles are in `App.css`

## Technologies Used

- **React 18** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Create React App** - Build tooling

## Future Enhancements

- Backend API integration
- Real-time data updates
- Export functionality (PDF, Excel)
- Advanced filtering and search
- Role-based permissions
- Audit trail and logging
- Bulk operations
- Print functionality

## Support

For questions or issues, please refer to the project documentation or contact the development team.