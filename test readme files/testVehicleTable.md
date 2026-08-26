# testVehicleTable.js Documentation

## 1. File Overview

This file tests vehicle telemetry table creation through:

```text
TableManager
```

---

# 2. Environment Initialization

The script loads:

```text
./src/config/loadEnv
```

to initialize the application environment.

---

# 3. Table Manager

It imports:

```text
./src/telemetry/managers/TableManager
```

as:

```text
tableManager
```

---

# 4. Vehicle Table Creation

The test calls:

```text
tableManager.ensureVehicleTable("KA01AB1234")
```

This tests the vehicle-table creation/ensure operation for the specified vehicle.

---

# 5. Success Handling

When the table operation succeeds, the script prints:

```text
Creating Vehicle Table...
SUCCESS
```

and outputs the returned table information.

---

# 6. Error Handling

If the operation throws an error, it is logged directly.

---

# 7. Cleanup

The script always terminates through:

```text
process.exit()
```

inside the `finally` block.

---

# 8. Execution Flow

```text
Load Environment
      ↓
Load TableManager
      ↓
ensureVehicleTable("KA01AB1234")
      ↓
SUCCESS / Error
      ↓
Exit
```

---

# 9. Summary

`testVehicleTable.js` is a focused test utility for verifying that the telemetry `TableManager` can ensure the required vehicle-specific table for a given vehicle number.
