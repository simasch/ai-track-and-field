# Use Case: Manage Competitions

## Overview

**Use Case ID:** UC-001  
**Use Case Name:** Manage Competitions  
**Primary Actor:** Administrator  
**Goal:** Allow administrators to create, view, edit, and delete track and field competitions  
**Status:** Not Started

## Preconditions

- The administrator is authenticated and has appropriate permissions
- The system is operational and the database is accessible

## Main Success Scenario

1. Administrator navigates to the competition management interface
2. System displays a list of existing competitions with their key details (name, date, location, status)
3. Administrator selects to create a new competition
4. System presents a competition creation form
5. Administrator enters competition details:
    - Name (required)
    - Date (required)
    - Location (required)
    - Status (defaults to "planned")
6. Administrator submits the form
7. System validates the input data
8. System creates the competition record with a unique ID
9. System displays a success message and shows the updated competition list
10. Use case ends

## Alternative Flows

### A1: Edit Existing Competition

**Trigger:** Administrator selects to edit a competition in step 3
**Flow:**

1. System retrieves and displays the selected competition's current data in an editable form
2. Administrator modifies one or more fields
3. Administrator submits the changes
4. System validates the updated data
5. System updates the competition record
6. System displays a success message
7. Use case resumes at step 9 of main flow

### A2: Delete Competition

**Trigger:** Administrator selects to delete a competition in step 3
**Flow:**

1. System displays a confirmation dialog warning about the deletion
2. Administrator confirms the deletion
3. System checks if the competition has dependent data (categories, athletes, results)
4. System deletes the competition record
5. System displays a success message
6. Use case resumes at step 9 of main flow

### A3: Validation Error

**Trigger:** System validation fails in step 7 or A1.4
**Flow:**

1. System displays error message(s) indicating which fields are invalid
2. System keeps the form open with the entered data preserved
3. Use case resumes at step 5 (or A1.2 for edit flow)

### A4: Cancel Operation

**Trigger:** Administrator cancels the create/edit operation during step 5, 6, or A1.2
**Flow:**

1. System discards any unsaved changes
2. System returns to the competition list view
3. Use case resumes at step 2

### A5: View Competition Details

**Trigger:** Administrator selects to view a competition in step 3
**Flow:**

1. System displays detailed information about the selected competition including:
    - All competition attributes
    - Associated categories
    - Number of registered athletes
    - Summary of recorded results
2. Administrator reviews the information
3. Administrator may choose to edit or return to the list
4. Use case resumes at step 2

## Postconditions

### Success Postconditions

- For creation: A new competition record exists in the database with a unique ID and status "planned"
- For editing: The competition record is updated with the modified information
- For deletion: The competition record and its dependent data are removed from the database
- The competition list reflects the current state of all competitions
- Changes are persisted in the database

### Failure Postconditions

- No changes are made to the database
- The user is informed of the error via appropriate error messages
- The system remains in a consistent state
- User can retry the operation or cancel

## Business Rules

### BR-001: Competition Name Uniqueness

- Competition names must be unique within the system
- Duplicate names are not allowed

### BR-002: Competition Date Validity

- Competition date cannot be in the past when creating a new competition
- Competition date can be updated to past dates for historical records

### BR-003: Required Fields

- Name, date, and location are mandatory fields
- Status defaults to "planned" if not specified

### BR-004: Competition Status Values

- Valid status values: "planned", "ongoing", "completed", "cancelled"
- Status transitions follow logical progression (e.g., planned → ongoing → completed)

### BR-005: Deletion Constraints

- Competitions with recorded results should show a warning before deletion
- System should verify administrator confirmation before deletion
- Cascade deletion of dependent entities (categories, events, results) when competition is deleted

### BR-006: Data Validation

- Name: 1-255 characters
- Location: 1-255 characters
- Date: Valid date format

### BR-007: Audit Trail

- System should log all create, update, and delete operations with timestamp and user information