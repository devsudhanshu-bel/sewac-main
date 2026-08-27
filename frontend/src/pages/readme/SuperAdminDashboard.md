# SuperAdminDashboard(3).jsx Documentation

## 1. File Overview

The `SuperAdminDashboard` component provides the Super Admin administrator-management console.

It supports:

```text
Super Admin session validation
Administrator listing
Role counts
Administrator creation
Administrator deletion
Logout
```

## 2. Session Data

The component reads:

```text
superAdminToken
superAdmin
```

from:

```text
sessionStorage
```

The stored administrator JSON is parsed into:

```text
admin
```

## 3. Initial Authentication Check

When the component mounts, it verifies:

```text
token
admin
```

If either is missing, the user is redirected to:

```text
/super-admin
```

If both exist, the administrator list is loaded.

## 4. Fetch Administrators

`fetchAdmins()` sends:

```text
GET /api/super-admin/admins
```

with:

```text
Authorization: Bearer <superAdminToken>
```

If successful, the returned:

```text
admins
```

array is stored in component state.

## 5. Loading State

The administrator table displays:

```text
Loading Administrators...
```

while data is being retrieved.

## 6. Role Counts

The dashboard calculates:

```text
layer1Count
layer2Count
```

by filtering the administrator list.

### Admin Layer 1

```text
role === "ADMIN_LAYER_1"
```

### Admin Layer 2

```text
role === "ADMIN_LAYER_2"
```

## 7. Dashboard Metrics

Three metric cards display:

```text
Total Administrators
Admin Layer 1
Admin Layer 2
```

The total is:

```text
admins.length
```

## 8. Administrator Table

The table displays:

```text
#
Name
Email
Phone
Role
Created
Actions
```

Each administrator is rendered from the `admins` state array.

## 9. Role Display

Roles are formatted for display using:

```text
admin.role.replaceAll("_", " ")
```

Admin Layer 1 and Admin Layer 2 receive different Tailwind styling.

## 10. Creation Modal

Selecting:

```text
Create Administrator
```

sets:

```text
openCreateModal = true
```

and renders:

```text
CreateAdminModal
```

The modal receives:

```text
onClose
onSuccess
```

The success callback is:

```text
fetchAdmins
```

so the administrator table refreshes after creation.

## 11. Delete Administrator

The delete action asks for confirmation:

```text
Delete administrator?
```

If confirmed, the component sends:

```text
DELETE /api/super-admin/admins/:id
```

with:

```text
Authorization: Bearer <superAdminToken>
```

## 12. Successful Deletion

If deletion succeeds:

```text
fetchAdmins()
```

is called to refresh the table.

## 13. Delete Failure

If the backend reports failure, the component displays:

```text
data.message
```

or:

```text
Failed to delete administrator.
```

Network failures display:

```text
Server Error. Please try again.
```

## 14. Empty State

When no administrators exist, the table displays:

```text
No Administrators Found
```

and instructs the Super Admin to create the first administrator.

## 15. Logout

The logout function:

```text
sessionStorage.clear()
navigate("/super-admin")
```

This removes the stored session data and returns to the Super Admin login page.

## 16. UI Structure

```text
Super Admin Header
   ├── SUPER ADMIN
   └── Logout
        ↓
Welcome Card
        ↓
Metric Cards
   ├── Total Administrators
   ├── Admin Layer 1
   └── Admin Layer 2
        ↓
Administrators Table
        ↓
Create Administrator Modal
```

## 17. Styling

The component uses:

```text
Tailwind CSS
Lucide React
Oswald
Finlandica
```

Icons include:

```text
ShieldCheck
Users
UserPlus
LogOut
Trash2
```

## 18. Export

The component is exported as:

```text
export default SuperAdminDashboard
```

## 19. Summary

`SuperAdminDashboard(3).jsx` provides the Super Admin administrator-management interface. It validates the Super Admin session, retrieves and displays administrators, calculates role counts, launches the administrator-creation modal, supports administrator deletion, refreshes data after changes, and provides logout functionality.
