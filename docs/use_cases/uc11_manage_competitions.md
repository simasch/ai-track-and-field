# UC11: Manage Competitions

## 1. Use Case Description

### 1.1 Brief Description

This use case allows competition administrators to create, update, view, and delete competitions in the track and field
management system. Competitions serve as the main container for organizing athletic events, categories, and athlete
registrations.

### 1.2 Actors

- **Primary Actor**: Competition Administrator
- **System**: Track and Field Competition System

## 2. Preconditions

- The competition administrator must be authenticated and logged into the system (UC13)
- The competition administrator must have appropriate permissions to manage competitions

## 3. Basic Flow

1. The competition administrator selects "Manage Competitions" from the main menu
2. The system displays the competition management interface with a list of existing competitions
3. The competition administrator chooses one of the following actions:
    - **Create New Competition**
    - **Edit Existing Competition**
    - **View Competition Details**
    - **Delete Competition**

### 3.1 Create New Competition

1. The administrator selects "Create New Competition"
2. The system displays a competition creation form
3. The administrator enters the following required information:
    - Competition name
    - Competition date(s)
    - Location/Venue
    - Competition type (e.g., regional, national, club)
    - Status (planned, active, completed)
4. The administrator optionally enters:
    - Description
    - Registration deadline
    - Maximum participants
    - Contact information
5. The administrator submits the form
6. The system validates the entered data
7. The system creates the new competition and assigns a unique ID
8. The system displays a confirmation message

### 3.2 Edit Existing Competition

1. The administrator selects a competition from the list
2. The administrator selects "Edit"
3. The system displays the competition details in an editable form
4. The administrator modifies the desired fields
5. The administrator submits the changes
6. The system validates the modified data
7. The system updates the competition information
8. The system displays a confirmation message

### 3.3 View Competition Details

1. The administrator selects a competition from the list
2. The administrator selects "View"
3. The system displays complete competition information including:
    - Basic competition details
    - Associated categories (from UC02)
    - Assigned events (from UC03)
    - Registered athletes count
    - Competition status

### 3.4 Delete Competition

1. The administrator selects a competition from the list
2. The administrator selects "Delete"
3. The system checks for existing dependencies
4. The system displays a confirmation dialog with warning if data will be affected
5. The administrator confirms the deletion
6. The system deletes the competition (or marks as deleted if soft delete)
7. The system displays a confirmation message

## 4. Alternative Flows

### 4.1 Duplicate Competition Name

1. In step 7 of Create New Competition flow
2. If a competition with the same name and date already exists
3. The system displays an error message
4. The administrator must modify the name or date
5. The flow returns to step 3 of Create New Competition

### 4.2 Competition with Active Registrations

1. In step 3 of Delete Competition flow
2. If the competition has active athlete registrations or recorded results
3. The system displays a warning about existing data
4. The administrator can choose to:
    - Cancel the deletion
    - Archive the competition instead
    - Force delete (if permissions allow)

### 4.3 Invalid Date Range

1. In step 6 of Create/Edit Competition flow
2. If the competition end date is before the start date
3. The system displays an error message
4. The administrator must correct the dates
5. The flow returns to the form editing step

## 5. Postconditions

### Success Postconditions

- Competition information is successfully created/updated/deleted in the database
- The competition list is updated to reflect changes
- Audit log records the action taken
- Related use cases can reference the competition

### Failure Postconditions

- No changes are made to the database
- Error message is displayed to the administrator
- The system maintains data integrity

## 6. Business Rules

1. **BR-001**: Competition names must be unique for the same date range
2. **BR-002**: A competition cannot be deleted if it has recorded results (only archived)
3. **BR-003**: Competition dates cannot be in the past when creating new competitions
4. **BR-004**: Competition status transitions must follow: Planned → Active → Completed
5. **BR-005**: Only one competition can be active at the same venue on the same date

## 7. Non-Functional Requirements

- **Performance**: Competition list should load within 2 seconds
- **Usability**: Forms should have clear field validation and helpful error messages
- **Security**: All actions must be logged for audit purposes
- **Availability**: Competition management must be available during business hours

## 8. Dependencies

### This Use Case Depends On:

- **UC13**: Authenticate User - Administrator must be authenticated

### Other Use Cases Depend on This:

- **UC01**: Manage Athlete Registration - requires active competition
- **UC02**: Define Categories - categories are associated with competitions
- **UC03**: Assign Events to Categories - events are part of competitions
- **UC06**: Record Competition Results - requires competition context

## 9. Data Requirements

### Competition Entity

- Competition ID (auto-generated, unique)
- Name (required, string)
- Start Date (required, date)
- End Date (optional, date)
- Location/Venue (required, string)
- Competition Type (required, enum)
- Status (required, enum: planned/active/completed)
- Description (optional, text)
- Registration Deadline (optional, datetime)
- Maximum Participants (optional, integer)
- Contact Information (optional, structured data)
- Created By (system-generated)
- Created Date (system-generated)
- Modified By (system-generated)
- Modified Date (system-generated)

## 10. UI Requirements

### Competition List View

- Sortable table with columns: Name, Date, Location, Status, Actions
- Search/filter capabilities
- Pagination for large datasets
- Quick action buttons (Edit, View, Delete)

### Competition Form

- Clear section grouping (Basic Info, Schedule, Registration Settings)
- Date picker components for date fields
- Dropdown for status and type selection
- Validation messages inline with fields
- Save and Cancel buttons

## 11. Extension Points

- Integration with external calendar systems
- Bulk import of competitions from CSV/Excel
- Competition templates for recurring events
- Email notifications for competition changes
- Public competition calendar view