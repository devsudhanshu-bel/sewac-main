# ComplaintCard Component Documentation

## 1. File Overview

**File:** `ComplaintCard.jsx`  
**Location:** `src/components/complaints/ComplaintCard.jsx`

`ComplaintCard` is the reusable KPI card component used by the Complaints dashboard.

It provides a consistent visual structure for displaying a complaint metric with an icon, title, value, optional subtitle, and color theme.

---

## 2. Props

```jsx
<ComplaintCard
  icon={...}
  title="..."
  value={...}
  subtitle="..."
  color="purple"
/>
```

| Prop | Purpose |
|---|---|
| `icon` | Icon displayed inside the KPI icon container |
| `title` | KPI title |
| `value` | Main numerical/value display |
| `subtitle` | Optional supporting text |
| `color` | Selects the card color theme |

The default color is:

```text
purple
```

---

## 3. Color Themes

The component defines four themes:

```text
purple
yellow
blue
green
```

Each theme controls:

```text
Background
Icon color
Accent/subtitle color
```

### Purple

Used for the Total Complaints KPI.

### Yellow

Used for Pending complaints.

### Blue

Used for Ready for Verification.

### Green

Used for Closed complaints.

If an unsupported color is supplied, the component falls back to:

```text
purple
```

---

## 4. Layout

The card contains:

```text
Icon
  ↓
Title
  ↓
Value
  ↓
Subtitle
```

The component is responsive and changes sizing at different breakpoints.

---

## 5. Icon Rendering

The icon is supplied by the parent component.

`ComplaintCard` does not select the icon itself.

For example:

```jsx
<ComplaintCard
  icon={<MessageCircleMore />}
/>
```

The icon receives theme-specific coloring through the surrounding icon container.

---

## 6. Value Display

The main value is rendered with a large bold style.

This is suitable for:

```text
Total complaints
Pending complaints
Ready for Verification
Closed complaints
```

---

## 7. Subtitle

The subtitle is optional.

When supplied, it is rendered below the value.

Examples:

```text
All complaints
Citizen verified
```

---

## 8. Responsibilities

`ComplaintCard` is responsible only for presentation.

It does not:

```text
Fetch API data
Calculate complaint KPIs
Manage complaint state
Handle complaint actions
```

The parent `ComplaintKPIs` component supplies the values.

---

## 9. Data Flow

```text
Complaints.jsx
      ↓
ComplaintKPIs
      ↓
ComplaintCard
      ↓
Icon + Title + Value + Subtitle
```

---

## 10. Summary

`ComplaintCard.jsx` is the reusable visual building block for the Complaints KPI section. Its color themes and responsive layout allow the same component to be reused for different complaint statuses.
