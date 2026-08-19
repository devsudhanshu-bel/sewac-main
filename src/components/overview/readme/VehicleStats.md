# VehicleStats Component Documentation

## 1. Component Overview

### Component Name

`VehicleStats`

### File Location

```text
src/components/overview/VehicleStats.jsx
```

### Purpose

The `VehicleStats` component provides detailed vehicle fleet information and a ward-wise waste generation trend for the SEWAC Overview dashboard.

The component is divided into two major sections:

1. **Vehicle Fleet Status**
2. **Generation Trend**

The left section provides a numerical summary of the vehicle fleet, while the right section visualizes waste generation across different wards using a line chart.

---

# 2. Responsibilities

The `VehicleStats` component is responsible for:

* Displaying total registered vehicles.
* Displaying currently running vehicles.
* Displaying inactive/not-running vehicles.
* Calculating running vehicle percentage.
* Calculating inactive vehicle percentage.
* Receiving ward-wise waste generation data.
* Converting waste generation from kilograms to tons.
* Preparing data for the Recharts line chart.
* Displaying ward-wise waste generation.
* Displaying custom chart tooltips.
* Displaying vertical reference stems from the X-axis to each data point.
* Animating the section and cards using GSAP.
* Handling missing vehicle and trend data safely.

The component itself does **not fetch data from the backend**.

The required data is passed from the parent component through props.

---

# 3. Component Interface

The component receives two props:

```jsx
<VehicleStats
  vehicleData={vehicleData}
  trendData={trendData}
/>
```

---

# 4. `vehicleData` Prop

`vehicleData` contains information about the complete vehicle fleet.

Expected structure:

```js
{
  totalVehicles: number,
  runningVehicles: number,
  inactiveVehicles: number
}
```

### Fields

| Field              | Description                             |
| ------------------ | --------------------------------------- |
| `totalVehicles`    | Total number of registered vehicles     |
| `runningVehicles`  | Number of vehicles currently running    |
| `inactiveVehicles` | Number of vehicles that are not running |

---

# 5. Vehicle Fleet Status

The left-hand card is titled:

```text
VEHICLE FLEET STATUS
```

It also displays:

```text
(All Vehicles Included)
```

This section contains three statistic cards.

---

## 5.1 Total Registered Vehicles

Displays the complete number of vehicles registered in the system.

The value comes from:

```js
vehicleData.totalVehicles
```

It is converted to a number and formatted using:

```js
Number(vehicleData.totalVehicles).toLocaleString()
```

Example:

```text
2500
↓
2,500
```

The statistic uses:

```text
Violet
```

for its icon and background.

---

# 6. Running Vehicles

The second vehicle statistic displays the number of vehicles currently running.

The value comes from:

```js
vehicleData.runningVehicles
```

It is displayed together with its percentage of the total registered fleet.

The percentage is calculated using:

```text
Running Vehicle Percentage =
(Running Vehicles / Total Vehicles) × 100
```

Implementation:

```js
vehicleData.totalVehicles > 0
  ? (
      (vehicleData.runningVehicles /
        vehicleData.totalVehicles) *
      100
    ).toFixed(1)
  : "(0%)"
```

The percentage is displayed with one decimal place.

Example:

```text
Total Vehicles = 100
Running Vehicles = 80

Running Percentage =
(80 / 100) × 100

= 80.0%
```

The running vehicle statistic uses green styling.

---

# 7. Not Running Vehicles

The third vehicle statistic displays the number of inactive vehicles.

The value comes from:

```js
vehicleData.inactiveVehicles
```

The percentage is calculated using:

```text
Inactive Vehicle Percentage =
(Inactive Vehicles / Total Vehicles) × 100
```

Example:

```text
Total Vehicles = 100
Inactive Vehicles = 20

Inactive Percentage =
(20 / 100) × 100

= 20.0%
```

The inactive vehicle statistic uses red styling.

---

# 8. Division-by-Zero Protection

Both running and inactive vehicle percentages check whether:

```js
vehicleData.totalVehicles > 0
```

before performing the calculation.

If there are no registered vehicles, the percentage displayed is:

```text
(0%)
```

This prevents invalid mathematical results such as:

```text
NaN%
Infinity%
```

---

# 9. Vehicle Statistics Data Structure

The component converts the raw `vehicleData` object into a `vehicleStats` array.

The resulting structure is conceptually:

```js
[
  {
    title: "Total Registered Vehicles",
    value: "...",
    color: "...",
    bg: "..."
  },
  {
    title: "Running Vehicles",
    value: "...",
    percentage: "...",
    color: "...",
    bg: "..."
  },
  {
    title: "Not Running Vehicles",
    value: "...",
    percentage: "...",
    color: "...",
    bg: "..."
  }
]
```

This allows the UI to render all three statistics using:

```js
vehicleStats.map(...)
```

rather than repeating the same JSX structure manually.

---

# 10. `trendData` Prop

`trendData` contains ward-wise waste generation information.

Expected structure:

```js
[
  {
    wardNo: number,
    wardName: string,
    wasteGenerated: number
  }
]
```

The backend value:

```text
wasteGenerated
```

is expected to be in kilograms.

---

# 11. Chart Data Transformation

Before the data is passed to Recharts, the component transforms every trend record.

The original backend value:

```text
wasteGenerated
```

is stored as:

```js
wasteKg
```

and converted into:

```js
wasteTons
```

using:

```text
Waste Tons = Waste KG / 1000
```

Implementation:

```js
const chartData =
  trendData?.map((item) => ({
    ward: item.wardName || `Ward ${item.wardNo}`,

    wardNo: item.wardNo,

    fullName: item.wardName || `Ward ${item.wardNo}`,

    wasteKg: Number(item.wasteGenerated) || 0,

    wasteTons:
      (Number(item.wasteGenerated) || 0) / 1000,
  })) || [];
```

---

# 12. Why Both KG and Tons Are Stored

The transformed chart object stores both:

```js
wasteKg
```

and:

```js
wasteTons
```

This preserves the original backend value while also providing the converted value required by the chart.

Example:

```js
{
  ward: "Ward 12",
  wardNo: 12,
  fullName: "Ward 12",
  wasteKg: 2500,
  wasteTons: 2.5
}
```

The graph uses:

```text
wasteTons
```

as its numerical data value.

---

# 13. Ward Name Handling

The component supports both named and unnamed wards.

If:

```js
item.wardName
```

exists, it is used.

Otherwise, the component creates a fallback label:

```js
`Ward ${item.wardNo}`
```

Example:

```text
wardName = "Hebbal"
```

results in:

```text
Hebbal
```

If the ward name is missing and:

```text
wardNo = 8
```

the displayed label becomes:

```text
Ward 8
```

This prevents empty ward labels in the chart.

---

# 14. Generation Trend Chart

The right-hand section is titled:

```text
GENERATION TREND
```

It displays ward-wise waste generation using a Recharts line chart.

The chart is wrapped in:

```jsx
<ResponsiveContainer>
```

so that the chart can adapt to the available container dimensions.

---

# 15. Chart Components

The component imports the following Recharts components:

```js
ResponsiveContainer
LineChart
Line
XAxis
YAxis
CartesianGrid
Tooltip
ReferenceLine
```

Each component has a specific role.

| Component             | Purpose                         |
| --------------------- | ------------------------------- |
| `ResponsiveContainer` | Makes chart responsive          |
| `LineChart`           | Main chart container            |
| `Line`                | Displays waste generation trend |
| `XAxis`               | Displays wards                  |
| `YAxis`               | Displays waste generation       |
| `CartesianGrid`       | Adds horizontal grid lines      |
| `Tooltip`             | Displays details when hovering  |
| `ReferenceLine`       | Creates vertical stems          |

---

# 16. X-Axis

The X-axis represents:

```text
Wards
```

The chart uses:

```js
dataKey="ward"
```

Therefore, the ward name is displayed on the X-axis.

The X-axis label is:

```text
Wards
```

Ward labels are rotated by:

```text
-25 degrees
```

This helps improve readability when multiple wards are displayed.

---

# 17. Y-Axis

The Y-axis represents waste generation.

Its label is:

```text
Waste Generated (tons)
```

The chart uses:

```js
dataKey="wasteTons"
```

Therefore, all plotted values are in tons rather than kilograms.

Decimal values are allowed:

```js
allowDecimals={true}
```

---

# 18. Line Chart

The actual trend line is created using:

```jsx
<Line
  type="monotone"
  dataKey="wasteTons"
  ...
/>
```

### Line Characteristics

The line:

* Uses a monotone curve.
* Uses `wasteTons` as its data.
* Has a width of 3 pixels.
* Displays circular data points.
* Has larger active points when hovered.
* Connects available data points.
* Uses chart animation.

---

# 19. Data Points

Normal points use:

```text
Radius: 5
```

Active points use:

```text
Radius: 7
```

When the user moves the cursor over a point, the active point becomes larger.

This provides visual feedback and makes the selected ward easier to identify.

---

# 20. Chart Animation

The line chart uses Recharts animation.

The relevant settings are:

```js
isAnimationActive
animationDuration={900}
```

Therefore, the chart line is animated when it is initially rendered.

---

# 21. Vertical Stems

An important visual feature of the chart is the vertical dotted stem beneath every data point.

The component creates a `ReferenceLine` for each ward:

```js
chartData.map((item) => (
  <ReferenceLine
    ...
  />
))
```

Each stem starts at:

```text
X = ward
Y = 0
```

and ends at:

```text
X = ward
Y = wasteTons
```

Conceptually:

```text
        ●  Data point
        │
        │
        │  Waste generated
        │
        ⋮
        ⋮
────────┴──────── X-axis
       Ward
```

This makes it easier to visually connect a plotted point with its corresponding ward.

---

# 22. Custom Tooltip

The component defines its own tooltip:

```js
const CustomTooltip = ({ active, payload }) => {
  ...
};
```

The tooltip is displayed only when:

```text
active = true
```

and valid chart payload data exists.

If the tooltip does not have valid data, it returns:

```js
null
```

---

# 23. Tooltip Information

When hovering over a chart point, the tooltip displays:

```text
Ward Name

Waste Generated: X.XX tons
```

The value is taken from:

```js
point.wasteTons
```

and formatted with two decimal places.

Example:

```text
Ward 12

Waste Generated: 2.50 tons
```

For one ton, the component uses the singular form:

```text
1.00 ton
```

For other values, it uses:

```text
2.00 tons
```

---

# 24. Tooltip Safety

The tooltip performs several checks:

```js
if (!active || !payload || !payload.length) {
  return null;
}
```

It then retrieves:

```js
const point = payload[0]?.payload;
```

and verifies that the point exists.

This prevents the tooltip from attempting to access undefined chart data.

---

# 25. GSAP Animations

The component uses GSAP to animate the complete VehicleStats section.

The animation is created using:

```js
useEffect(() => {
  const tl = gsap.timeline(...);
  ...
}, []);
```

A GSAP timeline controls the sequence.

---

# 26. Animation Sequence

The animation occurs in the following order:

```text
VehicleStats section
        ↓
Left Vehicle Fleet card
        ↓
Right Generation Trend card
        ↓
Individual vehicle statistic cards
```

---

# 27. Section Animation

The complete section initially starts with:

```text
Opacity: 0
Y offset: 25px
```

It then moves into its normal position.

Duration:

```text
0.4 seconds
```

---

# 28. Vehicle Fleet Card Animation

The left card starts with:

```text
Opacity: 0
Y offset: 30px
Scale: 0.97
Blur: 8px
```

It animates into:

```text
Opacity: 1
Y: 0
Scale: 1
Blur: 0
```

Duration:

```text
0.7 seconds
```

---

# 29. Generation Trend Card Animation

The right chart card uses a similar animation.

Initial state:

```text
Opacity: 0
Y offset: 30px
Scale: 0.97
Blur: 8px
```

Final state:

```text
Opacity: 1
Y: 0
Scale: 1
Blur: 0
```

Duration:

```text
0.7 seconds
```

The timeline overlaps the animations so the cards appear smoothly rather than waiting for the previous animation to completely finish.

---

# 30. Vehicle Statistic Card Animation

The three vehicle statistic cards are animated using:

```js
statCardsRef.current
```

They use:

```text
Opacity: 0
Y offset: 18px
Scale: 0.95
```

with:

```text
Stagger: 0.08 seconds
Duration: 0.45 seconds
```

The `back.out(1.4)` easing gives the cards a slight responsive/pop-in effect.

---

# 31. DOM References

The component maintains references for four animation targets:

```js
const sectionRef = useRef(null);

const leftCardRef = useRef(null);

const rightCardRef = useRef(null);

const statCardsRef = useRef([]);
```

### References

| Ref            | Purpose                            |
| -------------- | ---------------------------------- |
| `sectionRef`   | Main VehicleStats section          |
| `leftCardRef`  | Vehicle Fleet Status card          |
| `rightCardRef` | Generation Trend card              |
| `statCardsRef` | Individual vehicle statistic cards |

---

# 32. Overall UI Layout

The component uses a two-column layout:

```text
┌─────────────────────────┬─────────────────────────────────────────────┐
│                         │                                             │
│   VEHICLE FLEET STATUS  │             GENERATION TREND               │
│                         │                                             │
│   ┌─────────────────┐   │                                             │
│   │ Total Registered│   │                 Line Chart                  │
│   │ Vehicles        │   │                                             │
│   └─────────────────┘   │                                             │
│                         │                                             │
│   ┌─────────────────┐   │      Ward-wise Waste Generation             │
│   │ Running Vehicles│   │                                             │
│   └─────────────────┘   │                                             │
│                         │                                             │
│   ┌─────────────────┐   │                                             │
│   │ Not Running     │   │                                             │
│   │ Vehicles        │   │                                             │
│   └─────────────────┘   │                                             │
│                         │                                             │
└─────────────────────────┴─────────────────────────────────────────────┘
```

The layout is implemented using:

```text
grid-cols-[0.7fr_1.3fr]
```

This gives the generation chart more horizontal space than the vehicle statistics card.

---

# 33. Vehicle Fleet Card Dimensions

The vehicle card uses:

```text
Height: 520px
Padding: 24px
Border radius: 24px
White background
Light border
Shadow
```

It is implemented as a flex column.

---

# 34. Generation Trend Card Dimensions

The chart card also uses:

```text
Height: 520px
Padding: 24px
Border radius: 24px
White background
Light border
Shadow
```

The chart itself occupies the remaining available vertical space.

---

# 35. Responsive Chart

The chart uses:

```jsx
<ResponsiveContainer width="100%" height="100%">
```

This allows Recharts to automatically adapt to the size of its parent container.

The chart is therefore not given a fixed pixel width.

---

# 36. Data Flow

The complete data flow is:

```text
Backend/API
     │
     ├─────────────── vehicleData
     │                     │
     │                     ↓
     │             Vehicle Statistics
     │                     │
     │          ┌──────────┼──────────┐
     │          ↓          ↓          ↓
     │       Total      Running     Inactive
     │                   + %          + %
     │
     └─────────────── trendData
                           │
                           ↓
                    Data Transformation
                           │
                    KG → Tons Conversion
                           │
                           ↓
                      chartData
                           │
                           ↓
                     Recharts
                           │
                           ↓
                 Ward Generation Chart
```

---

# 37. Example Data

An example `vehicleData` object:

```js
{
  totalVehicles: 100,
  runningVehicles: 75,
  inactiveVehicles: 25
}
```

The UI will display:

```text
Total Registered Vehicles
100

Running Vehicles
75 (75.0%)

Not Running Vehicles
25 (25.0%)
```

An example `trendData` array:

```js
[
  {
    wardNo: 1,
    wardName: "Hebbal",
    wasteGenerated: 2500
  },
  {
    wardNo: 2,
    wardName: "Nagawara",
    wasteGenerated: 1800
  }
]
```

The chart data becomes approximately:

```js
[
  {
    ward: "Hebbal",
    wardNo: 1,
    fullName: "Hebbal",
    wasteKg: 2500,
    wasteTons: 2.5
  },
  {
    ward: "Nagawara",
    wardNo: 2,
    fullName: "Nagawara",
    wasteKg: 1800,
    wasteTons: 1.8
  }
]
```

---

# 38. Missing Data Handling

### Missing `vehicleData`

If `vehicleData` is undefined or null:

```js
const vehicleStats = vehicleData ? [...] : [];
```

Therefore, the component does not attempt to access vehicle fields from an undefined object.

### Missing `trendData`

The component uses optional chaining:

```js
trendData?.map(...)
```

and falls back to:

```js
[]
```

Therefore:

```text
No trend data
     ↓
Empty chart data
     ↓
No JavaScript error
```

---

# 39. Numerical Safety

Waste generation is converted using:

```js
Number(item.wasteGenerated) || 0
```

This ensures that invalid or missing values fall back to zero.

For example:

```text
undefined → 0
null → 0
invalid numeric value → 0
```

The same approach is used when displaying vehicle counts.

---

# 40. External Libraries

The component uses three major libraries.

## React

Used for:

```js
useEffect
useRef
```

These provide:

* Component lifecycle handling.
* DOM references.
* Animation initialization.

---

## Lucide React

Used for the vehicle icon:

```js
Truck
```

The icon is used in:

* Vehicle Fleet Status heading.
* Total Registered Vehicles.
* Running Vehicles.
* Not Running Vehicles.

---

## GSAP

Used for:

* Section entrance animation.
* Card entrance animation.
* Staggered statistic card animation.
* Blur and scale effects.

---

## Recharts

Used for:

* Line chart.
* Responsive chart container.
* X-axis.
* Y-axis.
* Tooltip.
* Grid.
* Vertical reference stems.

---

# 41. Styling

The component uses Tailwind CSS utility classes.

Major styling properties include:

```text
White cards
Rounded corners
Light borders
Subtle shadows
Violet accents
Green running status
Red inactive status
Responsive chart container
```

The component does not use a separate CSS file.

---

# 42. Important Implementation Notes

* `vehicleData` and `trendData` are supplied through props.
* The component does not perform API calls.
* Vehicle percentages are calculated relative to total registered vehicles.
* Division by zero is prevented.
* Waste generation received from the backend is treated as KG.
* Chart values are converted from KG to tons.
* Both original KG and converted tons are retained in `chartData`.
* Ward names fall back to `Ward <wardNo>` if a name is unavailable.
* The Y-axis represents waste in tons.
* The X-axis represents wards.
* The chart uses a monotone line.
* Each chart point has a vertical dotted stem to the X-axis.
* A custom tooltip provides ward and waste information.
* GSAP controls the entrance animations.
* Recharts controls chart rendering and chart animation.
* Tailwind CSS controls the component styling.
* Missing data is handled without directly throwing an error.

---

# 43. Component Dependencies

```text
VehicleStats.jsx
│
├── React
│   ├── useEffect
│   └── useRef
│
├── lucide-react
│   └── Truck
│
├── gsap
│   └── Animation timeline
│
└── recharts
    ├── ResponsiveContainer
    ├── LineChart
    ├── Line
    ├── XAxis
    ├── YAxis
    ├── CartesianGrid
    ├── Tooltip
    └── ReferenceLine
```

---

# 44. Functional Summary

The component combines fleet monitoring and waste generation analytics in one section.

### Fleet Monitoring

```text
Total Vehicles
       ↓
Running Vehicles
       ↓
Inactive Vehicles
       ↓
Running/Inactive Percentages
```

### Waste Analytics

```text
Ward-wise Waste Data
       ↓
Waste in KG
       ↓
Convert KG → Tons
       ↓
Prepare Chart Data
       ↓
Recharts Line Chart
       ↓
Interactive Tooltip
```

---

# 45. Overall Purpose in the Dashboard

`VehicleStats` provides a more detailed operational view after the high-level KPI section.

The Overview page can therefore be understood as:

```text
Overview Page
     │
     ├── OverviewKPIs
     │      ├── Total Waste Collected
     │      ├── Collection Points
     │      ├── Total Citizens
     │      └── Citizens Trend
     │
     └── VehicleStats
            ├── Vehicle Fleet Status
            │     ├── Total Vehicles
            │     ├── Running Vehicles
            │     └── Not Running Vehicles
            │
            └── Generation Trend
                  └── Ward-wise Waste Generation
```

The `OverviewKPIs` component provides the **high-level summary**, while `VehicleStats` provides **vehicle-level operational statistics and ward-wise waste generation analytics**.
