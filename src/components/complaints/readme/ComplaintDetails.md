# ComplaintDetails Component Documentation

## 1. File Overview

**File:** `ComplaintDetails.jsx`  
**Location:** `src/components/complaints/ComplaintDetails.jsx`

`ComplaintDetails` displays the selected complaint's detailed information and provides the administrator with complaint update and citizen-verification actions.

It is the main detail/interaction panel used after a complaint is selected from `ComplaintTable`.

---

## 2. Props

The component accepts:

```jsx
<ComplaintDetails
  complaint={selectedComplaint}
  requestingOTP={requestingOTP}
  onClose={...}
  onRequestVerification={...}
  onVerifyOTP={...}
  onSaveChanges={...}
  saving={savingComplaint}
  otpExpired={otpExpired}
  otpExpiresAt={otpExpiresAt}
/>
```

| Prop | Purpose |
|---|---|
| `complaint` | Selected complaint |
| `requestingOTP` | Indicates an OTP request is running |
| `onClose` | Closes the details panel |
| `onRequestVerification` | Requests/resends verification OTP |
| `onVerifyOTP` | Verifies entered OTP |
| `onSaveChanges` | Saves complaint status/remarks |
| `saving` | Indicates complaint update is running |
| `otpExpired` | Parent-calculated OTP expiry state |
| `otpExpiresAt` | OTP expiry timestamp |

---

## 3. Local State

The component maintains:

```text
otp
status
remarks
otpRequested
localOtpExpired
remainingSeconds
```

### `otp`

Stores the entered verification OTP.

### `status`

Stores the editable complaint status.

### `remarks`

Stores administrator remarks.

### `otpRequested`

Tracks whether OTP has been requested.

### `localOtpExpired`

Tracks OTP expiry locally.

### `remainingSeconds`

Stores the remaining OTP time for the countdown display.

---

## 4. Synchronizing Complaint Data

When the selected complaint changes, the component resets and loads:

```text
status
remarks
otp
otpRequested
```

The initial status is:

```text
complaint.status
```

or:

```text
PENDING
```

The remarks are loaded from:

```text
complaint.remarks
```

OTP input is cleared whenever the selected complaint changes.

---

## 5. OTP Expiry Timer

When:

```text
complaint.status === OTP_SENT
```

and an expiry timestamp exists, the component calculates the remaining time.

A one-second interval updates:

```text
remainingSeconds
```

until the OTP expires.

The interval is cleaned up when the component is unmounted or the relevant values change.

---

## 6. Effective OTP Expiry

The component combines parent and local expiry:

```js
const effectiveOtpExpired =
  otpExpired || localOtpExpired;
```

This means the OTP is treated as expired if either the parent or local timer reports expiry.

---

## 7. Complaint Status Flags

The component recognizes:

```text
PENDING
READY_FOR_VERIFICATION
OTP_SENT
CLOSED
```

These determine which controls are available.

---

## 8. Active OTP

An OTP is considered usable only when:

```text
status = OTP_SENT
AND
OTP has not expired
```

This is represented by:

```js
hasActiveOtp
```

---

## 9. OTP Request Availability

OTP can be requested when:

```text
READY_FOR_VERIFICATION
```

or:

```text
OTP_SENT + expired
```

This allows OTP resend after expiry.

---

## 10. Status Options

The administrator can select:

```text
PENDING
READY_FOR_VERIFICATION
```

The available status options are localized using the language context.

When the complaint is already beyond the editable Pending state, the current status is preserved during save.

---

## 11. Save Changes

The `handleSave` function sends:

```js
{
  status: nextStatus,
  remarks: remarks || null
}
```

through:

```js
onSaveChanges()
```

The parent page performs the actual API request.

---

## 12. OTP Input

OTP input is sanitized with:

```js
event.target.value
  .replace(/\D/g, "")
  .slice(0, 6)
```

Therefore:

```text
Only digits are accepted.
Maximum length = 6 digits.
```

---

## 13. Request / Resend OTP

`handleRequestOTP`:

1. Prevents another request while `requestingOTP` is true.
2. Clears the old OTP.
3. Calls `onRequestVerification`.
4. Marks OTP as requested.
5. Resets the local expired state.

The parent handles the backend request and expiry timestamp.

---

## 14. Status Badge

The status badge changes color according to the current state.

### Pending

```text
Yellow
```

### Ready for Verification

```text
Blue
```

### OTP Sent

```text
Purple
```

### OTP Expired

```text
Red
```

### Closed

```text
Green
```

---

## 15. Status Label

The component displays localized status labels for:

```text
Pending
Ready for Verification
OTP Sent
Closed
```

When OTP has expired, the label becomes:

```text
OTP Expired
```

---

## 16. Empty State

When no complaint is selected, the component displays:

```text
Select a complaint
```

and:

```text
Select a complaint from the table to view its details.
```

This prevents the detail panel from appearing blank.

---

## 17. Complaint Information

The detail panel displays information including:

```text
Ticket Number
Status
Title
Description
Citizen information
Phone
Location
Coordinates
Complaint image
Remarks
```

The component uses Lucide icons such as:

```text
Tag
FolderOpen
Phone
MapPin
Map
Image
Expand
FileText
ClipboardList
```

---

## 18. Complaint Image

When:

```text
complaint.image_url
```

exists, the image is displayed.

If an image is not available, the component provides the appropriate no-image state.

---

## 19. Save / Verification Responsibility

`ComplaintDetails` does not directly call the complaints backend.

Instead, it delegates operations through:

```text
onSaveChanges
onRequestVerification
onVerifyOTP
```

This keeps API operations inside `Complaints.jsx`.

---

## 20. Data Flow

```text
ComplaintTable
      ↓
Selected Complaint
      ↓
ComplaintDetails
      ├── View complaint information
      ├── Edit status / remarks
      ├── Request OTP
      ├── Enter OTP
      └── Verify OTP
      ↓
Parent Callbacks
      ↓
Complaints.jsx
      ↓
Backend APIs
```

---

## 21. Summary

`ComplaintDetails.jsx` is the interactive detail panel for a selected complaint.

It manages the local form and OTP UI state, displays complaint information, tracks OTP expiry, and delegates saving, OTP requesting, and OTP verification to the parent page.
