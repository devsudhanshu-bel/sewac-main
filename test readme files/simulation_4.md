# simulation(4).js Documentation

## 1. File Overview

This file implements a five-minute SEWAC vehicle telemetry simulator for Ward 216.

It simulates two vehicle types:

```text
KA05AB1237 → COLLECTION
KA05AB1238 → GVP
```

The simulator sends telemetry packets to the SEWAC telemetry API.

---

# 2. Simulation Configuration

The simulator runs for:

```text
5 minutes
```

Packet delays are randomized between:

```text
0.1 seconds
0.3 seconds
```

The simulated ward is:

```text
Ward 216
Ibbalur
```

---

# 3. Telemetry API

Telemetry packets are sent to the configured API endpoint:

```text
/api/iot/telemetry/record
```

The simulator uses HTTP GET requests.

---

# 4. Vehicle Classification

## COLLECTION Vehicle

```text
Vehicle: KA05AB1237
Unit: SEWAC_01_UHF
RFID: E-prefixed
Remarks: empty
Type: COLLECTION
```

The configuration is intended to match the backend's manual/UHF classification.

## GVP Vehicle

```text
Vehicle: KA05AB1238
Unit: SEWAC_01_HF
RFID: non-E-prefixed
Remarks: O
Type: GVP
```

The configuration is intended to match the backend's GVP/auto classification.

---

# 5. Vehicle Routes

Each vehicle contains a predefined GPS route.

The simulator tracks:

```text
routeIndex
```

and moves through the route cyclically.

---

# 6. GPS Interpolation

The current vehicle position is calculated between:

```text
current route point
next route point
```

using interpolation with a fixed progress value of:

```text
0.35
```

Small random coordinate variations are added to prevent identical GPS coordinates.

---

# 7. Weight Generation

Each telemetry packet generates one random weight:

```text
0.5 kg → 12 kg
```

The value is rounded to two decimal places.

The simulator intentionally does not send:

```text
cumulativeWeight
```

The source comments state that cumulative weight is calculated by the backend.

---

# 8. Telemetry Packet

Each packet contains:

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

The simulator explicitly avoids sending:

```text
cumulativeWeight
citizenContact
```

---

# 9. HTTP Request

The packet fields are converted into URL query parameters.

The request uses:

```text
GET
```

with:

```text
Accept: application/json
User-Agent: SEWAC-Vehicle-Simulator
```

---

# 10. Statistics

Global statistics track:

```text
totalPackets
successfulPackets
failedPackets
collectionPackets
gvpPackets
```

Per-vehicle statistics track:

```text
packetsSent
packetsSuccessful
packetsFailed
collectionPackets
gvpPackets
lastLatitude
lastLongitude
lastWeight
firstPacketAt
lastPacketAt
```

---

# 11. sendPacket()

`sendPacket()` sends one telemetry packet.

On success it:

```text
increments successful counters
stores the latest position
stores the latest weight
logs the packet
```

On HTTP failure it:

```text
increments failure counters
logs vehicle information
logs HTTP status
logs response body
logs request URL
```

Network/request errors are also captured.

---

# 12. Vehicle Loop

Each vehicle independently:

```text
waits for a random delay
        ↓
creates telemetry packet
        ↓
sends packet
        ↓
moves to next route point
```

Both vehicles execute concurrently through:

```text
Promise.all()
```

---

# 13. Simulation Duration

A stop timer is configured for:

```text
5 minutes
```

The simulation also checks the stop time inside each vehicle loop.

---

# 14. Summary

At completion, the simulator prints:

```text
Duration
Random delay
Total packets
Successful packets
Failed packets
Collection packets
GVP packets
```

It then prints per-vehicle statistics.

---

# 15. Shutdown Handling

The simulator supports:

```text
SIGINT
```

for manual termination.

It also registers handlers for:

```text
uncaughtException
unhandledRejection
```

---

# 16. Export / Execution

The file executes the simulator directly through:

```text
startSimulation()
```

It is therefore intended as an executable simulation script rather than an exported module.

---

# 17. Summary

`simulation(4).js` simulates two Ward 216 vehicles, one COLLECTION/UHF vehicle and one GVP vehicle, generating randomized GPS positions and weights and continuously submitting telemetry packets for five minutes. It tracks packet-level statistics, logs successful and failed requests, and handles manual and runtime shutdown conditions.
