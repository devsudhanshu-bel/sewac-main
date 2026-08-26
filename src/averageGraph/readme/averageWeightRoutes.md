# averageWeightRoutes.js Documentation

## 1. File Overview

The Average Weight Routes module defines the Express route for the average-weight graph.

It uses:

```text
Express Router
```

and connects the route to:

```text
getAverageWeightGraph
```

---

# 2. Router

A new Express router is created using:

```text
express.Router()
```

---

# 3. Average Weight Endpoint

The route is:

```text
GET /
```

within the router.

When mounted under:

```text
/api/average-weight
```

the resulting endpoint is:

```text
GET /api/average-weight
```

---

# 4. Query Parameter

The endpoint requires:

```text
date
```

Example:

```text
/api/average-weight?date=2026-08-23
```

---

# 5. Controller Delegation

The route delegates directly to:

```text
getAverageWeightGraph
```

No business logic is implemented inside the route file.

---

# 6. Request Flow

```text
GET /api/average-weight?date=YYYY-MM-DD
             ↓
averageWeightRoutes
             ↓
getAverageWeightGraph
             ↓
averageWeightService
```

---

# 7. Export

The module exports:

```text
router
```

---

# 8. Summary

`averageWeightRoutes.js` defines the Express GET endpoint for average-weight graph data. It accepts the `date` query parameter and delegates request handling to `getAverageWeightGraph`.
