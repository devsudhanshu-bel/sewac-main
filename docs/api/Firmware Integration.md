# SEWAC IoT Telemetry API Integration Guide

**Version:** 1.0  
**Purpose:** Guide for integrating SEWAC IoT devices with the SEWAC Cloud Telemetry API.

---

# Benefits

- ✅ IoT firmware remains lightweight and simple.
- ✅ Authentication is performed using a fixed API Key.
- ✅ No JWT generation, refresh, or expiry handling is required on the IoT device.
- ✅ `app-authentication` remains dedicated to human users.
- ✅ Admin APIs continue using JWT-based authentication.
- ✅ IoT APIs use a dedicated API Key authentication middleware.
- ✅ Existing telemetry processing, Redis queue, and database logic are reused without modification.

---

# 1. Cloud Configuration

Configure the following constants inside the firmware.

```cpp
const char* SERVER_URL =
"https://sewac-main.onrender.com/api/iot/telemetry/record";

const char* API_KEY =
"YOUR_API_KEY";
```

> **Note**
>
> The API Key will be provided by the backend team.
>
> It must be sent in the HTTP header and **must never be appended to the URL**.

---

# 2. Authentication

Each request must include the following HTTP header.

| Header | Value |
|---------|-------|
| x-api-key | YOUR_API_KEY |

No login or JWT token is required for IoT devices.

---

# 3. HTTP Method

```
GET
```

---

# 4. Endpoint

```
https://sewac-main.onrender.com/api/iot/telemetry/record
```

---

# 5. Required Query Parameters

| Parameter | Description |
|------------|-------------|
| rfidNumber | RFID Tag Number |
| iotTimestamp | ISO 8601 UTC Timestamp |
| driverName | Driver Name |
| vehicleNumber | Vehicle Registration Number |
| vehicleId | Internal Vehicle ID |
| latitude | GPS Latitude |
| longitude | GPS Longitude |
| weight | Waste Weight (kg) |
| firmwareVersion | Firmware Version |
| unitNumber | IoT Reader Unit Number |
| remarks | Remarks (Optional for Citizen RFID) |
| errCode | Device Status/Error Code |

---

# 6. Sample Request

### URL

```text
GET https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470574606026FF800108&iotTimestamp=2026-07-23T12:02:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=7.2&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

### Header

```http
x-api-key: YOUR_API_KEY
```

---

# 7. Firmware Implementation (ESP32 Example)

```cpp
HTTPClient http;

String url = String(SERVER_URL)
           + "?rfidNumber=" + rfidNumber
           + "&iotTimestamp=" + iotTimestamp
           + "&driverName=" + driverName
           + "&vehicleNumber=" + vehicleNumber
           + "&vehicleId=" + vehicleId
           + "&latitude=" + latitude
           + "&longitude=" + longitude
           + "&weight=" + weight
           + "&firmwareVersion=" + firmwareVersion
           + "&unitNumber=" + unitNumber
           + "&remarks=" + remarks
           + "&errCode=" + errCode;

http.begin(url);

// Authentication Header
http.addHeader("x-api-key", API_KEY);

// Send GET Request
int responseCode = http.GET();

// Read Response
String response = http.getString();

http.end();
```
So the HTTP request sent by the ESP32 becomes:

GET /api/iot/telemetry/record?... HTTP/1.1
Host: sewac-main.onrender.com
x-api-key: 8fd2A7B3K91XZ

---

# 8. Expected Success Response

```json
{
    "success": true,
    "status": "QUEUED",
    "message": "Telemetry accepted and queued successfully."
}
```

---

# 9. Communication Flow

```
                 IoT Device
                       │
                       │
GET /api/iot/telemetry/record
Header:
x-api-key: YOUR_API_KEY
                       │
                       ▼
        Admin-Backend (Render)
                       │
        iotAuthMiddleware
      (Verifies API Key)
                       │
                       ▼
          Telemetry Controller
                       │
                       ▼
             Validation Layer
                       │
                       ▼
               Redis Queue
                       │
                       ▼
         Background Processing
                       │
                       ▼
          PostgreSQL Database
```

---

# 10. Backend Authentication Flow

Unlike Admin APIs, IoT devices do **not** authenticate using JWT.

Instead:

1. The IoT firmware sends telemetry using an HTTP GET request.
2. The firmware includes the `x-api-key` header.
3. The backend validates this API Key using `iotAuthMiddleware`.
4. If the API Key is valid:
   - Telemetry is accepted.
   - Request enters the Redis queue.
   - Background workers process the telemetry.
   - Data is stored in PostgreSQL.
5. If the API Key is invalid:
   - Request is rejected immediately.
   - No business logic is executed.

---

# 11. Important Notes

- Always use **HTTPS**.
- Never expose the API Key publicly.
- Never append the API Key to the URL.
- Always send the API Key using the `x-api-key` header.
- JWT/Bearer Authentication is **not** required for IoT devices.
- All telemetry parameters are transmitted as URL query parameters using the GET method.
- Backend authentication is completed before any telemetry processing begins.

---

# API Summary

| Item | Value |
|------|-------|
| Base URL | https://sewac-main.onrender.com |
| Endpoint | /api/iot/telemetry/record |
| Method | GET |
| Authentication | x-api-key Header |
| Request Format | Query Parameters |
| Response | JSON |

---

# Backend Contact

**SEWAC Backend Team**

**API Version:** v1.0