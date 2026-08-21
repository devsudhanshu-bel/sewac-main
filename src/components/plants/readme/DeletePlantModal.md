# DeletePlantModal Component Documentation

## 1. Component Overview

### Component Name

DeletePlantModal

### File Location

src/components/plants/DeletePlantModal.jsx

### Purpose

The DeletePlantModal component is responsible for displaying a confirmation dialog before deleting an existing plant from the SEWAC Plants module.

Instead of deleting a plant immediately when the user selects the delete action, this component asks the user to confirm the deletion. This helps prevent accidental deletion of plant records.

The component provides:

- Delete confirmation
- Selected plant information
- Delete functionality
- Cancel functionality
- Close functionality
- API request handling
- Success handling
- Error handling

---

## 2. Responsibilities

The DeletePlantModal component is responsible for:

- Displaying the delete confirmation modal.
- Displaying information about the selected plant.
- Asking the user to confirm the deletion.
- Sending the delete request to the backend.
- Handling the API response.
- Calling the success callback after successful deletion.
- Closing the modal after successful deletion.
- Allowing the user to cancel the deletion.
- Handling errors that occur during the deletion request.

The component does not directly manage the complete Plant Directory.

The parent component is responsible for updating or refreshing the plant list after a successful deletion.

---

## 3. Component Interface

The component receives the selected plant and callback functions from the parent component.

Example usage:

    <DeletePlantModal
      plant={plant}
      onClose={onClose}
      onSuccess={onSuccess}
    />

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| plant | Object | Yes | Contains information about the plant selected for deletion |
| onClose | Function | Yes | Closes the delete confirmation modal |
| onSuccess | Function | Yes | Called after the plant is successfully deleted |

---

## 4. Selected Plant

The plant prop represents the plant selected by the user for deletion.

The component uses the selected plant information to identify which plant needs to be deleted.

The plant identifier is used to construct the DELETE API request.

The basic flow is:

    Selected Plant
          ↓
       Plant ID
          ↓
     DELETE Request
          ↓
       Backend

The selected plant is passed from the parent component when the user selects the delete action.

---

## 5. Delete Confirmation

The main purpose of DeletePlantModal is to provide a confirmation step before deleting a plant.

When the modal opens, the user is informed that the selected plant is going to be deleted.

The user can choose between:

    Cancel
    Delete

### Cancel

The Cancel action closes the modal without deleting the plant.

### Delete

The Delete action confirms the operation and sends the DELETE request to the backend.

This confirmation step helps prevent accidental deletion of plant records.

---

## 6. Modal Structure

The delete modal contains the following logical sections:

    Delete Modal
         ↓
    Modal Header
         ↓
    Confirmation Message
         ↓
    Selected Plant Information
         ↓
    Cancel / Delete Actions

The modal is displayed above the Plants page using an overlay.

The overlay focuses the user's attention on the deletion confirmation.

---

## 7. Delete API Request

When the user confirms the deletion, the component sends a DELETE request to the backend.

The selected plant ID is used to identify the plant that should be removed.

The API endpoint follows the plant-specific route:

    DELETE /api/plants/:id

Here, :id represents the ID of the selected plant.

Conceptually, the request is:

    await api.delete(`/api/plants/${plant.id}`);

The selected plant ID is dynamically inserted into the API endpoint.

---

## 8. HTTP Method

The component uses the HTTP DELETE method.

The DELETE method is used to remove the selected plant record from the backend.

The request flow is:

    User Confirms Deletion
            ↓
       DELETE Request
            ↓
      /api/plants/:id
            ↓
         Backend
            ↓
       Plant Deleted

---

## 9. Delete Flow

The complete deletion flow is:

    User Opens Plants Page
            ↓
    User Selects Plant
            ↓
    User Selects Delete
            ↓
    DeletePlantModal Opens
            ↓
    Selected Plant Information Displayed
            ↓
    User Confirms Deletion
            ↓
    DELETE /api/plants/:id
            ↓
    Backend Processes Request
            ↓
        Success / Error

### Successful Flow

    Delete Request Successful
            ↓
        onSuccess()
            ↓
    Parent Updates Plant Data
            ↓
         onClose()
            ↓
       Modal Closes

### Failed Flow

    Delete Request Fails
            ↓
       Error Is Caught
            ↓
       Error Is Logged
            ↓
      User Is Informed

---

## 10. Success Handling

After the backend successfully deletes the plant, the component calls:

    onSuccess();

The onSuccess callback informs the parent component that the deletion was successful.

The parent component can then:

- Refresh the plant list.
- Remove the deleted plant from the displayed data.
- Update the Plant Directory.
- Retrieve the latest plant information.

After successful deletion, the modal is closed using:

    onClose();

The flow is:

    Plant Successfully Deleted
              ↓
          onSuccess()
              ↓
    Parent Updates Plant Data
              ↓
           onClose()
              ↓
         Modal Closes

---

## 11. Cancel Action

The Cancel action allows the user to exit the delete confirmation without deleting the plant.

When Cancel is selected:

    onClose();

is called.

No API request is sent.

The flow is:

    User Clicks Cancel
            ↓
         onClose()
            ↓
       Modal Closes
            ↓
    Plant Remains Unchanged

---

## 12. Close Button

The modal contains a close button that allows the user to dismiss the confirmation dialog.

The close button uses the X icon from lucide-react.

Clicking the close button calls:

    onClose();

No delete request is made when the close button is selected.

---

## 13. Confirmation Message

The modal displays a confirmation message informing the user that the selected plant is going to be deleted.

The confirmation message makes the destructive action clear before the API request is sent.

The user must explicitly select the Delete action to proceed.

This additional confirmation step helps prevent accidental deletion.

---

## 14. Plant Information Display

The selected plant information is obtained from the plant prop.

The component can use identifying information from the selected plant so that the user can verify which plant is being deleted.

The data flow is:

    Parent Component
           ↓
      Selected Plant
           ↓
        plant Prop
           ↓
    DeletePlantModal
           ↓
     Plant Information

Displaying the selected plant information helps the user verify the deletion before confirming it.

---

## 15. Error Handling

The DELETE request is handled using error handling logic.

Conceptually:

    try {
      await api.delete(`/api/plants/${plant.id}`);

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to delete plant.");
    }

If the API request fails:

1. The error is caught.
2. The error is logged in the browser console.
3. The user is informed that the deletion failed.
4. The success callback is not executed.
5. The plant is not treated as successfully deleted.

This prevents the application from incorrectly assuming that the plant was deleted when the backend request failed.

---

## 16. API Instance

The component uses the application's shared Axios API instance to communicate with the backend.

The component does not create a separate Axios instance.

The communication flow is:

    DeletePlantModal
           ↓
    Shared API Instance
           ↓
       Backend API
           ↓
     Plants Endpoint

Using the shared API instance keeps API communication consistent throughout the application.

---

## 17. Dependencies

The component uses the following dependencies.

### React

React is used to build and render the component.

### Axios API Instance

The shared API instance is used to send the DELETE request to the backend.

### Lucide React

The X icon from lucide-react is used for the modal close button.

---

## 18. Parent-Child Communication

The component communicates with the parent component using callback props.

The primary callbacks are:

    onClose()
    onSuccess()

### onClose()

The onClose callback is responsible for closing the modal.

It is used when:

- The user clicks Cancel.
- The user clicks the close button.
- The deletion is completed successfully.

### onSuccess()

The onSuccess callback is used after the backend confirms that the plant was successfully deleted.

It allows the parent component to refresh or update the Plant Directory.

---

## 19. Data Flow

The component follows a one-way data flow:

    Plant Directory
           ↓
    User Selects Delete
           ↓
      Selected Plant
           ↓
    DeletePlantModal
           ↓
     User Confirms
           ↓
    DELETE API Request
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

If the user cancels:

    DeletePlantModal
           ↓
    User Clicks Cancel
           ↓
        onClose()
           ↓
      Modal Closes
           ↓
     No API Request

---

## 20. Component Lifecycle

The typical lifecycle of the component is:

    Delete Action Selected
            ↓
    DeletePlantModal Opens
            ↓
    Selected Plant Information Displayed
            ↓
    User Reviews Confirmation
            ↓
    User Chooses an Action
            ↓
       ┌───────────────┐
       │               │
     Cancel          Delete
       │               │
       ↓               ↓
    onClose()      DELETE API
                       ↓
                 Backend Response
                       ↓
                  ┌────┴────┐
                  │         │
               Success     Error
                  │         │
                  ↓         ↓
             onSuccess()  Error Handling
                  ↓
               onClose()
                  ↓
             Modal Closed

---

## 21. Relationship With Plant Directory

DeletePlantModal works together with the main Plants Directory component.

The Plant Directory is responsible for displaying plant records and providing the delete action.

When the user selects Delete:

    Plant Directory
           ↓
      Delete Action
           ↓
    DeletePlantModal

After successful deletion:

    DeletePlantModal
           ↓
        onSuccess()
           ↓
    Plant Directory
           ↓
    Plant Data Refreshed / Updated

This separates the deletion functionality from the main plant listing functionality.

---

## 22. User Interaction Flow

From the user's perspective, the process is:

    1. Open the Plants page
            ↓
    2. Find the required plant
            ↓
    3. Select Delete
            ↓
    4. Delete confirmation modal appears
            ↓
    5. Review the selected plant
            ↓
    6. Select Delete or Cancel

### If Delete Is Selected

    Delete
      ↓
    DELETE API Request
      ↓
    Backend
      ↓
    Plant Removed
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

## 23. Important Implementation Notes

- The component is specifically used for confirming plant deletion.
- The selected plant is received through the plant prop.
- The plant ID is used to identify the plant in the DELETE request.
- The DELETE HTTP method is used for removing the plant.
- The request is sent through the shared API instance.
- The user must confirm the deletion before the API request is sent.
- Canceling the modal does not make an API request.
- Clicking the close icon does not make an API request.
- The modal closes after successful deletion.
- onSuccess() informs the parent component about the successful deletion.
- The parent component is responsible for refreshing or updating the Plant Directory.
- API errors are handled using error handling logic.
- The confirmation step helps reduce accidental deletion.
- The component focuses on the deletion operation rather than directly managing the complete plant list.

---

## 24. Summary

DeletePlantModal is the confirmation and deletion component of the SEWAC Plants module.

Its primary purpose is to safely remove an existing plant after explicit user confirmation.

The component receives the selected plant from the parent component, displays a confirmation modal, and sends a DELETE request to the backend when the user confirms the operation.

The complete process is:

    Select Plant
         ↓
    Select Delete
         ↓
    Open DeletePlantModal
         ↓
    Confirm Deletion
         ↓
    DELETE /api/plants/:id
         ↓
    Backend
         ↓
    Successful Deletion
         ↓
    onSuccess()
         ↓
    Parent Updates Plant Data
         ↓
    onClose()
         ↓
    Modal Closed

The component provides a clear separation between the plant deletion operation and the Plant Directory while allowing the parent component to remain responsible for maintaining the displayed plant data.