# ComplaintKPIs Component Documentation

## 1. File Overview

**File:** `ComplaintKPIs.jsx`  
**Location:** `src/components/complaints/ComplaintKPIs.jsx`

`ComplaintKPIs` displays the four main complaint statistics at the top of the Complaints page.

---

## 2. Prop

The component receives:

```jsx
<ComplaintKPIs kpis={kpis} />
```

The default value is:

```js
{}
```

Expected KPI fields are:

```text
total
pending
readyForVerification
closed
```

---

## 3. KPI Cards

The component renders four `ComplaintCard` instances.

### Total Complaints

Field:

```text
kpis.total
```

Color:

```text
purple
```

Subtitle:

```text
All complaints
```

### Pending

Field:

```text
kpis.pending
```

Color:

```text
yellow
```

### Ready for Verification

Field:

```text
kpis.readyForVerification
```

Color:

```text
blue
```

### Closed

Field:

```text
kpis.closed
```

Color:

```text
green
```

Subtitle:

```text
Citizen verified
```

---

## 4. Safe Defaults

Each KPI uses nullish fallback:

```js
kpis.total ?? 0
kpis.pending ?? 0
kpis.readyForVerification ?? 0
kpis.closed ?? 0
```

Therefore missing KPI values are displayed as:

```text
0
```

---

## 5. Icons

The cards use:

```text
MessageCircleMore
Clock3
ShieldCheck
Check
```

from `lucide-react`.

---

## 6. Layout

The KPI section is responsive:

```text
Mobile       → 1 column
Small screen → 2 columns
XL screen    → 4 columns
```

---

## 7. API Responsibility

`ComplaintKPIs` does not call the backend.

The parent page retrieves KPI information from:

```text
GET /api/complaints/kpis
```

and passes the resulting object through:

```text
kpis
```

---

## 8. Data Flow

```text
GET /api/complaints/kpis
          ↓
      Complaints.jsx
          ↓
        kpis
          ↓
    ComplaintKPIs
          ↓
   ComplaintCard × 4
```

---

## 9. Summary

`ComplaintKPIs.jsx` is the KPI container for the Complaints dashboard. It converts the parent KPI object into four reusable `ComplaintCard` components representing total, pending, ready-for-verification, and closed complaints.
