# simulation3.js Documentation

## 1. File Overview

This file implements a larger Ward 216 vehicle simulation with:

```text
15 vehicles
1 GVP vehicle
14 COLLECTION vehicles
```

All vehicles use the same Ward 216 operating area.

---

# 2. Vehicle Range

The configured vehicles are:

```text
KA05AB1252
KA05AB1253
KA05AB1254
KA05AB1255
KA05AB1256
KA05AB1257
KA05AB1258
KA05AB1259
KA05AB1260
KA05AB1261
KA05AB1262
KA05AB1263
KA05AB1264
KA05AB1265
KA05AB1266
```

Total:

```text
15
```

---

# 3. Vehicle Distribution

The simulator validates that:

```text
GVP = 1
COLLECTION = 14
```

The GVP vehicle is:

```text
KA05AB1252
```

The remaining fourteen vehicles are COLLECTION vehicles.

---

# 4. Ward Configuration

All vehicles are configured for:

```text
Ward 216
Ibbalur
```

---

# 5. Routes

Two route definitions are provided:

```text
COLLECTION_ROUTE
GVP_ROUTE
```

The routes contain fixed GPS coordinates.

All COLLECTION vehicles use:

```text
COLLECTION_ROUTE
```

The GVP vehicle uses:

```text
GVP_ROUTE
```

---

# 6. Vehicle Classification

The GVP vehicle uses:

```text
unitNumber = SEWAC_01_HF
remarks = O
RFID does not begin with E
```

Collection vehicles use:

```text
unitNumber = SEWAC_01_UHF
remarks = empty
RFID begins with E
```

---

# 7. Configuration Validation

Before simulation starts, the script validates:

```text
15 total vehicles
1 GVP
14 COLLECTION
```

An incorrect configuration causes the script to throw an error.

---

# 8. Statistics

Global counters include:

```text
totalPackets
successfulPackets
failedPackets
collectionPackets
gvpPackets
```

Each vehicle also receives its own statistics object.

---

# 9. Packet Generation

A telemetry packet contains:

```text
rfidNumber
iotTimestamp
driverName
vehicleId
latitude
longitude
weight
firmwareVersion
unitNumber
remarks
errCode
```

The generated weight ranges from:

```text
0.5 kg → 12 kg
```

---

# 10. Telemetry API

Packets are sent to:

```text
/api/iot/telemetry/record
```

using HTTP GET.

---

# 11. Heartbeat API

The simulator also sends heartbeats to:

```text
/api/iot/heart-beat/<vehicleId>
```

with:

```text
latitude
longitude
```

as query parameters.

---

# 12. Packet + Heartbeat Execution

For each telemetry packet:

```text
sendPacket()
sendHeartbeat()
```

are executed concurrently with:

```text
Promise.allSettled()
```

---

# 13. Vehicle Loop

Each vehicle independently:

```text
waits 0.1–0.3 seconds
        ↓
creates telemetry
        ↓
sends telemetry + heartbeat
        ↓
advances route
```

All fifteen vehicles operate concurrently.

---

# 14. Summary

The final console output reports:

```text
Total vehicles
Total packets
Successful packets
Failed packets
Collection packets
GVP packets
```

and per-vehicle statistics.

---

# 15. Shutdown

The simulator supports:

```text
SIGINT
uncaughtException
unhandledRejection
```

and a five-minute automatic stop timer.

---

# 16. Summary

`simulation3.js` scales the SEWAC simulator to fifteen Ward 216 vehicles while maintaining separate GVP and COLLECTION classifications, predefined routes, randomized telemetry generation, heartbeat transmission, packet statistics, configuration validation, and concurrent execution.
