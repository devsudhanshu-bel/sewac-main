# PlantKPICards Component Documentation

## 1. Component Overview

### Component Name

PlantKPICards

### File Location

src/components/plants/PlantKPICards.jsx

### Purpose

The PlantKPICards component is responsible for displaying key performance indicators related to the plants in the SEWAC Plants module.

It presents important plant statistics in a clear card-based layout so that users can quickly understand the overall status and operational information of the plants.

The component provides a visual summary of important plant-level metrics.

The KPI cards can be used to display information such as:

- Total number of plants
- Active plants
- Inactive plants
- Total processing capacity
- Other plant-related performance metrics available from the application data

---

## 2. Responsibilities

The PlantKPICards component is responsible for:

- Displaying important plant-related statistics.
- Presenting KPI values in individual cards.
- Providing a quick overview of the Plants module.
- Displaying labels for each KPI.
- Displaying appropriate icons for KPI categories.
- Presenting the information in a visually organized layout.
- Updating the displayed KPI information when the supplied data changes.

The component focuses on presenting summary information rather than managing detailed plant records.

---

## 3. Component Interface

The component receives the required plant information or calculated KPI values from its parent component.

The exact props depend on the implementation of the component.

Conceptually, the component can be used as:

    <PlantKPICards
      plants={plants}
    />

The component uses the provided plant information to calculate or display the required KPI values.

---

## 4. KPI Cards

Each KPI is presented as an individual card.

The general structure is:

    Plant KPI Section
          ↓
    ┌──────────────┐
    │ KPI Card     │
    │ Label        │
    │ Value        │
    │ Icon         │
    └──────────────┘

Multiple cards are displayed together to provide an overview of the Plants module.

The cards allow users to understand important plant statistics without opening individual plant records.

---

## 5. Total Plants

One of the main KPIs represents the total number of plants available in the system.

The total plant count provides an overview of the number of plant records currently available.

The calculation is based on the plant data supplied to the component.

The general flow is:

    Plant Data
        ↓
    Count Plant Records
        ↓
    Total Plants KPI
        ↓
    Displayed in KPI Card

---

## 6. Active Plants

The component can display the number of plants that are currently active.

Active plants represent plants whose status is marked as active in the plant data.

The calculation follows the general logic:

    Plant Data
        ↓
    Check Plant Status
        ↓
    Filter Active Plants
        ↓
    Count Active Plants
        ↓
    Active Plants KPI

The resulting value is displayed in the corresponding KPI card.

---

## 7. Inactive Plants

The component can also display the number of inactive plants.

Inactive plants represent plant records whose current status is marked as inactive.

The general flow is:

    Plant Data
        ↓
    Check Plant Status
        ↓
    Filter Inactive Plants
        ↓
    Count Inactive Plants
        ↓
    Inactive Plants KPI

This allows users to quickly compare the active and inactive plant counts.

---

## 8. Processing Capacity

The PlantKPICards component can display plant processing capacity when the corresponding plant data is available.

Processing capacity represents the amount of waste that the plant is capable of processing within the specified period.

The capacity information provides an overview of the operational capability of the plants.

The flow is:

    Plant Data
        ↓
    Processing Capacity Values
        ↓
    Calculate / Aggregate Capacity
        ↓
    Capacity KPI
        ↓
    Displayed in Card

---

## 9. KPI Values

The KPI cards display numerical values prominently.

The value displayed on each card depends on the corresponding plant metric.

The general structure is:

    KPI Category
         ↓
    Calculated Value
         ↓
    KPI Card
         ↓
    User

The component ensures that important plant statistics can be understood quickly.

---

## 10. KPI Labels

Each KPI card contains a label describing the metric being displayed.

The label helps users understand what the numerical value represents.

Examples of KPI labels include:

    Total Plants
    Active Plants
    Inactive Plants
    Processing Capacity

The exact labels depend on the implementation of PlantKPICards.jsx.

---

## 11. Icons

The KPI cards can use icons to visually represent the type of information being displayed.

Icons provide an additional visual indicator for each KPI category.

The general structure is:

    Icon
      +
    KPI Label
      +
    KPI Value

This improves the visual identification of different plant metrics.

---

## 12. Card Layout

The KPI cards are arranged together as a group.

The layout provides a dashboard-style summary of the plant information.

The general structure is:

    ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
    │ KPI Card   │  │ KPI Card   │  │ KPI Card   │  │ KPI Card   │
    │            │  │            │  │            │  │            │
    │ Label      │  │ Label      │  │ Label      │  │ Label      │
    │ Value      │  │ Value      │  │ Value      │  │ Value      │
    └────────────┘  └────────────┘  └────────────┘  └────────────┘

The cards are designed to provide a quick visual overview.

---

## 13. Data Processing

When plant information is supplied to the component, the component can process the data to obtain the required KPI values.

For example:

    Plant Data
        ↓
    Total Count
        ↓
    Active Count
        ↓
    Inactive Count
        ↓
    Capacity Information
        ↓
    KPI Cards

The calculations depend on the fields and data structure provided by the Plants module.

---

## 14. Dynamic Updates

The KPI values are based on the current plant data.

If the plant data changes, the KPI information can be recalculated and displayed accordingly.

For example:

    Plant Added
        ↓
    Plant Data Changes
        ↓
    KPI Calculation Updates
        ↓
    Total Plant Count Updates

Similarly, if a plant's status changes, the active and inactive KPI values can change accordingly.

---

## 15. Relationship With Plant Directory

PlantKPICards works together with the PlantDirectory component.

The PlantDirectory is responsible for displaying detailed plant records, while PlantKPICards provides a high-level summary.

The relationship is:

    Plants Module
          ↓
    ┌─────────────────────┐
    │                     │
    ↓                     ↓
PlantKPICards       PlantDirectory
    ↓                     ↓
Summary Data        Detailed Plant Data

This allows users to see both overall plant statistics and individual plant records.

---

## 16. Relationship With Plants Component

PlantKPICards is part of the overall Plants page.

The parent Plants component can provide the plant data required by the KPI cards.

The general structure is:

    Plants.jsx
        ↓
    Plant Data
        ↓
    PlantKPICards
        ↓
    KPI Summary

The Plants component can combine the KPI section with other plant-related components.

---

## 17. Component Data Flow

The data flow can be represented as:

    Backend / Plant Data
            ↓
       Plants Component
            ↓
      PlantKPICards
            ↓
      KPI Calculations
            ↓
       KPI Values
            ↓
       KPI Cards
            ↓
          User

The component primarily focuses on presenting summarized information.

---

## 18. Display Purpose

The main purpose of the KPI cards is to provide users with important plant information at a glance.

Instead of requiring the user to inspect every plant record, the KPI section provides summary statistics immediately.

This improves the usability of the Plants dashboard.

The user can quickly understand:

- How many plants exist.
- How many plants are active.
- How many plants are inactive.
- Important operational metrics.
- Other summary values provided by the component.

---

## 19. Read-Only Information

The KPI cards are primarily used for displaying information.

The user does not directly edit plant records through the KPI cards.

Plant editing is handled separately through:

    EditPlantModal

Plant deletion is handled separately through:

    DeletePlantModal

Plant creation is handled separately through:

    CreatePlantModal

The KPI cards therefore act as a summary and monitoring component.

---

## 20. Dependencies

The component uses the dependencies required by the Plants module implementation.

These can include:

### React

React is used to create and render the KPI card component.

### Icons

Icons can be used to visually represent the different KPI categories.

### Styling

The component uses the project's existing styling approach to maintain consistency with the Plants module.

The exact dependencies should match the imports present in PlantKPICards.jsx.

---

## 21. Parent-Child Communication

The component receives plant-related data from the parent component.

The parent is responsible for providing the required information.

The relationship is:

    Parent Component
          ↓
      Plant Data
          ↓
    PlantKPICards
          ↓
      KPI Display

The KPI component does not need to directly manage the entire Plants module.

---

## 22. User Interaction

The KPI cards are primarily informational.

The typical user interaction is:

    Open Plants Page
          ↓
    View KPI Section
          ↓
    Read Plant Statistics
          ↓
    Continue to Plant Directory
          ↓
    Perform Required Plant Action

The cards allow users to understand the plant overview before working with individual plant records.

---

## 23. Important Implementation Notes

- PlantKPICards is a summary component of the Plants module.
- It displays important plant-related statistics.
- KPI values are based on plant data.
- The component can display total plant count.
- The component can display active plant count.
- The component can display inactive plant count.
- The component can display operational metrics such as processing capacity.
- KPI information is presented using individual cards.
- Icons can be used to represent KPI categories.
- The component is primarily read-only.
- The component does not create plants.
- The component does not edit plants.
- The component does not delete plants.
- Plant creation is handled by CreatePlantModal.
- Plant editing is handled by EditPlantModal.
- Plant deletion is handled by DeletePlantModal.
- Detailed plant records are handled by PlantDirectory.
- PlantKPICards provides a high-level overview of the Plants module.
- The parent component supplies the required plant data.
- KPI values can update when the underlying plant data changes.

---

## 24. Summary

PlantKPICards is the KPI summary component of the SEWAC Plants module.

Its main purpose is to provide users with a quick overview of important plant statistics through visually organized KPI cards.

The component summarizes plant information and displays it in a dashboard-style format.

The overall flow is:

    Plant Data
         ↓
    Plants Component
         ↓
    PlantKPICards
         ↓
    KPI Calculations
         ↓
    KPI Values
         ↓
    KPI Cards
         ↓
    User

By providing important plant statistics at the top level, PlantKPICards allows users to understand the overall state of the Plants module quickly before working with individual plant records.