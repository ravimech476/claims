# Group Management Feature

## Overview
The Group Management feature allows users to create, manage, and execute actions on groups of claims for batch processing.

## Features

### 1. Group Page (`/groups`)
- **Location**: `src/components/GroupPage.js`
- **Route**: `/groups`
- **Description**: Main page for managing claim groups

### 2. Group Table Columns
The group table displays the following columns:

| Column | Description |
|--------|-------------|
| Group Name | Name and description of the group |
| Claims | Number of claims in the group |
| Priority | Priority level (High, Medium, Low) |
| Status | Current status (Active, Processing, Inactive) |
| Created | Group creation date |
| Action | Execute button and more options |

### 3. Group Actions

#### Create Group
- Click the "Create Group" button in the header
- Fill in group details:
  - Group Name (required)
  - Description (optional)
  - Priority Level (High/Medium/Low)
- Groups are stored in localStorage as JSON

#### Execute Group Action
- Click the "Execute" button for any group
- Simulates batch processing of claims in the group
- Updates group status to "Processing" temporarily
- Shows processing animation
- Automatically returns to "Active" status after completion

#### Additional Actions (More Options Menu)
- **View Details**: Shows comprehensive group information
- **Edit Group**: Modify group name, description, and priority
- **Delete Group**: Remove group (with confirmation)

### 4. Data Storage
Groups are stored in browser localStorage with the key `claimGroups`. The JSON structure includes:

```json
{
  "id": 1234567890,
  "name": "Group Name",
  "description": "Group Description",
  "priority": "High|Medium|Low",
  "status": "Active|Processing|Inactive",
  "claimIds": [],
  "memberCount": 0,
  "processedCount": 0,
  "createdAt": "2025-08-11T12:00:00.000Z",
  "lastUpdated": "2025-08-11T12:00:00.000Z"
}
```

### 5. Features

#### Search and Filtering
- Search by group name or description
- Filter by priority level
- Filter by status
- Real-time filtering with immediate results

#### Pagination
- Configurable page sizes (5, 10, 25, 50)
- Navigation controls (First, Previous, Next, Last)
- Shows result counts and pagination info

#### Statistics Dashboard
- Total Groups count
- Active Groups count
- Processing Groups count
- Total Claims across all groups

#### Export Functionality
- Export all groups data as JSON file
- Includes all group metadata and configurations
- File naming: `claim_groups_YYYY-MM-DD.json`

### 6. Integration with Claims Table

#### Creating Groups from Claims
- In ClaimsTable (`src/components/ClaimsTable.js`), select multiple claims
- Click "Create Group" button when claims are selected
- Groups created this way will include the selected claim IDs
- Groups are automatically saved to localStorage

#### Navigation
- Accessible via sidebar navigation under "Groups"
- Direct URL access: `/groups`
- Integrated with existing routing system

### 7. User Interface

#### Responsive Design
- Mobile-friendly responsive layout
- Collapsible sidebar support
- Touch-friendly buttons and interactions

#### Visual Indicators
- Color-coded priority levels (Red: High, Yellow: Medium, Green: Low)
- Status indicators with appropriate colors
- Loading states for async operations
- Hover effects and transitions

#### Modals
- Create Group Modal: Form for new group creation
- Edit Group Modal: Form for updating existing groups
- Group Details Modal: Comprehensive view of group information

### 8. Error Handling
- Form validation for required fields
- Confirmation dialogs for destructive actions
- Error handling for localStorage operations
- User feedback for successful operations

### 9. Performance Considerations
- Efficient filtering and pagination
- Optimized re-renders with React hooks
- Local storage for persistence
- Minimal dependencies

## Usage Examples

### Creating a New Group
1. Navigate to `/groups`
2. Click "Create Group" button
3. Enter group name and optional details
4. Click "Create Group" to save

### Executing Group Actions
1. Find the desired group in the table
2. Click the green "Execute" button
3. System will simulate processing all claims in the group
4. Status will temporarily show "Processing"
5. Completion notification will appear

### Managing Groups
1. Use the more options menu (⋮) for additional actions
2. View detailed group information
3. Edit group properties
4. Delete groups with confirmation

## Future Enhancements
- Integration with actual claim processing APIs
- Bulk operations on multiple groups
- Advanced filtering and sorting options
- Group templates and presets
- Activity logs and audit trails
- Email notifications for group completion