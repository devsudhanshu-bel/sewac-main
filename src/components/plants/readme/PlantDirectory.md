# PlantDirectory Component Documentation

## 1. Component Overview

### Component Name

PlantDirectory

### File Location

src/components/plants/PlantDirectory.jsx

### Purpose

The PlantDirectory component is responsible for displaying the available plants in the SEWAC Plants module.

It provides the main plant listing interface where users can view plant records and perform actions such as viewing, editing, and deleting plant information.

The component acts as the central directory for plant records.

It provides:

- Plant listing
- Plant information display
- Plant search or filtering
- Plant action controls
- Edit action
- Delete action
- Plant details access
- Plant record organization
- Interaction with plant modal components

---

## 2. Responsibilities

The PlantDirectory component is responsible for:

- Displaying plant records.
- Organizing plant information in a structured directory.
- Showing important plant fields.
- Providing actions for individual plant records.
- Opening the EditPlantModal when editing is requested.
- Opening the DeletePlantModal when deletion is requested.
- Opening the plant details view when required.
- Communicating with the parent Plants component.
- Updating or refreshing displayed plant information after plant operations.

The component acts as the primary interface for managing existing plant records.

---

## 3. Component Interface

The component receives plant-related data and callbacks from its parent component.

Conceptually:

    <PlantDirectory
      plants={plants}
    />

The exact props depend on the implementation of PlantDirectory.jsx.

The parent component can provide:

- Plant data
- Loading state
- Callback functions
- Refresh functions
- Other required information

---

## 4. Plant Data

The PlantDirectory component receives or works with a collection of plant records.

Each plant record contains information about an individual plant.

Plant information can include:

- Plant ID
- Plant name
- Plant type
- City
- Zone
- Division
- Ward
- Plant manager
- Processing capacity
- Vehicles enrolled
- Total waste collected
- Latitude
- Longitude
- Status

The exact fields depend on the plant data supplied by the application.

---

## 5. Plant Listing

The main purpose of the component is to display plant records in an organized list or table.

The general structure is:

    Plant Directory
          ↓
    Plant Records
          ↓
    ┌───────────────────────────────┐
    │ Plant Information             │
    │ Plant Information             │
    │ Plant Information             │
    │ Plant Information             │
    └───────────────────────────────┘

Each record represents an individual plant.

The directory allows users to quickly identify and work with existing plants.

---

## 6. Plant Information Display

The directory displays important information for each plant.

Depending on the implementation, the displayed information can include:

- Plant name
- Plant type
- Location
- Plant manager
- Capacity
- Vehicles
- Waste collected
- Status

The information is organized so that users can quickly understand the plant record.

---

## 7. Plant Status

The PlantDirectory displays the current status of each plant.

The status indicates whether the plant is currently active or inactive.

Typical values include:

    ACTIVE
    INACTIVE

The status can be displayed using a badge, label, or other visual indicator depending on the existing UI implementation.

The basic flow is:

    Plant Record
         ↓
    Plant Status
         ↓
    Status Display
         ↓
    User Understands Plant State

---

## 8. Plant Actions

The directory provides actions that can be performed on individual plant records.

Common actions include:

    View / Details
    Edit
    Delete

These actions allow the user to interact with the selected plant.

The general flow is:

    Plant Record
         ↓
    User Selects Action
         ↓
    ┌───────────────┬───────────────┐
    ↓               ↓               ↓
   View            Edit           Delete
    ↓               ↓               ↓
 Details         Edit Modal     Delete Modal

---

## 9. Edit Action

When the user selects the Edit action for a plant, the PlantDirectory passes the selected plant information to the EditPlantModal.

The flow is:

    PlantDirectory
          ↓
    User Selects Edit
          ↓
    Selected Plant
          ↓
    EditPlantModal
          ↓
    Edit Plant Information

After a successful update, the PlantDirectory can refresh or update the displayed plant record.

---

## 10. Delete Action

When the user selects Delete for a plant, the PlantDirectory passes the selected plant to the DeletePlantModal.

The flow is:

    PlantDirectory
          ↓
    User Selects Delete
          ↓
    Selected Plant
          ↓
    DeletePlantModal
          ↓
    Confirmation
          ↓
    DELETE Request
          ↓
    Plant Removed

After successful deletion, the PlantDirectory can refresh the displayed plant data.

---

## 11. Plant Details Action

The directory can provide an action for viewing more information about a selected plant.

When the user selects the details or view action, the selected plant information can be displayed using the relevant plant details interface.

The flow is:

    PlantDirectory
          ↓
    User Selects View / Details
          ↓
    Selected Plant
          ↓
    Plant Details View
          ↓
    User Reviews Information

The details functionality is separate from editing and deleting.

---

## 12. Search and Filtering

If search or filtering functionality is implemented in PlantDirectory.jsx, it allows users to locate plant records more easily.

The general flow is:

    User Enters Search / Filter
              ↓
        Plant Data Filtered
              ↓
       Matching Plants Displayed

Possible filtering criteria can include:

- Plant name
- Location
- Status
- Plant type
- Other available plant fields

The exact search and filter behavior depends on the implementation of the component.

---

## 13. Empty State

When there are no plant records to display, the directory can display an appropriate empty state.

The empty state informs the user that there are currently no matching or available plant records.

The general flow is:

    Plant Data
         ↓
    No Records
         ↓
    Empty State
         ↓
    User Informed

If search or filtering is active, the empty state can also indicate that no records match the selected criteria.

---

## 14. Loading State

If plant data is being loaded from the backend, the PlantDirectory can display a loading state.

The loading state prevents the user from assuming that there are no plant records while the data is still being retrieved.

The flow is:

    Backend Request
         ↓
       Loading
         ↓
    Loading State
         ↓
    Plant Data Received
         ↓
    Plant Directory Displayed

The exact loading implementation depends on the parent component and PlantDirectory.jsx.

---

## 15. Plant Record Selection

The directory identifies the plant associated with the action selected by the user.

When an action is triggered, the corresponding plant record becomes the selected plant.

The flow is:

    Plant List
       ↓
    User Selects Action
       ↓
    Selected Plant
       ↓
    Action Component

This selected plant is then supplied to the appropriate modal or operation.

---

## 16. Relationship With CreatePlantModal

PlantDirectory works together with CreatePlantModal for adding new plant records.

The CreatePlantModal is responsible for collecting new plant information.

After a successful creation, the PlantDirectory can be refreshed to display the newly created plant.

The relationship is:

    CreatePlantModal
          ↓
    Create Plant
          ↓
    Backend
          ↓
    Plant Created
          ↓
    PlantDirectory Refreshed
          ↓
    New Plant Displayed

---

## 17. Relationship With EditPlantModal

PlantDirectory works with EditPlantModal for modifying existing plant records.

The relationship is:

    PlantDirectory
          ↓
    Select Edit
          ↓
    EditPlantModal
          ↓
    Modify Plant
          ↓
    PUT Request
          ↓
    Backend
          ↓
    Plant Updated
          ↓
    PlantDirectory Refreshed / Updated

This allows the directory to display the latest plant information after editing.

---

## 18. Relationship With DeletePlantModal

PlantDirectory works with DeletePlantModal for deleting existing plant records.

The relationship is:

    PlantDirectory
          ↓
    Select Delete
          ↓
    DeletePlantModal
          ↓
    Confirm Delete
          ↓
    DELETE Request
          ↓
    Backend
          ↓
    Plant Deleted
          ↓
    PlantDirectory Refreshed / Updated

This keeps the deletion confirmation separate from the main directory.

---

## 19. Relationship With PlantKPICards

PlantDirectory and PlantKPICards provide two different views of the plant data.

PlantKPICards provides a summary of important plant statistics.

PlantDirectory provides individual plant records.

The relationship is:

    Plants Module
          ↓
    ┌───────────────────────┐
    │                       │
    ↓                       ↓
PlantKPICards        PlantDirectory
    ↓                       ↓
Summary Statistics     Plant Records

Together, these components provide both an overview and detailed plant-level information.

---

## 20. Relationship With PlantLocations

PlantDirectory works as part of the overall Plants module alongside PlantLocations.

PlantLocations can provide a geographical representation or location-based information about the plants.

The relationship is:

    Plants Module
          ↓
    ┌───────────────────────┐
    │                       │
    ↓                       ↓
PlantDirectory       PlantLocations
    ↓                       ↓
Plant Records        Location Information

This allows plant information and plant location information to be presented as separate parts of the Plants module.

---

## 21. Data Flow

The PlantDirectory follows a data flow similar to:

    Backend / Parent Component
              ↓
          Plant Data
              ↓
        PlantDirectory
              ↓
       Plant Records
              ↓
        User Action
              ↓
    ┌─────────┼──────────┐
    ↓         ↓          ↓
   View      Edit       Delete
    ↓         ↓          ↓
 Details    Edit Modal  Delete Modal
              ↓          ↓
           Backend    Backend
              ↓          ↓
        Updated Data / Deleted Data
              ↓
        PlantDirectory Refresh
              ↓
        Updated Plant List

---

## 22. Parent-Child Communication

The PlantDirectory communicates with the parent Plants component through props and callback functions.

The parent component can provide:

- Plant records
- Loading information
- Refresh functions
- Action callbacks
- Other plant-related state

The relationship is:

    Plants.jsx
        ↓
    PlantDirectory
        ↓
    Plant Records
        ↓
    User Actions
        ↓
    Parent Callback / Modal

This keeps the overall Plants page logic separate from the plant listing interface.

---

## 23. User Interaction Flow

From the user's perspective, the typical interaction is:

    1. Open the Plants page.
            ↓
    2. View the Plant Directory.
            ↓
    3. Locate the required plant.
            ↓
    4. Select the required action.
            ↓
    5. View, edit, or delete the plant.

### View

    Select View
        ↓
    Plant Details
        ↓
    Review Information
        ↓
    Close

### Edit

    Select Edit
        ↓
    EditPlantModal
        ↓
    Modify Information
        ↓
    Update
        ↓
    PlantDirectory Updated

### Delete

    Select Delete
        ↓
    DeletePlantModal
        ↓
    Confirm
        ↓
    Plant Deleted
        ↓
    PlantDirectory Updated

---

## 24. Component Lifecycle

The typical lifecycle is:

    Plants Page Opens
          ↓
    Plant Data Available
          ↓
    PlantDirectory Renders
          ↓
    Plant Records Displayed
          ↓
    User Selects Action
          ↓
    Action Performed
          ↓
    Backend Data Changes
          ↓
    Parent Refreshes / Updates Data
          ↓
    PlantDirectory Displays Latest Data

---

## 25. Important Implementation Notes

- PlantDirectory is the main plant listing component.
- It displays plant records provided by the Plants module.
- It acts as the central interface for existing plant records.
- It can display important plant information.
- It can display plant status.
- It can provide actions for individual plant records.
- The Edit action works with EditPlantModal.
- The Delete action works with DeletePlantModal.
- Plant creation is handled by CreatePlantModal.
- Plant KPI information is handled by PlantKPICards.
- Plant location information is handled by PlantLocations.
- The component can support search or filtering depending on its implementation.
- The component can display loading and empty states depending on the supplied state.
- The parent component remains responsible for overall plant data management.
- The directory should display the latest plant information after successful operations.
- The component separates plant listing from plant creation, editing, and deletion.
- The selected plant is passed to the appropriate action or modal.
- The component forms a central part of the Plants module.

---

## 26. Summary

PlantDirectory is the main plant listing and management interface of the SEWAC Plants module.

Its primary purpose is to display existing plant records and provide users with actions for interacting with those records.

The component works together with the other Plants components to provide a complete plant management experience.

The overall structure is:

    Plants Module
          ↓
    PlantDirectory
          ↓
    Plant Records
          ↓
    ┌───────────────┬────────────────┬────────────────┐
    ↓               ↓                ↓
   View            Edit            Delete
    ↓               ↓                ↓
Details         EditPlantModal  DeletePlantModal
                    ↓                ↓
                 Backend           Backend
                    ↓                ↓
              Updated Data      Deleted Data
                    └────────┬───────┘
                             ↓
                     PlantDirectory
                             ↓
                     Updated List

PlantDirectory therefore acts as the central interface for viewing and managing the existing plant records within the SEWAC Plants module.