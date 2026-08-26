# simulation2.js Documentation

## 1. File Overview

This file extends the SEWAC vehicle simulator with heartbeat functionality.

It simulates:

```text
KA05AB1237 → COLLECTION
KA05AB1238 → GVP
```

for five minutes.

In addition to telemetry packets, it sends a heartbeat request for each generated packet.

---

# 2. Simulation Configuration

Duration:

```text
5 minutes
```

Random packet delay:

```text
0.1 seconds → 0.3 seconds
```

Ward:

```text
216
Ibbalur
```

---

# 3. APIs

Telemetry requests are sent to:

```text
/api/iot/telemetry/record
```

Heartbeat requests are sent to:

```text
/api/iot/heart-beat
```

The heartbeat URL includes the vehicle ID.

---

# 4. Vehicle Configuration

## COLLECTION

```text
KA05AB1237
SEWAC_01_UHF
E-prefixed RFID
remarks = ""
```

## GVP

```text
KA05AB1238
SEWAC_01_HF
non-E-prefixed RFID
remarks = "O"
```

---

# 5. Telemetry Packet

The simulator generates:

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

Cumulative weight is intentionally not transmitted.

---

# 6. GPS Handling

The simulator calculates the current position from the vehicle route using interpolation.

Random GPS variation is applied to the generated coordinates.

---

# 7. Weight

Each packet generates:

```text
0.5 kg → 12 kg
```

with two decimal places.

The backend is responsible for cumulative-weight calculation.

---

# 8. sendPacket()

Sends the telemetry request through HTTP GET.

It updates:

```text
packet counters
success counters
failure counters
last position
last weight
```

depending on the response.

---

# 9. sendHeartbeat()

Creates a heartbeat request using:

```text
vehicleId
latitude
longitude
```

The latitude and longitude come from the exact same telemetry packet.

The heartbeat uses HTTP GET and includes:

```text
Accept: application/json
User-Agent: SEWAC-Vehicle-Simulator
```

Successful heartbeat requests are logged separately.

Heartbeat failures are logged without stopping the vehicle simulation.

---

# 10. Concurrent Telemetry and Heartbeat

For each generated packet:

```text
sendPacket()
sendHeartbeat()
```

are executed concurrently using:

```text
Promise.allSettled()
```

This ensures a failure in one operation does not automatically prevent the other operation from completing.

---

# 11. Vehicle Loop

Each vehicle performs:

```text
random delay
      ↓
create telemetry packet
      ↓
send telemetry
      +
send heartbeat
      ↓
advance route
```

---

# 12. Statistics

The simulator maintains global statistics for:

```text
totalPackets
successfulPackets
failedPackets
collectionPackets
gvpPackets
```

Per-vehicle statistics include packet counts and latest telemetry position/weight.

Heartbeat-specific success/failure counters are not maintained in the statistics object.

---

# 13. Summary

At completion, the simulator reports:

```text
Total packets
Successful packets
Failed packets
Collection packets
GVP packets
```

and per-vehicle packet information.

---

# 14. Shutdown

The script handles:

```text
SIGINT
uncaughtException
unhandledRejection
```

A five-minute timer also triggers the normal stop routine.

---

# 15. Summary

`simulation2.js` is a two-vehicle Ward 216 simulator that retains the original telemetry behavior and adds heartbeat requests. Each heartbeat uses the same latitude and longitude generated for the corresponding telemetry packet, while telemetry and heartbeat requests execute concurrently.
