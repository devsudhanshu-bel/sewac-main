# overviewController.js Documentation

## 1. Component / File Overview

### File Name

overviewController.js

### File Location

src/controllers/overviewController.js

### Purpose

The `overviewController.js` file contains the controller functions responsible for handling Overview-related HTTP requests in the SEWAC Admin Backend.

The controller acts as the middle layer between the incoming API request and the `overviewService`.

Its main responsibility is to:

- Receive HTTP requests from the Overview routes.
- Read required query parameters from the request.
- Pass those parameters to the appropriate service function.
- Receive processed data from `overviewService`.
- Return a structured JSON response to the frontend.
- Handle errors that occur while processing Overview requests.
- Return appropriate HTTP status codes.

The controller does not directly perform database operations. Instead, it delegates the actual business/data-processing logic to:

    src/services/overviewService.js

---

## 2. Role in Backend Architecture

The `overviewController.js` file follows the controller-service architecture used by the backend.

The general request flow is:

    Frontend
       ↓
    HTTP Request
       ↓
    Route
       ↓
    overviewController.js
       ↓
    overviewService.js
       ↓
    Database / Data Processing
       ↓
    overviewService.js
       ↓
    overviewController.js
       ↓
    JSON Response
       ↓
    Frontend

This separation keeps HTTP request handling separate from business logic and database-related processing.

---

## 3. Service Dependency

The controller imports the Overview service using:

    const overviewService = require("../services/overviewService");

This means all Overview business/data operations are delegated to `overviewService`.

The controller itself does not directly access Prisma or the database.

The relationship is:

    overviewController.js
            ↓
    overviewService.js
            ↓
    Database / Business Logic

---

## 4. Exported Controller Functions

The file exports five controller functions:

1. `getSummary`
2. `getVehicleSummary`
3. `getGenerationTrend`
4. `getMapData`
5. `getOverviewFilters`

The export structure is:

    module.exports = {
      getSummary,
      getVehicleSummary,
      getGenerationTrend,
      getMapData,
      getOverviewFilters,
    };

These functions can then be imported and connected to the corresponding Overview routes.

---

# 5. getSummary

## Purpose

The `getSummary` function handles requests for the main Overview summary information.

It collects filtering parameters from the request query and passes them to:

    overviewService.getSummary()

The service result is then returned to the frontend.

---

## Request Parameters

The function reads the following query parameters:

- `date`
- `cityId`
- `zoneId`
- `divisionId`
- `wardId`

These values are accessed using:

    req.query.date
    req.query.cityId
    req.query.zoneId
    req.query.divisionId
    req.query.wardId

---

## Service Call

The controller calls:

    overviewService.getSummary(
      req.query.date,
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

The parameters are passed to the service in the following order:

    date
      ↓
    cityId
      ↓
    zoneId
      ↓
    divisionId
      ↓
    wardId

---

## Successful Response

If the service completes successfully, the controller returns:

    HTTP 200

with the following JSON structure:

    {
      success: true,
      data
    }

The service result is stored in:

    const data

and returned through the `data` property.

---

## Error Handling

If an error occurs, the function:

1. Logs the error using `console.error()`.
2. Returns HTTP status `500`.
3. Returns a JSON response containing:
   - `success: false`
   - The error message.

The response structure is:

    {
      success: false,
      message: error.message
    }

The error log is:

    Overview summary error:

---

## Flow

    GET Overview Summary Request
              ↓
       Read Query Parameters
              ↓
       overviewService.getSummary()
              ↓
          Data Returned
              ↓
         HTTP 200 Response

If an error occurs:

    Service Error
         ↓
    console.error()
         ↓
    HTTP 500
         ↓
    Error JSON Response

---

# 6. getVehicleSummary

## Purpose

The `getVehicleSummary` function handles requests for vehicle-related summary information within the Overview section.

It retrieves filtering information from the request and passes it to:

    overviewService.getVehicleSummary()

---

## Request Parameters

The function reads:

- `cityId`
- `zoneId`
- `divisionId`
- `wardId`

The values are accessed using:

    req.query.cityId
    req.query.zoneId
    req.query.divisionId
    req.query.wardId

Unlike `getSummary`, this function does not read a `date` query parameter.

---

## Service Call

The controller calls:

    overviewService.getVehicleSummary(
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

The parameters are passed in the following order:

    cityId
      ↓
    zoneId
      ↓
    divisionId
      ↓
    wardId

---

## Successful Response

When the service operation succeeds, the controller returns:

    HTTP 200

with:

    {
      success: true,
      data
    }

---

## Error Handling

If an error occurs, the controller:

1. Logs the error.
2. Returns HTTP `500`.
3. Returns the error message.

The error log prefix is:

    Overview vehicle summary error:

The error response is:

    {
      success: false,
      message: error.message
    }

---

## Flow

    Vehicle Summary Request
             ↓
       Read Query Filters
             ↓
    overviewService.getVehicleSummary()
             ↓
          Data Returned
             ↓
        HTTP 200 Response

---

# 7. getGenerationTrend

## Purpose

The `getGenerationTrend` function handles requests for generation trend information displayed in the Overview section.

It accepts date and geographical/administrative filtering parameters and delegates the processing to:

    overviewService.getGenerationTrend()

---

## Request Parameters

The controller reads:

- `date`
- `cityId`
- `zoneId`
- `divisionId`
- `wardId`

The values are retrieved from:

    req.query.date
    req.query.cityId
    req.query.zoneId
    req.query.divisionId
    req.query.wardId

---

## Service Call

The controller calls:

    overviewService.getGenerationTrend(
      req.query.date,
      req.query.cityId,
      req.query.zoneId,
      req.query.divisionId,
      req.query.wardId,
    );

The parameter order is:

    date
      ↓
    cityId
      ↓
    zoneId
      ↓
    divisionId
      ↓
    wardId

---

## Successful Response

When the service successfully returns trend data, the controller responds with:

    HTTP 200

and:

    {
      success: true,
      data
    }

---

## Error Handling

If an error occurs, the controller logs:

    Overview generation trend error:

and returns:

    HTTP 500

with:

    {
      success: false,
      message: error.message
    }

---

## Flow

    Generation Trend Request
             ↓
       Read Query Parameters
             ↓
    overviewService.getGenerationTrend()
             ↓
        Trend Data Returned
             ↓
        HTTP 200 Response

---

# 8. getMapData

## Purpose

The `getMapData` function handles requests for Overview map-related information.

It retrieves geographical filtering information from the request and passes it to:

    overviewService.getMapData()

---

## Request Parameters

The controller reads:

- `cityId`
- `zoneId`

These values are accessed through:

    req.query.cityId
    req.query.zoneId

---

## Service Call

The function calls:

    overviewService.getMapData(
      req.query.cityId,
      req.query.zoneId,
    );

The parameters are passed in this order:

    cityId
      ↓
    zoneId

---

## Successful Response

If the service successfully returns map information, the controller sends:

    HTTP 200

with:

    {
      success: true,
      data
    }

---

## Error Handling

If the service throws an error, the controller logs:

    Overview map error:

and returns:

    HTTP 500

with:

    {
      success: false,
      message: error.message
    }

---

## Flow

    Map Data Request
          ↓
    Read cityId / zoneId
          ↓
    overviewService.getMapData()
          ↓
      Map Data
          ↓
    HTTP 200 Response

---

# 9. getOverviewFilters

## Purpose

The `getOverviewFilters` function retrieves the filter information required by the Overview section.

Unlike the other controller functions, it does not read any query parameters from `req.query`.

Instead, it directly calls:

    overviewService.getOverviewFilters()

---

## Service Call

The function executes:

    const data = await overviewService.getOverviewFilters();

No parameters are passed to the service.

---

## Successful Response

When the service successfully returns the filter data, the controller responds with:

    HTTP 200

and:

    {
      success: true,
      data
    }

---

## Error Handling

If an error occurs, the controller logs:

    Overview filters error:

and returns:

    HTTP 500

with:

    {
      success: false,
      message: error.message
    }

---

## Flow

    Overview Filters Request
             ↓
    overviewService.getOverviewFilters()
             ↓
         Filter Data
             ↓
       HTTP 200 Response

---

# 10. Query Parameter Handling

The controller uses `req.query` to read filtering information from incoming HTTP requests.

The main query parameters used by this controller are:

| Parameter | Used By |
|---|---|
| `date` | `getSummary`, `getGenerationTrend` |
| `cityId` | `getSummary`, `getVehicleSummary`, `getGenerationTrend`, `getMapData` |
| `zoneId` | `getSummary`, `getVehicleSummary`, `getGenerationTrend`, `getMapData` |
| `divisionId` | `getSummary`, `getVehicleSummary`, `getGenerationTrend` |
| `wardId` | `getSummary`, `getVehicleSummary`, `getGenerationTrend` |

These parameters allow the Overview APIs to retrieve information based on different administrative or geographical filters.

---

# 11. Controller-Service Separation

The controller intentionally does not contain the main business logic.

For example, `getSummary` does not calculate the summary itself.

Instead:

    Controller
       ↓
    Receives Request
       ↓
    Extracts Parameters
       ↓
    Calls Service
       ↓
    Returns Result

The service is responsible for processing the actual request.

This provides a clear separation of responsibilities.

---

# 12. HTTP Status Codes

The controller currently uses two main HTTP status codes.

## 200 - Successful Request

Used when the service operation completes successfully.

Response:

    {
      success: true,
      data
    }

## 500 - Server Error

Used when an exception occurs during service execution.

Response:

    {
      success: false,
      message: error.message
    }

---

# 13. Response Structure

All five controller functions follow a consistent response format.

## Success

    {
      success: true,
      data
    }

## Failure

    {
      success: false,
      message: error.message
    }

This consistency makes it easier for the frontend to process API responses.

---

# 14. Error Handling Pattern

Every controller function follows the same basic error-handling structure:

    try {
        // Service call
    } catch (error) {
        // Log error
        // Return HTTP 500
    }

This prevents unhandled service exceptions from causing the request to fail without a structured response.

---

# 15. Logging

The controller uses `console.error()` to log errors.

Each function has its own descriptive error prefix.

### Summary

    Overview summary error:

### Vehicle Summary

    Overview vehicle summary error:

### Generation Trend

    Overview generation trend error:

### Map

    Overview map error:

### Filters

    Overview filters error:

These messages help identify which Overview operation produced an error.

---

# 16. Asynchronous Processing

All controller functions are declared using `async`.

For example:

    const getSummary = async (req, res) => {

The service calls are executed using `await`.

For example:

    const data = await overviewService.getSummary(...);

This allows the controller to wait for the service operation to complete before sending the response.

---

# 17. Data Handling

The controller does not transform the service response before returning it.

The process is:

    Service
       ↓
    data
       ↓
    Response
       ↓
    data

For example:

    const data = await overviewService.getMapData(...);

followed by:

    return res.status(200).json({
      success: true,
      data,
    });

Therefore, the service output is directly placed inside the response's `data` property.

---

# 18. Dependency Structure

The controller has one direct application dependency:

    ../services/overviewService

The relationship is:

    overviewController.js
            ↓
    overviewService.js

The controller itself does not import Prisma or other database libraries.

---

# 19. Functions and Their Responsibilities

| Function | Responsibility | Parameters |
|---|---|---|
| `getSummary` | Retrieve Overview summary data | date, cityId, zoneId, divisionId, wardId |
| `getVehicleSummary` | Retrieve vehicle summary data | cityId, zoneId, divisionId, wardId |
| `getGenerationTrend` | Retrieve generation trend data | date, cityId, zoneId, divisionId, wardId |
| `getMapData` | Retrieve Overview map data | cityId, zoneId |
| `getOverviewFilters` | Retrieve available Overview filters | None |

---

# 20. Overall Controller Flow

The complete Overview controller architecture is:

    ┌───────────────────────────────┐
    │          Frontend             │
    └───────────────┬───────────────┘
                    │
                    │ HTTP Request
                    ↓
    ┌───────────────────────────────┐
    │      Overview Routes          │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │   overviewController.js       │
    │                               │
    │   getSummary                  │
    │   getVehicleSummary           │
    │   getGenerationTrend          │
    │   getMapData                  │
    │   getOverviewFilters          │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │      overviewService.js       │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │     Database / Data Layer     │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │      Service Result            │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │   overviewController.js       │
    │                               │
    │   success: true               │
    │   data: result                │
    └───────────────┬───────────────┘
                    │
                    ↓
    ┌───────────────────────────────┐
    │          Frontend             │
    └───────────────────────────────┘

---

# 21. Function-Level Request Flow

## Summary

    Request
      ↓
    getSummary()
      ↓
    req.query
      ↓
    overviewService.getSummary()
      ↓
    Response

## Vehicle Summary

    Request
      ↓
    getVehicleSummary()
      ↓
    req.query
      ↓
    overviewService.getVehicleSummary()
      ↓
    Response

## Generation Trend

    Request
      ↓
    getGenerationTrend()
      ↓
    req.query
      ↓
    overviewService.getGenerationTrend()
      ↓
    Response

## Map

    Request
      ↓
    getMapData()
      ↓
    req.query
      ↓
    overviewService.getMapData()
      ↓
    Response

## Filters

    Request
      ↓
    getOverviewFilters()
      ↓
    overviewService.getOverviewFilters()
      ↓
    Response

---

# 22. Design Pattern

The file follows a controller-service pattern.

The controller is responsible for:

- HTTP request handling.
- Query parameter extraction.
- Calling service functions.
- HTTP response creation.
- Error handling.

The service is responsible for:

- Business logic.
- Data processing.
- Database interaction.
- Generating the requested result.

This separation makes the backend easier to maintain and extend.

---

# 23. Maintainability

Keeping the Overview request handling inside a dedicated controller provides several benefits.

Developers can modify:

- Request parameters.
- Response structures.
- Error handling.
- Service calls.

without placing business logic directly inside the route definitions.

Similarly, changes to database/business logic can be handled inside `overviewService.js` without requiring the controller to directly interact with the database.

---

# 24. Extensibility

Additional Overview operations can be added using the same pattern.

For example:

    const newOverviewFunction = async (req, res) => {
      try {
        const data = await overviewService.newOperation(...);

        return res.status(200).json({
          success: true,
          data,
        });
      } catch (error) {
        console.error("Overview operation error:", error);

        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
    };

The function can then be exported and connected to an appropriate route.

---

# 25. Important Implementation Notes

- `overviewController.js` is an Express-style controller module.
- It uses CommonJS `require()` and `module.exports`.
- It depends on `../services/overviewService`.
- It contains five exported controller functions.
- The functions are asynchronous.
- Query parameters are accessed through `req.query`.
- Business/data-processing operations are delegated to the service layer.
- Successful operations return HTTP `200`.
- Successful responses use `{ success: true, data }`.
- Errors are logged using `console.error()`.
- Errors return HTTP `500`.
- Error responses use `{ success: false, message: error.message }`.
- The controller does not directly perform database queries.
- `getSummary` and `getGenerationTrend` accept a `date` parameter.
- `getMapData` only passes `cityId` and `zoneId`.
- `getOverviewFilters` does not require query parameters.

---

# 26. Backend Layer Relationship

The Overview backend feature can be represented as:

    Frontend Overview Page
             ↓
       Overview API
             ↓
      Overview Route
             ↓
    overviewController.js
             ↓
     overviewService.js
             ↓
      Data / Database Layer
             ↓
     overviewService.js
             ↓
    overviewController.js
             ↓
       JSON Response
             ↓
    Frontend Overview Page

This layered structure keeps request handling, business logic, and data operations separated.

---

# 27. Summary

`overviewController.js` is the HTTP controller layer for the SEWAC Admin Overview functionality.

It provides five main operations:

1. `getSummary`  
   Retrieves Overview summary information using date and administrative filters.

2. `getVehicleSummary`  
   Retrieves vehicle summary information using administrative filters.

3. `getGenerationTrend`  
   Retrieves generation trend information using date and administrative filters.

4. `getMapData`  
   Retrieves Overview map data using city and zone filters.

5. `getOverviewFilters`  
   Retrieves the available Overview filter information without requiring query parameters.

The overall responsibility of the controller is:

    Receive Request
         ↓
    Extract Query Parameters
         ↓
    Call Overview Service
         ↓
    Receive Data
         ↓
    Return JSON Response
         ↓
    Handle Errors When Required

The controller maintains a clean separation between HTTP request handling and the underlying Overview business/data logic implemented by `overviewService.js`.