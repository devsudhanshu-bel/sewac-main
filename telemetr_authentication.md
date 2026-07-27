# SEWAC IoT Telemetry API Integration Guide

Benefits
✅ IoT firmware stays very simple (just one fixed secret key).
✅ No JWT generation, refresh, or expiry handling on the device.
✅ app-authentication remains dedicated to human users.
✅ Admin APIs continue using JWT and authMiddleware.
✅ IoT APIs use a separate verifyIoT middleware.
✅ Your existing telemetry controller and Redis queue can be reused without changes.




**Version:** 1.0
**Purpose:** Guide for integrating SEWAC IoT devices with the SEWAC Cloud Telemetry API.

---

# 1. Cloud Configuration

Configure the following constants in the firmware:

```cpp
const char* SERVER_URL =
"https://sewac-main.onrender.com/api/iot/telemetry/record";

const char* API_KEY =
"YOUR_API_KEY";
```

> **Note:** The API key will be provided by the backend team. It must be sent in the request header and **must never be appended to the URL**.

---

# 2. Authentication

Each request must include the following HTTP header:

| Header      | Value          |
| ----------- | -------------- |
| `x-api-key` | `YOUR_API_KEY` |

No JWT token or login is required for IoT devices.

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

| Parameter       | Description                 |
| --------------- | --------------------------- |
| rfidNumber      | RFID Tag Number             |
| iotTimestamp    | ISO Timestamp (UTC)         |
| driverName      | Driver Name                 |
| vehicleNumber   | Vehicle Registration Number |
| vehicleId       | Internal Vehicle ID         |
| latitude        | GPS Latitude                |
| longitude       | GPS Longitude               |
| weight          | Waste Weight (kg)           |
| firmwareVersion | Device Firmware Version     |
| unitNumber      | IoT Device Unit Number      |
| remarks         | Remarks (Optional)          |
| errCode         | Device Status/Error Code    |

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

# 7. ESP32 Example

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

// Send Request
int responseCode = http.GET();

String response = http.getString();

http.end();
```

---

# 8. Success Response

```json
{
  "success": true,
  "status": "QUEUED",
  "message": "Telemetry accepted and queued successfully."
}
```

---

# 9. Backend Processing Flow

```text
IoT Device
      │
      ▼
GET /api/iot/telemetry/record
      │
      ▼
x-api-key Authentication
      │
      ▼
Telemetry Validation
      │
      ▼
Redis Queue
      │
      ▼
Business Logic Processing
      │
      ▼
PostgreSQL Database
```

---

# Important Notes

* Use **HTTPS** only.
* Send the API Key in the **`x-api-key` header**.
* **Do not** include the API key in the URL.
* **Do not** use JWT/Bearer authentication for IoT devices.
* All telemetry data must be sent as **query parameters** using the **GET** method.
* The backend will authenticate the API key before processing and storing telemetry data.

---

**Backend Contact:** SEWAC Backend Team
**API Version:** v1.0
