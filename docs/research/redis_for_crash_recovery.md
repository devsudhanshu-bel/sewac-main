Perfect. Let's visualize a realistic scenario with **multiple successful packets + multiple failed packets**, because that's exactly how your Redis queue behaves.

---

# Initial State

Suppose five IoT devices send packets almost simultaneously.

```
P1 -> vehicleId = 09              ❌ Invalid
P2 -> vehicleId = KA01AB1234      ✅ Valid
P3 -> vehicleId = KA01AB1237      ✅ Valid
P4 -> vehicleId = 99              ❌ Invalid
P5 -> vehicleId = KA05AB9999      ✅ Valid
```

All requests first reach your controller.

```
IoT Devices
      │
      ▼
Telemetry Controller
      │
      ▼
LPUSH telemetry_queue
```

Redis now contains

```
telemetry_queue

┌─────────────┐
│ P1 (09)     │ ❌
├─────────────┤
│ P2          │ ✅
├─────────────┤
│ P3          │ ✅
├─────────────┤
│ P4 (99)     │ ❌
├─────────────┤
│ P5          │ ✅
└─────────────┘

processing_queue

(empty)
```

---

# Worker Iteration 1

Worker calls

```
BLMOVE()
```

Redis moves ONLY ONE packet.

```
telemetry_queue

P2
P3
P4
P5

processing_queue

P1
```

Worker memory

```
packet = P1
```

Business Logic

```
Citizen lookup
↓

Telemetry insert
↓

Vehicle Telemetry

↓

FK ERROR

(vehicleId=09)
```

Failure.

No LREM.

Queues become

```
telemetry_queue

P2
P3
P4
P5

processing_queue

P1 ❌
```

Notice

P1 simply remains.

---

# Worker Iteration 2

Worker loops again.

Calls

```
BLMOVE()
```

Redis looks ONLY at telemetry_queue.

Moves

```
P2
```

Queues

```
telemetry_queue

P3
P4
P5

processing_queue

P1 ❌
P2
```

Worker memory

```
packet=P2
```

Business Logic

```
Citizen lookup

↓

Telemetry insert

↓

Vehicle telemetry

↓

Plant

↓

Success
```

Now

```
LREM(P2)
```

Queues become

```
telemetry_queue

P3
P4
P5

processing_queue

P1 ❌
```

P2 disappears.

---

# Worker Iteration 3

BLMOVE()

Moves

```
P3
```

Queues

```
telemetry_queue

P4
P5

processing_queue

P1 ❌
P3
```

Worker

```
packet=P3
```

Success

↓

LREM(P3)

Queues

```
telemetry_queue

P4
P5

processing_queue

P1 ❌
```

---

# Worker Iteration 4

BLMOVE()

Moves

```
P4
```

Queues

```
telemetry_queue

P5

processing_queue

P1 ❌
P4 ❌
```

Worker

```
packet=P4
```

Fails

```
vehicleId=99
```

No LREM.

Queues

```
telemetry_queue

P5

processing_queue

P1 ❌
P4 ❌
```

---

# Worker Iteration 5

BLMOVE()

Moves

```
P5
```

Queues

```
telemetry_queue

(empty)

processing_queue

P1 ❌
P4 ❌
P5
```

Worker

```
packet=P5
```

Success

↓

LREM(P5)

Queues

```
telemetry_queue

(empty)

processing_queue

P1 ❌
P4 ❌
```

---

# Final State Before Crash

```
telemetry_queue

(empty)
```

```
processing_queue

P1 ❌
P4 ❌
```

Only the failed packets remain.

All successful packets have already been removed.

---

# Server Crashes

Redis is still alive.

```
processing_queue

P1 ❌
P4 ❌
```

---

# Server Restarts

Immediately

```
recoverProcessingQueue()
```

runs.

It performs

```
processing_queue
        │
        ▼
telemetry_queue
```

Result

```
telemetry_queue

P1 ❌
P4 ❌
```

```
processing_queue

(empty)
```

---

# Worker Starts Again

Iteration 1

Moves

```
P1
```

Fails again.

```
telemetry_queue

P4

processing_queue

P1 ❌
```

---

Iteration 2

Moves

```
P4
```

Fails again.

```
telemetry_queue

(empty)

processing_queue

P1 ❌
P4 ❌
```

---

# Meanwhile...

A brand new IoT packet arrives.

```
P6
```

Controller

```
LPUSH telemetry_queue
```

Queues

```
telemetry_queue

P6 ✅
```

```
processing_queue

P1 ❌
P4 ❌
```

---

Worker loops again.

Calls

```
BLMOVE()
```

Redis moves

```
P6
```

Queues

```
telemetry_queue

(empty)
```

```
processing_queue

P1 ❌
P4 ❌
P6
```

Worker memory

```
packet=P6
```

Processes it.

Success.

```
LREM(P6)
```

Queues become

```
processing_queue

P1 ❌
P4 ❌
```

---

# Entire Life Cycle

```text
                 Incoming IoT Packets
                        │
                        ▼
                telemetry_queue
     ┌─────────────────────────────────┐
     │ P1❌ P2✅ P3✅ P4❌ P5✅          │
     └─────────────────────────────────┘
                        │
                 Worker (BLMOVE)
                        ▼
              processing_queue
     ┌─────────────────────────────────┐
     │ P1❌                            │ ← stays (failed)
     │ P2✅ → processed → removed      │
     │ P3✅ → processed → removed      │
     │ P4❌ → stays (failed)           │
     │ P5✅ → processed → removed      │
     └─────────────────────────────────┘
                        │
                 Server crashes
                        ▼
     processing_queue still contains
          P1❌      P4❌
                        │
                recoverProcessingQueue()
                        ▼
                telemetry_queue
     ┌─────────────────────────────────┐
     │ P1❌      P4❌                   │
     └─────────────────────────────────┘
                        │
                 Worker retries
                        ▼
        P1 fails again → remains
        P4 fails again → remains
                        │
        New packet P6 arrives (valid)
                        ▼
                telemetry_queue
                    P6✅
                        │
                 Worker picks P6
                        ▼
                 Success → Removed

processing_queue finally contains

P1❌
P4❌
```

---

### This is exactly how your current implementation behaves.

* ✅ Successful packets are removed from `processing_queue` after processing.
* ❌ Failed packets remain in `processing_queue` so they are not lost.
* 🔄 On server restart, only those failed packets are moved back to `telemetry_queue` and retried.
* ➕ New valid packets continue to be accepted and processed normally—they are **not blocked** by the presence of failed packets.
