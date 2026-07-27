
Assumptions:

* Valid Vehicle ID = `VH001` (hardcoded from UI)
* Vehicle = `KA01AB1234`
* Driver = `Ramesh`
* Firmware = `v1.0.0`
* Coordinates remain the same.

# Base URLs:
1) Local: http://localhost:5002/api/
2) Render: https://sewac-main.onrender.com/api/

#
## 🟢 Three Positive Test URLs (for completeness)

### DRY Citizen

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:00:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

### WET Citizen

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470574606026FF800108&iotTimestamp=2026-07-23T12:02:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=7.2&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

### Driver HF (Mixed Waste)

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=6667889028&iotTimestamp=2026-07-23T12:05:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=9.4&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_HF&remarks=O&errCode=R0L0G0D0C0
```


---

# ❌ Test 1 — HF RFID scanned on UHF Reader

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=6667889028&iotTimestamp=2026-07-23T12:10:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=8.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=O&errCode=R0L0G0D0C0
```

---

# ❌ Test 2 — Citizen RFID scanned on HF Reader

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:11:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_HF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 3 — Citizen RFID with Driver Remarks

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:12:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=O&errCode=R0L0G0D0C0
```

---

# ❌ Test 4 — Driver RFID with Empty Remarks

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=6667889028&iotTimestamp=2026-07-23T12:13:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=9.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_HF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 5 — Unknown Citizen RFID

**Expected:** `404 RFID not registered`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E2004706009060260843010C&iotTimestamp=2026-07-23T12:14:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=6.0&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 6 — Invalid Unit Number

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:15:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_02_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 7 — Missing RFID

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=&iotTimestamp=2026-07-23T12:16:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 8 — Missing Vehicle ID

**Expected:** `400 Missing required telemetry fields`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:17:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 9 — Missing IoT Timestamp

**Expected:** `400 Missing required telemetry fields`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 10 — Invalid Remarks

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E200470600106026083B0113&iotTimestamp=2026-07-23T12:18:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=X&errCode=R0L0G0D0C0
```

---

# ❌ Test 11 — Lowercase UHF RFID

**Expected:** `400 Bad Request` *(with your current `startsWith("E")` logic)*

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=e200470600106026083B0113&iotTimestamp=2026-07-23T12:19:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=5.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_UHF&remarks=&errCode=R0L0G0D0C0
```

---

# ❌ Test 12 — Driver RFID Starting with 'E'

**Expected:** `400 Bad Request`

```text
https://sewac-main.onrender.com/api/iot/telemetry/record?rfidNumber=E6667889028&iotTimestamp=2026-07-23T12:20:00Z&driverName=Ramesh&vehicleNumber=KA01AB1234&vehicleId=VH001&latitude=12.9716&longitude=77.5946&weight=9.5&firmwareVersion=v1.0.0&unitNumber=SEWAC_01_HF&remarks=O&errCode=R0L0G0D0C0
```

---


This gives you a complete suite of **15 test URLs (3 positive + 12 negative)** that exercise all of the major validation paths in your updated controller and worker logic.
