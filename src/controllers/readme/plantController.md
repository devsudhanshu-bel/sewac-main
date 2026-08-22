# plantController.js Documentation

## File Name

`plantController.js`

## File Location

`src/controllers/plantController.js`

---

## 1. Overview

`plantController.js` is the controller-layer file for the Plants module of the SEWAC Admin Backend.

The controller is responsible for receiving HTTP requests from the Plant routes, extracting the required request data, calling the corresponding functions from `plantService.js`, and returning structured JSON responses to the frontend.

The controller does not directly perform database operations. Database and business logic are delegated to `plantService.js`.

The overall architecture is:

```text
Frontend
   ↓
plantRoutes.js
   ↓
plantController.js
   ↓
plantService.js
   ↓
Database
```

---

## 2. Controller Responsibilities

The main responsibilities of `plantController.js` are:

- Receive HTTP requests.
- Read query parameters.
- Read route parameters.
- Read request body data.
- Call the appropriate Plant service function.
- Return successful responses.
- Handle service errors.
- Return appropriate HTTP status codes.
- Maintain a consistent API response structure.

The controller acts as the connection between the Plant API routes and the Plant service layer.

---

## 3. Dependency

The controller imports the Plant service:

```js
const plantService = require("../services/plantService");
```

This establishes the relationship:

```text
plantController.js
        ↓
plantService.js
```

The controller does not directly perform database queries.

---

## 4. Controller-Service Separation

The controller follows a clear separation of responsibilities.

The controller:

```text
Receive Request
      ↓
Extract Request Data
      ↓
Call Service
      ↓
Receive Service Result
      ↓
Return HTTP Response
```

The service handles the actual business logic and database operations.

---

## 5. getAllPlants()

### Purpose

`getAllPlants()` retrieves the list of plants.

It is used when the frontend needs to display plant records, such as in the Plant Directory.

### Request Data

The function passes query parameters to the service:

```js
const data = await plantService.getAllPlants(req.query);
```

The query parameters are obtained from:

```text
req.query
```

### Success Response

A successful request returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If the service throws an error:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Frontend
   ↓
GET Plant Request
   ↓
req.query
   ↓
getAllPlants()
   ↓
plantService.getAllPlants()
   ↓
Plant Records
   ↓
JSON Response
```

---

## 6. getPlantById()

### Purpose

`getPlantById()` retrieves a specific plant using its ID.

### Request Parameter

The plant ID is obtained from:

```text
req.params.id
```

The controller passes it to:

```js
plantService.getPlantById(req.params.id)
```

### Success Response

A successful request returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If the service operation fails:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Frontend
   ↓
Plant ID
   ↓
req.params.id
   ↓
getPlantById()
   ↓
plantService.getPlantById()
   ↓
Selected Plant
   ↓
JSON Response
```

---

## 7. createPlant()

### Purpose

`createPlant()` handles requests for creating a new plant.

It is used by the frontend Create Plant functionality.

### Request Body

The new plant information is obtained from:

```text
req.body
```

The controller passes the complete request body to the service:

```js
const data = await plantService.createPlant(req.body);
```

### Success Response

A successful plant creation returns:

```text
201 Created
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If creation fails:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Create Plant Form
       ↓
POST Request
       ↓
req.body
       ↓
createPlant()
       ↓
plantService.createPlant()
       ↓
Database
       ↓
Created Plant
       ↓
JSON Response
```

---

## 8. updatePlant()

### Purpose

`updatePlant()` handles requests for updating an existing plant.

It receives:

- The plant ID.
- The updated plant data.

### Plant ID

The plant ID is obtained from:

```text
req.params.id
```

### Updated Data

The updated information is obtained from:

```text
req.body
```

The service is called using both values:

```js
plantService.updatePlant(
  req.params.id,
  req.body
)
```

### Success Response

A successful update returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If the update fails:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Edit Plant Form
       ↓
Plant ID + Updated Data
       ↓
updatePlant()
       ↓
plantService.updatePlant()
       ↓
Database Update
       ↓
Updated Plant
       ↓
JSON Response
```

---

## 9. deletePlant()

### Purpose

`deletePlant()` handles deletion of a plant.

### Plant ID

The plant ID is obtained from:

```text
req.params.id
```

The controller passes it to:

```js
plantService.deletePlant(req.params.id)
```

### Success Response

A successful deletion returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If deletion fails:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Delete Plant
      ↓
Plant ID
      ↓
req.params.id
      ↓
deletePlant()
      ↓
plantService.deletePlant()
      ↓
Database Delete
      ↓
JSON Response
```

---

## 10. getPlantDashboard()

### Purpose

`getPlantDashboard()` retrieves dashboard-related Plant information.

No plant ID is required.

The controller calls:

```js
const data = await plantService.getPlantDashboard();
```

### Success Response

A successful request returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If an error occurs:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Frontend
   ↓
Plant Dashboard Request
   ↓
getPlantDashboard()
   ↓
plantService.getPlantDashboard()
   ↓
Dashboard Data
   ↓
JSON Response
```

---

## 11. getPlantLocations()

### Purpose

`getPlantLocations()` retrieves Plant location information.

This functionality supports the frontend Plant Locations feature.

The controller calls:

```js
const data = await plantService.getPlantLocations();
```

### Success Response

A successful request returns:

```text
200 OK
```

with:

```js
{
  success: true,
  data,
}
```

### Error Response

If an error occurs:

```text
500 Internal Server Error
```

with:

```js
{
  success: false,
  message: error.message,
}
```

### Flow

```text
Frontend
   ↓
Plant Locations Request
   ↓
getPlantLocations()
   ↓
plantService.getPlantLocations()
   ↓
Plant Location Data
   ↓
JSON Response
```

---

## 12. HTTP Status Codes

| Status Code | Usage |
|---|---|
| `200` | Successful retrieval, update, or deletion |
| `201` | Successful plant creation |
| `500` | Server, service, or database error |

---

## 13. Success Response Structure

The Plant controller uses a consistent success response:

```js
{
  success: true,
  data,
}
```

The `data` property contains the result returned by the Plant service.

---

## 14. Error Response Structure

Controller errors use:

```js
{
  success: false,
  message: error.message,
}
```

This gives the frontend a consistent way to identify failed requests and read the error message.

---

## 15. Error Handling Pattern

Plant controller functions use asynchronous `try/catch` handling.

The general pattern is:

```js
try {
  const data = await plantService.someFunction();

  res.status(200).json({
    success: true,
    data,
  });
} catch (error) {
  res.status(500).json({
    success: false,
    message: error.message,
  });
}
```

This prevents service exceptions from becoming unhandled request failures.

---

## 16. Asynchronous Processing

Plant controller functions are asynchronous.

They use:

```js
async
```

and:

```js
await
```

when calling service functions.

For example:

```js
const data = await plantService.getPlantById(req.params.id);
```

This allows the controller to wait for the service operation before returning the HTTP response.

---

## 17. Request Data Sources

The Plant controller uses three request data sources.

### Query Parameters

Used by:

```text
getAllPlants()
```

through:

```js
req.query
```

### Route Parameters

Used by:

```text
getPlantById()
updatePlant()
deletePlant()
```

through:

```js
req.params.id
```

### Request Body

Used by:

```text
createPlant()
updatePlant()
```

through:

```js
req.body
```

---

## 18. Request Parameter Summary

| Controller Function | Query | Route Parameter | Body |
|---|---|---|---|
| `getAllPlants` | `req.query` | No | No |
| `getPlantById` | No | `req.params.id` | No |
| `createPlant` | No | No | `req.body` |
| `updatePlant` | No | `req.params.id` | `req.body` |
| `deletePlant` | No | `req.params.id` | No |
| `getPlantDashboard` | No | No | No |
| `getPlantLocations` | No | No | No |

---

## 19. Service Function Mapping

| Controller Function | Service Function |
|---|---|
| `getAllPlants()` | `plantService.getAllPlants()` |
| `getPlantById()` | `plantService.getPlantById()` |
| `createPlant()` | `plantService.createPlant()` |
| `updatePlant()` | `plantService.updatePlant()` |
| `deletePlant()` | `plantService.deletePlant()` |
| `getPlantDashboard()` | `plantService.getPlantDashboard()` |
| `getPlantLocations()` | `plantService.getPlantLocations()` |

---

## 20. Plant CRUD Operations

The controller supports standard CRUD operations.

### Create

```text
createPlant()
    ↓
plantService.createPlant()
```

### Read

```text
getAllPlants()
getPlantById()
    ↓
plantService.getAllPlants()
plantService.getPlantById()
```

### Update

```text
updatePlant()
    ↓
plantService.updatePlant()
```

### Delete

```text
deletePlant()
    ↓
plantService.deletePlant()
```

---

## 21. Plant Dashboard Operation

The controller provides:

```text
getPlantDashboard()
```

This allows the frontend to retrieve Plant dashboard information.

The actual processing is delegated to:

```text
plantService.getPlantDashboard()
```

---

## 22. Plant Location Operation

The controller provides:

```text
getPlantLocations()
```

This allows the frontend to retrieve Plant location information.

The actual processing is delegated to:

```text
plantService.getPlantLocations()
```

---

## 23. Relationship With Plant Directory

The Plant Directory primarily depends on:

```text
getAllPlants()
```

The flow is:

```text
Plant Directory
      ↓
Plant API
      ↓
getAllPlants()
      ↓
plantService.getAllPlants()
      ↓
Plant Records
      ↓
JSON Response
      ↓
Plant Directory
```

---

## 24. Relationship With Create Plant Modal

The Create Plant interface uses:

```text
createPlant()
```

The flow is:

```text
Create Plant Modal
      ↓
req.body
      ↓
createPlant()
      ↓
plantService.createPlant()
      ↓
Database
      ↓
Created Plant
      ↓
Response
```

---

## 25. Relationship With Edit Plant Modal

The Edit Plant interface uses:

```text
updatePlant()
```

The controller receives:

```text
req.params.id
+
req.body
```

and passes both values to:

```text
plantService.updatePlant()
```

The flow is:

```text
Edit Plant Modal
      ↓
Plant ID + Updated Data
      ↓
updatePlant()
      ↓
plantService.updatePlant()
      ↓
Database
      ↓
Updated Plant
```

---

## 26. Relationship With Delete Plant Modal

The Delete Plant interface uses:

```text
deletePlant()
```

The controller receives:

```text
req.params.id
```

and passes it to:

```text
plantService.deletePlant()
```

The flow is:

```text
Delete Plant Modal
      ↓
Plant ID
      ↓
deletePlant()
      ↓
plantService.deletePlant()
      ↓
Database
      ↓
Delete Result
```

---

## 27. Relationship With Plant Dashboard

The Plant Dashboard uses:

```text
getPlantDashboard()
```

The controller does not require any request parameters.

The service is responsible for obtaining the dashboard data.

---

## 28. Relationship With Plant Locations

The Plant Locations frontend feature uses:

```text
getPlantLocations()
```

The controller calls the corresponding service method and returns the location data.

---

## 29. Complete Plants Controller Flow

```text
                         Frontend
                            │
                            ↓
                     Plant Routes
                            │
                            ↓
                  plantController.js
                            │
          ┌─────────────────┼──────────────────┐
          │        │        │        │         │
          ↓        ↓        ↓        ↓         ↓
       Get All   Get By   Create   Update    Delete
       Plants      ID      Plant    Plant     Plant
          │        │        │        │         │
          └────────┴────────┴────────┴─────────┘
                            │
                            ↓
                    plantService.js
                            │
                            ↓
                        Database
                            │
                            ↓
                    Service Result
                            │
                            ↓
                  plantController.js
                            │
                            ↓
                      JSON Response
                            │
                            ↓
                        Frontend
```

---

## 30. Exported Controller Functions

The controller exports its functions so that they can be used by the Plant routes.

The exported functions are:

```js
module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantDashboard,
  getPlantLocations
};
```

These functions are then mapped to API routes.

---

## 31. Complete Function List

| Function | Purpose |
|---|---|
| `getAllPlants()` | Retrieve all plant records |
| `getPlantById()` | Retrieve one plant by ID |
| `createPlant()` | Create a new plant |
| `updatePlant()` | Update an existing plant |
| `deletePlant()` | Delete a plant |
| `getPlantDashboard()` | Retrieve plant dashboard data |
| `getPlantLocations()` | Retrieve plant location data |

---

## 32. Overall Module Architecture

```text
                         Plants Frontend
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ↓                  ↓                  ↓
      Plant Directory      Plant Forms       Plant Dashboard
             │                  │                  │
             │          ┌───────┴───────┐          │
             │          │               │          │
             │       Create/Edit      Delete       │
             │          │               │          │
             └──────────┴───────────────┴──────────┘
                                │
                                ↓
                        plantRoutes.js
                                │
                                ↓
                     plantController.js
                                │
                                ↓
                       plantService.js
                                │
                                ↓
                            Database
                                │
                                ↓
                         JSON Response
                                │
                                ↓
                           Frontend
```

---

## 33. Summary

`plantController.js` is the HTTP controller for the SEWAC Plants module.

It provides seven main controller operations:

```text
getAllPlants()
getPlantById()
createPlant()
updatePlant()
deletePlant()
getPlantDashboard()
getPlantLocations()
```

The controller:

- Receives requests from Plant routes.
- Extracts query parameters, route parameters, and request bodies.
- Calls the corresponding service functions.
- Returns successful service results using `success: true`.
- Returns service errors using `success: false`.
- Uses HTTP `200` for successful retrieval, update, and deletion.
- Uses HTTP `201` for successful plant creation.
- Uses HTTP `500` when an exception occurs.
- Keeps database and business logic inside `plantService.js`.

The complete backend flow is:

```text
Frontend
   ↓
plantRoutes.js
   ↓
plantController.js
   ↓
plantService.js
   ↓
Database
   ↓
plantService.js
   ↓
plantController.js
   ↓
JSON Response
   ↓
Frontend
```
