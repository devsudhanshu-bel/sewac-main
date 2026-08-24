# Complaints.jsx Page Documentation

## 1. File Overview

**File:** `Complaints.jsx`  
**Location:** `src/pages/Complaints.jsx`

`Complaints` is the main complaint-management page of the SEWAC admin frontend.

It coordinates:

```text
Complaint Header
Complaint Filters
Complaint KPIs
Complaint Table
Complaint Details
```

and communicates directly with the complaints backend APIs.

---

## 2. Main Components

The page imports:

```text
Header
ComplaintHeader
ComplaintKPIs
ComplaintFilters
ComplaintTable
ComplaintDetails
```

It also uses:

```text
useEffect
useRef
useState
useLanguage
```

---

## 3. Environment Configuration

The API base URL comes from:

```js
import.meta.env.VITE_API_BASE_URL
```

and is stored in:

```js
API_BASE_URL
```

---

## 4. Default Filters

The page initializes:

```js
{
  search: "",
  status: "",
  category: "",
  dateFrom: "",
  dateTo: "",
}
```

Supported filter values include:

```text
Search
Status
Category
Date From
Date To
```

---

## 5. Default Pagination

The initial pagination state is:

```js
{
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
}
```

The page requests 10 complaints per page.

---

## 6. Default KPIs

The initial KPI state is:

```js
{
  total: 0,
  pending: 0,
  readyForVerification: 0,
  otpSent: 0,
  closed: 0,
}
```

---

## 7. Main State

The page maintains:

```text
complaints
loading
error
kpis
selectedComplaint
savingComplaint
requestingOTP
otpExpiresAt
otpExpired
pagination
filters
```

It also uses refs for:

```text
OTP request locking
Search debounce timer
```

---

## 8. Admin Authentication

The page obtains the admin token from:

```js
sessionStorage.getItem("token")
```

Every complaints API request includes:

```http
Authorization: Bearer <token>
```

If no token exists, the page raises an authentication error.

---

## 9. Fetch Complaints

The page calls:

```text
GET /api/complaints
```

with query parameters:

```text
page
limit
search
status
category
dateFrom
dateTo
```

Optional filters are only added when they have values.

---

## 10. API Response Parsing

The helper:

```js
parseApiResponse()
```

checks the response content type.

### JSON response

If the response is JSON:

```js
response.json()
```

is used.

### Non-JSON response

The response is converted to text and returned as a structured object.

This prevents the page from failing when the backend returns a plain-text error.

---

## 11. Complaint List Update

After a successful complaint request:

```js
setComplaints(result.data?.items || []);
```

and:

```js
setPagination(
  result.data?.pagination ||
  DEFAULT_PAGINATION
);
```

---

## 12. Fetch Complaint KPIs

The page separately requests:

```text
GET /api/complaints/kpis
```

The returned KPI object is stored in:

```text
kpis
```

and passed to:

```jsx
<ComplaintKPIs kpis={kpis} />
```

---

## 13. Save Complaint Changes

The page updates a selected complaint using:

```text
PATCH /api/complaints/:ticketNumber
```

The request body contains:

```js
{
  status: updates.status,
  remarks: updates.remarks,
}
```

The ticket number is URL encoded before being added to the endpoint.

---

## 14. Successful Complaint Update

After a successful PATCH:

```text
selectedComplaint
        ↓
Updated response data
        ↓
setSelectedComplaint()
```

Then the page refreshes:

```text
Complaint List
Complaint KPIs
```

using:

```text
fetchComplaints()
fetchKPIs()
```

A success alert is then displayed.

---

## 15. Request Verification OTP

The page requests or resends an OTP using:

```text
POST /api/complaints/:ticketNumber/request-verification
```

The request is protected by:

```js
otpRequestInProgressRef
```

so repeated clicks cannot create duplicate OTP requests.

---

## 16. OTP Rate Limit

If the backend returns:

```text
HTTP 429
```

the page displays a rate-limit message telling the administrator to wait before requesting another OTP.

---

## 17. OTP Expiry

The page tracks:

```text
otpExpiresAt
otpExpired
```

A one-second interval checks whether the current time has passed the expiry timestamp.

The backend remains the source of truth for actual OTP validity.

---

## 18. OTP Expiry Sources

The page supports:

```text
verification_expires_at
verificationExpiresAt
```

from the selected complaint.

After requesting an OTP, it also supports:

```text
expiresAt
```

from the API response.

If no expiry is returned, the page creates a five-minute fallback expiry window.

---

## 19. Refresh After OTP Request

After a successful OTP request, the page refreshes:

```text
Complaint list
Complaint KPIs
Selected complaint details
```

It performs another complaint detail request for:

```text
/api/complaints/:ticketNumber
```

so the selected complaint can reflect the latest backend state.

---

## 20. Verify OTP

OTP verification is performed using:

```text
POST /api/complaints/:ticketNumber/verify
```

The OTP is sent in the request body.

The page prevents verification when:

```text
OTP is expired
```

or the selected complaint is not in the required OTP state.

---

## 21. Successful OTP Verification

After successful verification, the page refreshes the relevant complaint information and complaint list/KPIs as implemented by the verification flow.

The complaint can then move through the backend's verification/closure workflow.

---

## 22. Filter Changes

The function:

```js
handleFilterChange
```

updates one filter at a time.

For example:

```js
handleFilterChange("category", value)
```

updates the category while preserving the other filters.

---

## 23. Search Debouncing

Search changes use a:

```text
500 ms
```

debounce.

The timer is stored in:

```js
searchTimerRef
```

When the user stops typing, the page fetches page 1 using the updated filters.

This reduces unnecessary API requests during typing.

---

## 24. Non-Search Filters

For filters other than search, the page immediately calls:

```js
fetchComplaints(1, nextFilters)
```

This resets the result list to page 1 whenever a filter changes.

---

## 25. Reset Filters

`resetFilters()` restores:

```js
DEFAULT_FILTERS
```

and fetches page 1 again.

Any pending search debounce timer is cleared first.

---

## 26. Complaint Selection

When a complaint is selected:

```js
handleSelectComplaint(complaint)
```

stores it in:

```text
selectedComplaint
```

The page also initializes the OTP expiry information from the selected complaint.

---

## 27. Closing Complaint Details

The detail panel cannot be closed while:

```text
savingComplaint === true
```

or:

```text
requestingOTP === true
```

Otherwise:

```text
selectedComplaint
otpExpiresAt
otpExpired
```

are cleared.

---

## 28. Initial Page Load

On initial mount, the page calls:

```text
fetchComplaints(1, DEFAULT_FILTERS)
fetchKPIs()
```

Therefore both the complaint list and KPI cards are loaded when the page opens.

---

## 29. Search Timer Cleanup

When the page unmounts, the search timer is cleared.

This prevents a delayed search request from executing after the component has been removed.

---

## 30. Mobile Details Handling

When a complaint is selected, the page handles mobile behavior separately.

It uses a media query to determine whether the details panel is being displayed on a mobile-sized viewport.

The page can lock body scrolling while the mobile complaint details view is open.

---

## 31. Page Layout

The page combines:

```text
Header
   ↓
ComplaintHeader
   ↓
ComplaintFilters
   ↓
ComplaintKPIs
   ↓
ComplaintTable
   ↓
ComplaintDetails
```

On desktop, complaint details appear alongside the main complaint content.

On mobile, the selected complaint details are presented as a focused view.

---

## 32. Complete API Flow

```text
Complaints Page
      │
      ├── GET /api/complaints
      │       ↓
      │    ComplaintTable
      │
      ├── GET /api/complaints/kpis
      │       ↓
      │    ComplaintKPIs
      │
      ├── PATCH /api/complaints/:ticketNumber
      │       ↓
      │    Save Changes
      │
      ├── POST /api/complaints/:ticketNumber/request-verification
      │       ↓
      │    Request / Resend OTP
      │
      └── POST /api/complaints/:ticketNumber/verify
              ↓
           Verify OTP
```

---

## 33. Component Relationship

```text
Complaints.jsx
│
├── Header
│
├── ComplaintHeader
│
├── ComplaintFilters
│
├── ComplaintKPIs
│   └── ComplaintCard × 4
│
├── ComplaintTable
│
└── ComplaintDetails
```

---

## 34. Error Handling

The page handles:

```text
Missing admin token
Failed complaint fetch
Failed KPI fetch
Failed complaint update
OTP request failure
OTP rate limiting
OTP verification failure
```

Errors are logged using:

```js
console.error()
```

and user-facing messages are displayed through the relevant UI/alerts.

---

## 35. Language Support

The page and its child components use:

```js
useLanguage()
```

to provide translated labels and messages.

Complaint-related translation keys are under:

```text
complaints.*
```

---

## 36. Summary

`Complaints.jsx` is the main controller/container page for the SEWAC Complaints module.

It is responsible for:

- Loading complaints.
- Loading complaint KPIs.
- Applying search and category/date filters.
- Debouncing search.
- Managing pagination.
- Selecting complaints.
- Displaying complaint details.
- Updating complaint status and remarks.
- Requesting/resending verification OTP.
- Tracking OTP expiry in the UI.
- Verifying OTP.
- Refreshing complaint data after mutations.
- Handling authentication and API errors.
- Coordinating desktop and mobile complaint-detail views.

The page keeps API operations in the page-level container while the child components remain focused on presentation and user interaction.
