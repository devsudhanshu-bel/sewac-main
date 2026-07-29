# Telemetry Queue Reliability & Failure Recovery

## Overview

The telemetry ingestion pipeline is designed to provide **high reliability**, **crash recovery**, and **asynchronous processing** using Redis as a persistent message queue.

```
IoT
    │
    ▼
LPUSH telemetry_queue
    │
    ▼
BLMOVE
telemetry_queue ─────► telemetry_processing_queue
                           │
                           ▼
                   Business Logic
                           │
             ┌─────────────┴─────────────┐
             │                           │
          Success                    Crash/Error
             │                           │
             ▼                           ▼
          LREM                 Remains in processing_queue
                                       │
                                       ▼
                              Next Server Startup
                                       │
                                       ▼
                                   LMOVE
                                       │
                                       ▼
                               telemetry_queue
```

---

# Packet Lifecycle

## Step 1 — IoT → Backend API

The IoT device sends a telemetry packet to the backend.

```
HTTP Request
        │
        ▼
Telemetry Controller
```

### Possible Failure

- Network interruption
- Server unavailable
- Request timeout

### Result

Packet **never reaches the backend**.

### Recovery

The IoT firmware should retry sending the same telemetry packet.

---

# Step 2 — API Validation

The backend validates:

- RFID
- Unit Number
- Remarks
- Mandatory fields

If validation succeeds:

```
LPUSH telemetry_queue
```

### Possible Failure

- Invalid payload
- Missing fields
- Invalid RFID

### Result

Packet is intentionally rejected.

### Recovery

IoT must resend a corrected payload.

---

# Step 3 — Redis Queue

```
LPUSH telemetry_queue
```

Once inserted,

the packet safely resides inside Redis.

### Server Crash

If the backend crashes here,

```
telemetry_queue
```

still contains the packet.

### Recovery

When the server restarts,

the worker resumes consuming the queue.

**Packet Lost?**

**No**

---

# Step 4 — Queue Processing

The worker performs

```
BLMOVE
```

which atomically moves

```
telemetry_queue
        │
        ▼
telemetry_processing_queue
```

Only one worker owns the packet.

### Why BLMOVE?

Unlike

```
BLPOP
```

which removes the packet,

BLMOVE guarantees that the packet is never in an undefined state.

**Packet Lost?**

**No**

---

# Step 5 — Business Logic

The worker executes

- Citizen lookup (HashMap)
- Weight classification
- Database insertion
- Vehicle telemetry update
- Incident detection
- Plant statistics update

### Possible Failure

- PostgreSQL unavailable
- Foreign key violation
- Business logic exception
- Application crash

### Result

The packet remains inside

```
telemetry_processing_queue
```

No acknowledgement is sent.

---

# Step 6 — Successful Processing

If every operation succeeds,

```
LREM telemetry_processing_queue
```

is executed.

The packet is permanently acknowledged.

```
processing_queue
        │
        ▼
Packet Removed
```

The lifecycle ends here.

---

# Step 7 — Server Crash During Processing

Suppose the backend crashes here:

```
BLMOVE
        │
        ▼
Business Logic
        │
        X
      Crash
```

Since

```
LREM
```

never executed,

the packet still exists inside

```
telemetry_processing_queue
```

Nothing is lost.

---

# Step 8 — Recovery After Restart

During application startup,

```
recoverProcessingQueue()
```

moves every pending packet back.

```
LMOVE

telemetry_processing_queue
                │
                ▼
        telemetry_queue
```

The worker processes it again.

This guarantees automatic crash recovery.

---

# Failure Analysis

| Stage | Failure | Packet Lost | Recovery |
|--------|----------|-------------|----------|
| IoT → API | Network Failure | ✅ Yes | IoT Retry |
| API Validation | Invalid Payload | ❌ Rejected | Fix Payload |
| Before LPUSH | Server Crash | ✅ Yes | IoT Retry |
| After LPUSH | Server Crash | ❌ No | Redis Queue |
| Waiting in Queue | Server Restart | ❌ No | Queue Persists |
| During BLMOVE | Crash | ❌ No | Packet in Processing Queue |
| Business Logic | Database Failure | ❌ No | Packet Retained |
| During Processing | Server Crash | ❌ No | Recovery Queue |
| After Successful Insert Before LREM | Crash | ⚠ Duplicate Possible | Replay on Restart |
| After LREM | Crash | ❌ No | Already Processed |

---

# Remaining Risks

## 1. IoT Retry Failure

If the packet never reaches Redis,

the backend cannot recover it.

Recovery depends entirely on the IoT firmware.

---

## 2. Redis Persistence Disabled

If Redis persistence (AOF/RDB) is disabled,

a Redis crash may erase queued packets.

Recommended:

- AOF Enabled
- Upstash Persistence Enabled

---

## 3. Redis Unavailable

If Redis itself is unavailable,

```
LPUSH
```

fails.

The backend returns an error.

IoT should retry.

---

## 4. Duplicate Processing

Scenario

```
Database Insert
        │
        ▼
Server Crash
        │
        ▼
LREM Never Executes
        │
        ▼
Packet Recovered
        │
        ▼
Database Insert Again
```

Result

- Duplicate telemetry record
- Duplicate cumulative weight

This is not packet loss,

but duplicate execution.

---

## 5. Partial Database Success

Example

```
Telemetry Insert      ✔

Vehicle Update        ✖

Plant Update          ✖
```

The packet stays inside

```
telemetry_processing_queue
```

After restart,

the entire packet executes again.

This may duplicate successful operations unless database transactions or idempotency are implemented.

---

# Current Reliability

| Scenario | Status |
|-----------|--------|
| Server Restart | ✅ Safe |
| Worker Crash | ✅ Safe |
| Backend Crash | ✅ Safe |
| Database Failure | ✅ Safe |
| Redis Queue Recovery | ✅ Safe |
| Queue Corruption | Extremely Unlikely |
| Duplicate Processing | ⚠ Possible |
| IoT Transmission Failure | Depends on Device Retry |

---

# Overall Assessment

The telemetry architecture provides:

- ✅ Asynchronous ingestion using Redis
- ✅ Crash-safe queue processing
- ✅ Automatic recovery after server restart
- ✅ Zero packet loss once queued in Redis
- ✅ HashMap-based citizen lookup for O(1) RFID resolution
- ✅ Atomic queue transfer using `BLMOVE`
- ✅ Reliable acknowledgement using `LREM`

The only remaining improvement is implementing **idempotent processing** (or wrapping database operations in a single transaction) to eliminate duplicate processing after a crash occurring between successful database writes and queue acknowledgement.

Overall reliability of the current telemetry pipeline is approximately **9.5/10**, making it well suited for production-grade IoT telemetry ingestion.