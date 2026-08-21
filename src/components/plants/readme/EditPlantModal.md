# EditPlantModal Component Documentation

## 1. Component Overview

### Component Name

EditPlantModal

### File Location

src/components/plants/EditPlantModal.jsx

### Purpose

The EditPlantModal component provides a modal form for editing the details of an existing plant in the SEWAC Plants module.

It allows the user to select an existing plant, view its current information, modify the required details, and submit the updated information to the backend.

The component provides:

- Existing plant information
- Editable plant fields
- Form state management
- Plant status selection
- Update functionality
- Cancel functionality
- Close functionality
- API submission
- Success handling
- Error handling

---

## 2. Responsibilities

The EditPlantModal component is responsible for:

- Displaying the Edit Plant modal.
- Loading the selected plant's existing information into the form.
- Allowing the user to modify plant information.
- Maintaining the edited values in component state.
- Handling changes to individual form fields.
- Allowing the plant status to be updated.
- Sending the updated plant information to the backend.
- Calling the parent success callback after a successful update.
- Closing the modal after a successful update.
- Allowing the user to cancel the editing operation.
- Handling API errors.

The component does not directly manage the complete Plant Directory.

The parent component is responsible for updating or refreshing the plant list after a successful update.

---

## 3. Component Interface

The component receives the selected plant and callback functions from the parent component.

Conceptually:

    <EditPlantModal
      plant={plant}
      onClose={onClose}
      onSuccess={onSuccess}
    />

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| plant | Object | Yes | Contains the existing information of the plant being edited |
| onClose | Function | Yes | Closes the Edit Plant modal |
| onSuccess | Function | Yes | Called after the plant is successfully updated |

---

## 4. Selected Plant

The plant prop represents the plant selected by the user for editing.

The existing values of the selected plant are used to populate the edit form.

This allows the user to see the current plant information before making any changes.

The basic flow is:

    Selected Plant
          ↓
    Existing Plant Information
          ↓
    Edit Plant Form
          ↓
    User Modifies Information

The selected plant ID is also used when sending the update request to the backend.

---

## 5. Form State

The component maintains the editable plant information using React state.

The form contains the plant information required by the Plants module.

The editable information can include:

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

The form is initially populated using the selected plant's existing values.

This allows the user to modify only the required information instead of entering all plant information again.

---

## 6. Form Fields

The component provides editable fields for plant information.

| Field | Description |
|------|-------------|
| plant_name | Name of the plant |
| plant_type | Type of plant |
| city | City where the plant is located |
| zone | Administrative zone |
| division | Administrative division |
| ward | Ward associated with the plant |
| plant_manager | Person managing the plant |
| capacity_ton_per_day | Daily processing capacity |
| vehicles_enrolled | Number of vehicles enrolled |
| total_waste_collected | Total waste collected |
| latitude | Geographic latitude |
| longitude | Geographic longitude |
| status | Current plant status |

The exact fields displayed depend on the implementation of EditPlantModal.jsx.

---

## 7. Existing Data Population

When the Edit Plant modal is opened, the selected plant's existing information is loaded into the form.

This allows the user to see the current values before editing them.

The data flow is:

    Existing Plant
          ↓
    Plant Object
          ↓
    Form State
          ↓
    Input Fields
          ↓
    User Edits Values

The existing information provides the starting point for the editing process.

---

## 8. Handling Form Changes

The component updates the form state whenever the user changes an input.

The input field name is used to identify which value should be updated.

Conceptually:

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };

This allows multiple fields to be handled using a common change handler.

For example:

    <input
      name="plant_name"
      value={form.plant_name}
      onChange={handleChange}
    />

When the user changes the plant name, the plant_name value is updated while the remaining form values remain unchanged.

---

## 9. Form Submission

When the user clicks the Update button, the component collects the latest values from the form.

The updated information is then prepared for the API request.

The flow is:

    User Changes Information
            ↓
       Form State
            ↓
      Submit Update
            ↓
      Prepare Payload
            ↓
       API Request
            ↓
         Backend

---

## 10. Update API Request

When the user submits the edited information, the component sends an update request to the backend.

The selected plant ID is used to identify which plant should be updated.

The endpoint follows the plant-specific API route:

    PUT /api/plants/:id

Conceptually:

    await api.put(`/api/plants/${plant.id}`, payload);

The selected plant ID is dynamically inserted into the API endpoint.

---

## 11. HTTP Method

The component uses the HTTP PUT method for updating the selected plant.

The purpose of the request is to send the modified plant information to the backend.

The basic request flow is:

    Edited Plant Information
            ↓
        PUT Request
            ↓
       /api/plants/:id
            ↓
          Backend
            ↓
       Updated Plant

---

## 12. Update Payload

The update request contains the modified plant information.

The payload can contain:

- plant_name
- plant_type
- city
- zone
- division
- ward
- plant_manager
- capacity_ton_per_day
- vehicles_enrolled
- total_waste_collected
- latitude
- longitude
- status

Conceptually:

    {
      plant_name,
      plant_type,
      city,
      zone,
      division,
      ward,
      plant_manager,
      capacity_ton_per_day,
      vehicles_enrolled,
      total_waste_collected,
      latitude,
      longitude,
      status
    }

The exact payload depends on the fields implemented in EditPlantModal.jsx.

---

## 13. Numeric Fields

HTML form inputs generally provide values as strings.

Numerical plant fields may therefore need to be converted into numbers before being sent to the backend.

Numerical fields can include:

- capacity_ton_per_day
- vehicles_enrolled
- total_waste_collected
- latitude
- longitude

Conceptually:

    Number(form.capacity_ton_per_day)
    Number(form.vehicles_enrolled)
    Number(form.total_waste_collected)
    Number(form.latitude)
    Number(form.longitude)

This ensures that numerical information is sent in the expected format.

---

## 14. Status Selection

The plant status can be modified through the status field.

The status represents the current operational state of the plant.

Typical values include:

    ACTIVE
    INACTIVE

The selected status is maintained as part of the form state.

The flow is:

    Status Selection
          ↓
       Form State
          ↓
      Update API
          ↓
        Backend

---

## 15. Success Handling

After the backend successfully updates the plant, the component calls:

    onSuccess();

The onSuccess callback informs the parent component that the update was completed successfully.

The parent component can then:

- Refresh the plant list.
- Update the displayed plant information.
- Refresh the Plant Directory.
- Retrieve the latest plant information.

After the successful update, the modal is closed using:

    onClose();

The flow is:

    Plant Updated
         ↓
      onSuccess()
         ↓
    Parent Updates Data
         ↓
       onClose()
         ↓
    Modal Closes

---

## 16. Cancel Action

The Cancel button allows the user to exit the editing operation without saving changes.

When Cancel is selected:

    onClose();

is called.

No update API request is sent.

The flow is:

    User Clicks Cancel
          ↓
       onClose()
          ↓
      Modal Closes
          ↓
    Changes Not Submitted

---

## 17. Close Button

The modal contains a close button in the header.

The close button uses the X icon from lucide-react.

Clicking the close button calls:

    onClose();

The modal closes without submitting the edited information.

---

## 18. Modal Layout

The component displays the edit form inside a modal overlay.

The general structure is:

    Edit Plant Modal
          ↓
      Modal Header
          ↓
    Plant Information Form
          ↓
       Editable Fields
          ↓
      Status Selection
          ↓
     Cancel / Update
          ↓
         Actions

The modal provides a focused interface for modifying the selected plant.

---

## 19. Error Handling

The update API request is handled using error handling logic.

Conceptually:

    try {
      await api.put(`/api/plants/${plant.id}`, payload);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update plant.");
    }

If the update request fails:

1. The error is caught.
2. The error is logged in the browser console.
3. The user is informed that the update failed.
4. The success callback is not executed.
5. The plant is not treated as successfully updated.

This prevents the interface from incorrectly showing the update as successful.

---

## 20. API Instance

The component uses the application's shared API instance to communicate with the backend.

The component does not create a separate API configuration.

The communication flow is:

    EditPlantModal
          ↓
    Shared API Instance
          ↓
      Backend API
          ↓
     Plants Endpoint

Using the shared API instance keeps API communication consistent throughout the application.

---

## 21. Dependencies

The component uses the dependencies required by the Plants module.

### React

React is used to:

- Render the component.
- Maintain form state.
- Handle user input.

### API Instance

The shared API instance is used to send the update request to the backend.

### Lucide React

Lucide React icons can be used for interface elements such as the close button.

The exact dependencies should match the imports present in EditPlantModal.jsx.

---

## 22. Parent-Child Communication

The component communicates with the parent component through callback props.

The important callbacks are:

    onClose()
    onSuccess()

### onClose()

The onClose callback is used to close the modal.

It is used when:

- The user clicks Cancel.
- The user clicks the close button.
- The update is completed successfully.

### onSuccess()

The onSuccess callback is used when the plant is successfully updated.

It allows the parent component to refresh or update the Plant Directory.

---

## 23. Data Flow

The component follows a one-way data flow:

    Plant Directory
          ↓
    User Selects Edit
          ↓
    Selected Plant
          ↓
    EditPlantModal
          ↓
    Existing Data Loaded
          ↓
    User Modifies Information
          ↓
    Form State Updated
          ↓
    User Clicks Update
          ↓
    PUT API Request
          ↓
        Backend
          ↓
    Successful Response
          ↓
      onSuccess()
          ↓
    Parent Updates Plant Data
          ↓
       onClose()
          ↓
      Modal Closes

---

## 24. Component Lifecycle

The typical lifecycle is:

    Edit Action Selected
            ↓
    EditPlantModal Opens
            ↓
    Existing Plant Data Loaded
            ↓
    Form Displayed
            ↓
    User Edits Information
            ↓
    Form State Updated
            ↓
    User Clicks Update
            ↓
       PUT API Request
            ↓
      Backend Response
            ↓
       Success / Error
            ↓
    ┌───────────────┐
    │               │
 Success           Error
    │               │
    ↓               ↓
onSuccess()    Error Handling
    ↓
onClose()
    ↓
Modal Closed

---

## 25. Relationship With Plant Directory

EditPlantModal works together with the PlantDirectory component.

The PlantDirectory is responsible for displaying plant records and providing the edit action.

When the user selects Edit:

    Plant Directory
          ↓
      Edit Action
          ↓
    EditPlantModal
          ↓
    Existing Plant Data
          ↓
       Edit Form

After successful editing:

    EditPlantModal
          ↓
       onSuccess()
          ↓
    Plant Directory
          ↓
    Plant Data Refreshed / Updated

This separates plant editing from the main plant listing functionality.

---

## 26. User Interaction Flow

From the user's perspective, the process is:

    1. Open the Plants page.
            ↓
    2. Find the required plant.
            ↓
    3. Select Edit.
            ↓
    4. Edit Plant modal appears.
            ↓
    5. Existing plant information is displayed.
            ↓
    6. Modify the required fields.
            ↓
    7. Select Update or Cancel.

### If Update Is Selected

    Update
       ↓
    Form Data Prepared
       ↓
    PUT API Request
       ↓
    Backend
       ↓
    Plant Updated
       ↓
    Plant List Updated
       ↓
    Modal Closed

### If Cancel Is Selected

    Cancel
       ↓
    Modal Closed
       ↓
    Plant Remains Unchanged

---

## 27. Important Implementation Notes

- The component is used to edit an existing plant.
- The selected plant is received through the plant prop.
- Existing plant information is loaded into the form.
- The form uses controlled inputs.
- The user can modify the plant information.
- The selected plant ID is used in the update request.
- The PUT HTTP method is used for updating the plant.
- The request is sent through the shared API instance.
- Numerical fields can be converted to numbers before submission.
- The plant status can be updated.
- Canceling the modal does not send an API request.
- Closing the modal does not send an API request.
- The modal closes after a successful update.
- onSuccess() informs the parent component about the successful update.
- The parent component is responsible for updating or refreshing the Plant Directory.
- API errors are handled using error handling logic.
- The component focuses on editing plant information rather than managing the entire plant list.

---

## 28. Summary

EditPlantModal is the plant editing component of the SEWAC Plants module.

Its primary purpose is to allow users to modify the information of an existing plant and save those changes to the backend.

The component receives the selected plant from the parent component, loads its existing information into a form, allows the user to modify the values, and sends the updated information through a PUT request.

The complete process is:

    Select Plant
         ↓
    Select Edit
         ↓
    Open EditPlantModal
         ↓
    Load Existing Plant Information
         ↓
    Modify Plant Details
         ↓
    Submit Update
         ↓
    PUT /api/plants/:id
         ↓
       Backend
         ↓
    Successful Update
         ↓
      onSuccess()
         ↓
    Parent Updates Plant Data
         ↓
       onClose()
         ↓
      Modal Closed

The component keeps the editing functionality separate from the Plant Directory while allowing the parent component to remain responsible for maintaining the displayed plant data.