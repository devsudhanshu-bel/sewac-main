# Frontend Translation Usage Documentation

## 1. Files Using the Language Context

The uploaded frontend source contains translation-aware code in the following areas:

### Complaints

```text
components/complaints/ComplaintDetails.jsx
components/complaints/ComplaintFilters.jsx
components/complaints/ComplaintHeader.jsx
components/complaints/ComplaintKPIs.jsx
components/complaints/ComplaintTable.jsx
pages/Complaints.jsx
```

### Layout

```text
components/layouts/Header.jsx
components/layouts/Sidebar.jsx
```

### Overview

```text
components/overview/CityOverviewMap.jsx
components/overview/CustomerGrev.jsx
components/overview/GVPOverviewMap.jsx
components/overview/OverviewKPIs.jsx
components/overview/VehicleStats.jsx
```

### Plants

```text
components/plants/CreatePlantModal.jsx
components/plants/DeletePlantModal.jsx
components/plants/EditPlantModal.jsx
components/plants/PlantDirectory.jsx
components/plants/PlantKPICards.jsx
components/plants/Plants.jsx
pages/Plants.jsx
```

### Users

```text
components/users/AddUserModal.jsx
components/users/AdminUsers.jsx
components/users/ContractorUsers.jsx
components/users/DeleteUserModal.jsx
components/users/EditUserModal.jsx
components/users/UserSection.jsx
components/users/UserTable.jsx
pages/Users.jsx
```

### Vehicles

```text
components/vehicles/AverageWeightChart.jsx
components/vehicles/CreateVehicleModal.jsx
components/vehicles/DeleteVehicleModal.jsx
components/vehicles/EditVehicleModal.jsx
components/vehicles/KPICards.jsx
components/vehicles/TelemetryDirectory.jsx
```

### Waste Generators

```text
components/waste-generators/GVPGen.jsx
components/waste-generators/WasteGenDir.jsx
components/waste-generators/WasteGenKPIs.jsx
components/waste-generators/WasteGenMap.jsx
pages/WasteGenerators.jsx
```

### Core i18n

```text
i18n/LanguageContext.jsx
i18n/index.js
main.jsx
```

---

## 2. Standard Component Pattern

Translation-aware components generally use:

```js
import { useLanguage } from "../../i18n";

const { t } = useLanguage();
```

Then request strings with:

```js
t("feature.key", "Fallback text")
```

---

## 3. Translation Data Flow

```text
Translation file
       ↓
LanguageContext
       ↓
LanguageProvider
       ↓
useLanguage()
       ↓
Component
       ↓
t("key")
       ↓
Visible UI text
```

---

## 4. Adding New Text

When adding user-facing text to a translation-aware component:

1. Add the key to `en.js`.
2. Add the corresponding key to `hi.js`.
3. Add the corresponding key to `kn.js`.
4. Use `t("path.to.key")` in the component.
5. Use a fallback where appropriate.

Keep the nested structure consistent between the three dictionaries.
