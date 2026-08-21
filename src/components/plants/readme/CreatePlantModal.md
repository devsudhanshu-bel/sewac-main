# CreatePlantModal Component Documentation

## 1. Component Overview

### Component Name

`CreatePlantModal`

### File Location

```text
src/components/plants/CreatePlantModal.jsx
```

### Purpose

The `CreatePlantModal` component provides a modal form for creating a new plant in the SEWAC dashboard.

It allows the user to enter the plant's basic information, location details, operational information, and current status.

The component collects the following information:

1. **Plant Name**
2. **Plant Type**
3. **City**
4. **Zone**
5. **Division**
6. **Ward**
7. **Plant Manager**
8. **Capacity**
9. **Vehicles Enrolled**
10. **Total Waste Collected**
11. **Latitude**
12. **Longitude**
13. **Plant Status**

The modal provides:

* Form input fields
* Plant status selection
* Create functionality
* Cancel functionality
* Close button
* API submission
* Error handling
* Success callback handling

---

# 2. Responsibilities

The component is responsible for:

* Displaying the Create Plant modal.
* Maintaining the plant form state.
* Handling user input.
* Updating individual form fields.
* Collecting plant information.
* Collecting geographical coordinates.
* Allowing the user to select the plant status.
* Converting numerical fields into numbers before sending them to the backend.
* Sending the plant information to the backend API.
* Calling the parent success callback after successful creation.
* Closing the modal after successful creation.
* Handling API errors.
* Displaying an error message when plant creation fails.

The component does **not** directly manage the Plant Directory.

Instead, the parent component is responsible for refreshing or updating the plant data after successful creation.

---

# 3. Component Interface

The component receives two props:

```jsx
<CreatePlantModal
  onClose={onClose}
  onSuccess={onSuccess}
/>
```

### Props

| Prop        | Type     | Required | Description                                    |
| ----------- | -------- | -------- | ---------------------------------------------- |
| `onClose`   | Function | Yes      | Closes the Create Plant modal                  |
| `onSuccess` | Function | Yes      | Called after the plant is successfully created |

---

# 4. Form State

The component maintains the form using React's `useState()` hook.

The form contains:

```js
{
  plant_name: "",
  plant_type: "",
  city: "",
  zone: "",
  division: "",
  ward: "",
  plant_manager: "",
  capacity_ton_per_day: "",
  vehicles_enrolled: "",
  total_waste_collected: "",
  latitude: "",
  longitude: "",
  status: "ACTIVE",
}
```

The initial value of:

```text
status
```

is:

```text
ACTIVE
```

All other fields initially contain empty strings.

---

# 5. Form Fields

The component contains the following fields:

| Field                   | Description                     |
| ----------------------- | ------------------------------- |
| `plant_name`            | Name of the plant               |
| `plant_type`            | Type of plant                   |
| `city`                  | City where the plant is located |
| `zone`                  | Administrative zone             |
| `division`              | Administrative division         |
| `ward`                  | Ward associated with the plant  |
| `plant_manager`         | Person managing the plant       |
| `capacity_ton_per_day`  | Daily processing capacity       |
| `vehicles_enrolled`     | Number of vehicles enrolled     |
| `total_waste_collected` | Total waste collected           |
| `latitude`              | Geographic latitude             |
| `longitude`             | Geographic longitude            |
| `status`                | Current plant status            |

---

# 6. Form State Updates

The component uses a common change handler to update the form.

```js
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};
```

The handler uses the input's `name` attribute to determine which property should be updated.

For example:

```jsx
<input
  name="plant_name"
  value={form.plant_name}
  onChange={handleChange}
/>
```

When the user changes the Plant Name field, the value of:

```text
form.plant_name
```

is updated.

The remaining form values are preserved using the spread operator.

---

# 7. Create Plant API

When the user clicks the Create button, the component executes the submit handler.

The component sends a POST request to:

```text
/api/plants
```

The request contains the form information.

The numerical fields are converted using JavaScript's `Number()` function before being sent.

The request structure is conceptually:

```js
await api.post("/api/plants", {
  ...form,
  capacity_ton_per_day: Number(form.capacity_ton_per_day),
  vehicles_enrolled: Number(form.vehicles_enrolled),
  total_waste_collected: Number(form.total_waste_collected),
  latitude: Number(form.latitude),
  longitude: Number(form.longitude),
});
```

### HTTP Method

```text
POST
```

### Endpoint

```text
/api/plants
```

The shared Axios API instance is responsible for the configured backend base URL.

---

# 8. Numeric Field Conversion

HTML form inputs normally provide their values as strings.

Therefore, numerical fields are explicitly converted into numbers before the API request.

The following fields are converted:

```text
capacity_ton_per_day
vehicles_enrolled
total_waste_collected
latitude
longitude
```

For example:

```js
Number(form.capacity_ton_per_day)
```

converts the capacity value into a JavaScript number.

This ensures that the backend receives numerical values rather than text values.

---

# 9. API Request Payload

The plant creation request contains the following information:

```text
plant_name
plant_type
city
zone
division
ward
plant_manager
capacity_ton_per_day
vehicles_enrolled
total_waste_collected
latitude
longitude
status
```

Conceptually, the payload is:

```js
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
```

---

# 10. Success Handling

When the API request is successful, the component executes:

```js
onSuccess();
onClose();
```

The first function:

```text
onSuccess()
```

notifies the parent component that the plant has been successfully created.

The parent can then refresh or update the plant information.

The second function:

```text
onClose()
```

closes the modal.

Therefore, after successful creation:

```text
Plant Created
      ↓
onSuccess()
      ↓
Parent Updates Data
      ↓
onClose()
      ↓
Modal Closes
```

---

# 11. Error Handling

The API request is handled using a `try...catch` block.

Conceptually:

```js
try {
  // API request
} catch (err) {
  console.error(err);
  alert("Failed to create plant.");
}
```

If the request fails:

1. The error is printed to the browser console.
2. An alert is displayed to the user.
3. The success callback is not executed.
4. The modal is not automatically closed.

The error message displayed is:

```text
Failed to create plant.
```

---

# 12. Modal Layout

The component displays the form inside a modal overlay.

The outer overlay covers the viewport and provides a semi-transparent dark background behind the modal.

The modal itself uses a white background with rounded corners.

The modal has:

```text
White background
Rounded corners
Padding
Fixed width
Maximum height
Vertical scrolling
```

The maximum height and scrolling allow the complete form to remain usable when the viewport is smaller.

---

# 13. Form Layout

The form uses a two-column layout.

Conceptually:

```text
┌─────────────────────┬─────────────────────┐
│ Plant Name          │ Plant Type          │
├─────────────────────┼─────────────────────┤
│ City                │ Zone                │
├─────────────────────┼─────────────────────┤
│ Division            │ Ward                │
├─────────────────────┼─────────────────────┤
│ Plant Manager       │ Capacity            │
├─────────────────────┼─────────────────────┤
│ Vehicles Enrolled   │ Waste Collected     │
├─────────────────────┼─────────────────────┤
│ Latitude            │ Longitude           │
├─────────────────────┼─────────────────────┤
│ Status              │                     │
└─────────────────────┴─────────────────────┘
```

This keeps the form compact and organized.

---

# 14. Status Selection

The plant status is selected using a dropdown.

The available status values are:

```text
ACTIVE
INACTIVE
```

The default value is:

```text
ACTIVE
```

The selected status is stored in:

```text
form.status
```

---

# 15. Modal Actions

The modal provides two main actions.

## Cancel

The Cancel button closes the modal.

```js
onClose()
```

No API request is made when Cancel is selected.

## Create

The Create button submits the form.

The action executes the submit handler, which:

```text
Collects Form Data
        ↓
Converts Numeric Fields
        ↓
Sends POST Request
        ↓
Handles Response
```

---

# 16. Close Button

The modal contains a close button in the top-right corner.

The close button uses the `X` icon from:

```text
lucide-react
```

Clicking the close button executes:

```js
onClose()
```

and closes the modal without creating a plant.

---

# 17. Dependencies

The component uses the following dependencies.

### React

React's:

```text
useState
```

is used for maintaining the form state.

### Lucide React

The `X` icon is used for the modal close button.

### Axios API Instance

The shared:

```text
api
```

instance is used to communicate with the backend.

It is imported from the application's Axios configuration.

---

# 18. Data Flow

The component follows a one-way data flow:

```text
User Opens Create Plant Modal
            ↓
CreatePlantModal
            ↓
User Enters Plant Information
            ↓
Form State Updated
            ↓
User Clicks Create
            ↓
Numeric Fields Converted
            ↓
POST /api/plants
            ↓
Backend
            ↓
Success / Error
            ↓
Success
   ↓              ↓
onSuccess()     onClose()
   ↓
Parent Updates Plant Data
```

The component focuses on collecting and submitting plant information.

---

# 19. Component Lifecycle

The basic lifecycle is:

```text
Modal Opens
     ↓
Initial Form State Created
     ↓
User Enters Data
     ↓
handleChange()
     ↓
Form State Updated
     ↓
User Clicks Create
     ↓
handleSubmit()
     ↓
POST Request
     ↓
Backend Response
     ↓
Success / Error
```

If the request succeeds:

```text
Success
   ↓
onSuccess()
   ↓
onClose()
```

If the request fails:

```text
Error
   ↓
Console Error
   ↓
Alert
```

---

# 20. Important Implementation Notes

* The component uses controlled form inputs.
* All form values are maintained inside a single state object.
* The default plant status is `ACTIVE`.
* Numerical fields are converted using `Number()`.
* The component uses the shared Axios API instance.
* The API endpoint used for creation is `/api/plants`.
* The component does not directly refresh the Plant Directory.
* The parent component controls the refresh through `onSuccess`.
* The modal closes after successful creation.
* Canceling the modal does not send an API request.
* API failures are displayed using an alert.
* The form is displayed using a two-column layout.
* The modal supports vertical scrolling.

---

# 21. Summary

`CreatePlantModal` is the plant creation interface of the SEWAC Plants module.

It provides a structured form for entering plant details and sends the information to:

```text
POST /api/plants
```

The component combines:

```text
Form Management
      +
Input Collection
      +
Numeric Conversion
      +
API Submission
      +
Success Handling
      +
Error Handling
```

This keeps plant creation separate from the main Plant Directory while allowing the parent component to update the displayed plant data after a successful creation.
