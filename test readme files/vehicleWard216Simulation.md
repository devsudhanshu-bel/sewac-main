# vehicleWard216Simulation.js Documentation

## 1. File Overview

This file implements a database-driven live vehicle simulation for Ward 216.

Unlike fixed-coordinate simulations, it loads:

```text
Ward hierarchy
Citizens
RFIDs
Citizen GPS coordinates
Ward boundary
```

from the application's databases.

The simulation operates two vehicles:

```text
KA05AB1237
KA05AB1238
```

---

# 2. Ward Hierarchy

The configured hierarchy is:

```text
Bangalore
   ↓
Bengaluru South City Corporation
   ↓
Bommanahalli Division
   ↓
Ward 216
   ↓
Ibbluru
```

---

# 3. Data Sources

The simulation uses:

```text
Helper Prisma
Master Citizen Prisma
```

Citizen data is read from:

```text
master_citizen_data
```

The ward hierarchy and boundary are obtained from the Master Citizen hierarchy.

The source explicitly avoids:

```text
hardcoded citizen coordinates
CSV files
hardcoded RFID values
hardcoded ward boundary
```

---

# 4. API Configuration

The telemetry API is obtained from:

```text
process.env.TELEMETRY_API_URL
```

with a configured default telemetry endpoint.

---

# 5. Simulation Duration

The duration is configurable through:

```text
SIMULATION_MINUTES
```

The default is:

```text
10 minutes
```

---

# 6. Packet Interval

Each vehicle independently waits a randomized amount of time.

Default:

```text
5 seconds → 12 seconds
```

The interval can be controlled through:

```text
MIN_DELAY_SECONDS
MAX_DELAY_SECONDS
```

---

# 7. Vehicle Configuration

Two vehicles are defined:

```text
KA05AB1237
KA05AB1238
```

Both are assigned to:

```text
Ward 216
Ibbluru
```

Both use:

```text
SEWAC_01_UHF
```

as their telemetry unit.

---

# 8. Ward Mapping

`getWardMapping()` traverses the Master Citizen hierarchy:

```text
city_table
    ↓
city table
    ↓
zone table
    ↓
division table
    ↓
ward table
```

It searches for:

```text
ward_no = 216
```

and retrieves:

```text
city ID/name
zone ID/name
division ID/name
ward ID
ward number
ward name
ward table name
geo boundary
```

---

# 9. SQL Identifier Validation

Dynamic table names are validated against:

```text
^[a-zA-Z_][a-zA-Z0-9_]*$
```

Unsafe identifiers cause an error.

---

# 10. Citizen Loading

`loadWardCitizens()` queries:

```text
master_citizen_data
```

for:

```text
ward = "216"
```

It retrieves:

```text
id
personName
dryRFID
drySlno
wetRFID
wetSlno
lat
lng
ward
```

---

# 11. Citizen Validation

A citizen is retained only when:

```text
at least one dry/wet RFID begins with E
```

and:

```text
latitude is valid
longitude is valid
```

If no valid citizens are found, the simulation fails.

---

# 12. Ward Boundary Filtering

When a ward boundary is available, citizens are filtered using geographic containment.

Supported GeoJSON structures include:

```text
Feature
FeatureCollection
Polygon
MultiPolygon
```

The point-in-polygon logic accounts for:

```text
outer boundaries
polygon holes
multiple polygons
```

---

# 13. Missing Boundary

If no ward boundary exists, the simulator logs a warning and retains the valid Ward 216 citizens instead of discarding them.

---

# 14. Route Construction

Each vehicle receives its own shuffled citizen route.

This prevents both vehicles from following exactly the same citizen sequence.

Each vehicle begins at a randomly selected route position.

---

# 15. Vehicle Movement

Vehicles do not teleport directly between citizens.

Instead, they move a random fraction toward the next target.

The movement fraction is:

```text
0.08 → 0.20
```

of the remaining distance.

---

# 16. Distance Calculation

The simulator uses an approximate Haversine calculation to determine distance in meters.

When the vehicle is within:

```text
3 meters
```

of the target, the next citizen is selected.

---

# 17. RFID Selection

For each current citizen, the simulator creates a list of valid RFIDs.

Eligible RFID sources are:

```text
dryRFID
wetRFID
```

but only RFIDs beginning with:

```text
E
```

are accepted.

One valid RFID is selected randomly for each telemetry packet.

---

# 18. Weight Generation

Each telemetry packet generates a random household collection weight between:

```text
0.5 kg
12 kg
```

rounded to two decimal places.

---

# 19. Remarks

The simulator deliberately returns:

```text
""
```

for remarks.

The source comments identify this as the required value for manual/UHF packet classification.

---

# 20. Error Code

Every packet uses:

```text
R0L0G0D0C1
```

as its error code.

---

# 21. Telemetry Packet

The generated packet contains:

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

---

# 22. API Request

The telemetry packet is converted into query parameters and sent using HTTP GET.

The request includes:

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

---

# 23. Packet Statistics

Global statistics track:

```text
totalPackets
successfulPackets
failedPackets
```

Per-vehicle statistics track:

```text
packetsSent
packetsSuccessful
packetsFailed
firstPacketAt
lastPacketAt
lastRFID
lastLatitude
lastLongitude
```

---

# 24. Vehicle Loop

Each vehicle independently executes:

```text
random wait
    ↓
move vehicle
    ↓
select current citizen
    ↓
select RFID
    ↓
generate weight
    ↓
generate telemetry
    ↓
send packet
```

Both vehicle loops run concurrently.

---

# 25. Main Initialization Flow

The main process performs:

```text
Load Ward Mapping
        ↓
Load Ward Citizens
        ↓
Filter by Ward Boundary
        ↓
Assign Citizens to Vehicles
        ↓
Build Vehicle Routes
        ↓
Set Initial Positions
        ↓
Start Concurrent Vehicle Loops
        ↓
Print Summary
```

---

# 26. Database Cleanup

After simulation completion or failure, the script attempts to disconnect:

```text
helperPrisma
masterCitizenPrisma
```

---

# 27. Simulation Summary

The final summary reports:

```text
Ward
Area
Duration
Random delay
Total packets
Successful packets
Failed packets
```

and per-vehicle:

```text
vehicle
ward
area
unit
citizens used
packets
success
failure
last RFID
last position
```

---

# 28. Summary

`vehicleWard216Simulation.js` is a database-driven Ward 216 vehicle simulator. It discovers the actual ward hierarchy and boundary from the Master Citizen database, loads real Ward 216 citizens and their RFID/GPS data from the Helper database, filters citizens geographically, creates independent randomized vehicle routes, simulates gradual vehicle movement, generates collection weights, selects valid citizen RFIDs, sends telemetry packets, tracks statistics, and cleans up both Prisma connections after execution.
