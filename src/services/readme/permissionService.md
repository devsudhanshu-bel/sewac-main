# permissionService.js Documentation

## 1. File Overview

**File:** `permissionService(20260826-120020).js`\
**Location:** Service layer for permission-request and approval
handling.

This service implements the permission workflow for administrative edit
operations.

It handles:

``` text
Permission request creation
Approval-token generation
Approval/rejection link generation
Approval email dispatch
Permission request approval
Approval-state validation
Temporary permission creation
Temporary permission expiry
```

The overall workflow is:

``` text
Admin Level 2
     ↓
requestPermission()
     ↓
Create edit_requests record
     ↓
Generate JWT approval token
     ↓
Generate Approve / Reject links
     ↓
Send approval email
     ↓
Admin approval action
     ↓
approvePermission()
     ↓
Verify JWT
     ↓
Find permission request
     ↓
Validate request status
     ↓
Mark request APPROVED
     ↓
Create / refresh temporary permission
     ↓
Temporary permission expires after 3 days
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
PrismaClient
axios
jsonwebtoken
```

The Prisma client is imported from:

``` text
../generated/cmads
```

and instantiated using:

``` js
const prisma = new PrismaClient();
```

The HTTP client is:

``` text
axios
```

and is used to communicate with the configured CMADS email API.

JWT operations use:

``` text
jsonwebtoken
```

------------------------------------------------------------------------

# 3. requestPermission()

This function creates a new permission request for an administrative
edit operation.

It receives the Express request object:

``` text
req
```

The function reads the following values from:

``` text
req.body
```

``` text
requested_by_admin_id
module
action
target_identifier
reason
```

------------------------------------------------------------------------

# 4. requestPermission() Input Fields

The request fields are:

  Field                     Purpose
  ------------------------- ---------------------------------------------------
  `requested_by_admin_id`   Admin who requested the permission
  `module`                  Application module involved in the requested edit
  `action`                  Action for which permission is requested
  `target_identifier`       Specific target affected by the action
  `reason`                  Reason for requesting the permission

These values are used both for database persistence and approval-token
generation.

------------------------------------------------------------------------

# 5. Create Permission Request

The service creates a record in:

``` text
edit_requests
```

using:

``` js
prisma.edit_requests.create()
```

The stored fields are:

``` text
requested_by_admin_id
module
action
target_identifier
reason
```

The newly created database record is stored as:

``` text
request
```

------------------------------------------------------------------------

# 6. Approval Token Generation

After creating the request, the service generates a JWT approval token
using:

``` js
jwt.sign()
```

The token payload contains:

``` text
requestId
adminId
module
action
target
```

The values are mapped as follows:

``` text
request.id
    ↓
requestId

requested_by_admin_id
    ↓
adminId

module
    ↓
module

action
    ↓
action

target_identifier
    ↓
target
```

------------------------------------------------------------------------

# 7. JWT Secret

The token is signed using:

``` text
process.env.JWT_SECRET
```

Therefore the approval token depends on the configured JWT secret.

The service does not define the secret inside the source file.

------------------------------------------------------------------------

# 8. Approval Token Expiration

The JWT is configured with:

``` text
expiresIn: "3d"
```

Therefore the approval token is valid for:

``` text
3 days
```

After that period, JWT verification should fail.

------------------------------------------------------------------------

# 9. Environment Configuration

The service logs:

``` text
CMADS_EMAIL_API
SEWAC_API
```

using:

``` js
process.env.CMADS_EMAIL_API
process.env.SEWAC_API
```

These environment variables are used to construct the email API
destination and approval/rejection links.

------------------------------------------------------------------------

# 10. Approve Link

The approval URL is constructed as:

``` text
<SEWAC_API>/api/permissions/approve/<approvalToken>
```

Conceptually:

``` text
SEWAC_API
    ↓
/api/permissions/approve/
    ↓
JWT approval token
```

------------------------------------------------------------------------

# 11. Reject Link

The rejection URL is constructed as:

``` text
<SEWAC_API>/api/permissions/reject/<approvalToken>
```

Conceptually:

``` text
SEWAC_API
    ↓
/api/permissions/reject/
    ↓
JWT approval token
```

------------------------------------------------------------------------

# 12. Approval Email Dispatch

The service sends an HTTP POST request using:

``` js
axios.post()
```

to:

``` text
process.env.CMADS_EMAIL_API
```

The request body contains:

``` text
requesterName
requesterEmail
module
action
target
reason
approveLink
rejectLink
```

------------------------------------------------------------------------

# 13. Email Requester Information

The email payload uses fixed requester information:

``` text
requesterName:
Admin Level 2

requesterEmail:
admin2@sewac.in
```

These values are not read dynamically from the incoming request.

------------------------------------------------------------------------

# 14. Email Module / Action Data

The email payload forwards:

``` text
module
action
target_identifier
reason
```

using:

``` text
module
action
target
reason
```

Therefore the approval email contains the context of the requested edit.

------------------------------------------------------------------------

# 15. Approval and Rejection Links in Email

The email API receives:

``` text
approveLink
rejectLink
```

constructed using:

``` text
SEWAC_API
approvalToken
```

The links therefore contain the JWT required by the approval/rejection
endpoint.

------------------------------------------------------------------------

# 16. requestPermission() Return Value

After the email API request succeeds, the function returns:

``` js
{
  ...request,
  approvalToken
}
```

Therefore the result contains:

``` text
All fields from the created edit_requests record
+
approvalToken
```

The token is therefore returned to the calling layer in addition to
being embedded in the email links.

------------------------------------------------------------------------

# 17. requestPermission() Complete Flow

``` text
Request Body
     ↓
Extract Permission Details
     ↓
Create edit_requests Record
     ↓
Generate JWT
     ↓
Set 3-Day JWT Expiry
     ↓
Build Approve Link
     ↓
Build Reject Link
     ↓
Call CMADS Email API
     ↓
Return Request + Token
```

------------------------------------------------------------------------

# 18. approvePermission()

This function processes an approval token.

It receives:

``` text
token
```

The token is expected to be the JWT generated by:

``` text
requestPermission()
```

------------------------------------------------------------------------

# 19. JWT Verification

The service verifies the token using:

``` js
jwt.verify(
  token,
  process.env.JWT_SECRET
)
```

The decoded payload is stored as:

``` text
decoded
```

If the token is invalid or expired, JWT verification throws an error.

The service does not catch or transform this JWT error.

------------------------------------------------------------------------

# 20. Permission Request Lookup

After successful token verification, the service retrieves the
permission request using:

``` js
prisma.edit_requests.findUnique()
```

The lookup uses:

``` text
decoded.requestId
```

against:

``` text
edit_requests.id
```

------------------------------------------------------------------------

# 21. Permission Request Not Found

If no matching request exists, the service throws:

``` text
Permission request not found
```

Therefore a valid JWT alone is not sufficient; the corresponding
database request must still exist.

------------------------------------------------------------------------

# 22. Already Approved Request

The service checks:

``` text
request.status
```

If the status is:

``` text
APPROVED
```

it throws:

``` text
This request has already been approved.
```

This prevents approving the same request repeatedly.

------------------------------------------------------------------------

# 23. Already Rejected Request

If:

``` text
request.status === "REJECTED"
```

the service throws:

``` text
This request has already been rejected.
```

Therefore a rejected request cannot later be approved through this
function.

------------------------------------------------------------------------

# 24. Approval State Update

After passing all status checks, the service updates the permission
request using:

``` js
prisma.edit_requests.update()
```

The fields updated are:

``` text
status
approved_at
```

The values are:

``` text
status = APPROVED
approved_at = current date/time
```

The updated request is stored as:

``` text
approvedRequest
```

------------------------------------------------------------------------

# 25. Approval Timestamp

The service records:

``` js
approved_at: new Date()
```

This stores the time at which the request was approved.

The timestamp is generated when `approvePermission()` executes.

------------------------------------------------------------------------

# 26. Temporary Permission Expiration

After approving the request, the service calculates:

``` text
expiresAt
```

It starts with:

``` js
new Date()
```

and adds:

``` text
3 days
```

using:

``` js
expiresAt.setDate(
  expiresAt.getDate() + 3
)
```

Therefore the temporary permission is valid for approximately:

``` text
3 days from approval
```

------------------------------------------------------------------------

# 27. Temporary Permission Upsert

The service creates or updates a record in:

``` text
temporary_permissions
```

using:

``` js
prisma.temporary_permissions.upsert()
```

The unique lookup key is:

``` text
admin_id_module_target_identifier
```

The composite values are:

``` text
admin_id
module
target_identifier
```

------------------------------------------------------------------------

# 28. Temporary Permission Update

If a matching temporary permission already exists, the service updates:

``` text
expires_at
```

to the newly calculated:

``` text
expiresAt
```

Therefore approving the permission again through a new eligible request
can refresh the existing temporary permission's expiration, subject to
the request-state checks.

------------------------------------------------------------------------

# 29. Temporary Permission Creation

If no matching temporary permission exists, the service creates:

``` text
admin_id
module
target_identifier
expires_at
```

The values are taken from the approved request:

``` text
request.requested_by_admin_id
request.module
request.target_identifier
```

and the newly calculated:

``` text
expiresAt
```

------------------------------------------------------------------------

# 30. Temporary Permission Data Flow

``` text
Approved Request
      ↓
requested_by_admin_id
      ↓
admin_id

module
      ↓
module

target_identifier
      ↓
target_identifier

Approval Time + 3 Days
      ↓
expires_at
```

------------------------------------------------------------------------

# 31. approvePermission() Complete Flow

``` text
JWT Token
   ↓
Verify JWT
   ↓
Extract requestId
   ↓
Find edit_requests Record
   ↓
Request Exists?
   ↓
Check Status
   ├── APPROVED → Reject
   ├── REJECTED → Reject
   └── Other → Continue
            ↓
      Mark APPROVED
            ↓
      Set approved_at
            ↓
    Calculate +3 Day Expiry
            ↓
    Upsert temporary_permissions
            ↓
       Return Approved Request
```

------------------------------------------------------------------------

# 32. Permission Lifecycle

The implemented lifecycle is:

``` text
REQUESTED
    ↓
edit_requests record created
    ↓
JWT generated
    ↓
Approval email sent
    ↓
APPROVED
    ↓
approved_at recorded
    ↓
temporary_permissions created/updated
    ↓
expires_at = approval + 3 days
```

The service explicitly handles terminal request states:

``` text
APPROVED
REJECTED
```

------------------------------------------------------------------------

# 33. Relationship Between Tables

The service works with two main permission tables:

``` text
edit_requests
temporary_permissions
```

The relationship is:

``` text
edit_requests
      ↓
Approval
      ↓
temporary_permissions
```

The request stores the approval workflow state, while the
temporary-permission record represents the resulting temporary
authorization.

------------------------------------------------------------------------

# 34. edit_requests Responsibilities

The `edit_requests` table is used to store:

``` text
requested_by_admin_id
module
action
target_identifier
reason
status
approved_at
```

The service creates the request and later updates:

``` text
status
approved_at
```

during approval.

------------------------------------------------------------------------

# 35. temporary_permissions Responsibilities

The `temporary_permissions` table stores:

``` text
admin_id
module
target_identifier
expires_at
```

It represents the temporary permission granted after approval.

The service uses an upsert to ensure uniqueness for:

``` text
admin_id
module
target_identifier
```

------------------------------------------------------------------------

# 36. Permission Duration

There are two related three-day periods:

## Approval Token

``` text
JWT expires in 3 days
```

## Temporary Permission

``` text
expires_at = approval time + 3 days
```

These are calculated independently.

Conceptually:

``` text
Request Created
      ↓
JWT valid for 3 days

Request Approved
      ↓
Temporary Permission valid for 3 days
```

------------------------------------------------------------------------

# 37. Security Flow

The approval workflow uses:

``` text
JWT Secret
JWT Request ID
Token Expiration
Database Request Validation
Request Status Validation
```

The token is signed using:

``` text
process.env.JWT_SECRET
```

and approval requires the corresponding database request to exist.

------------------------------------------------------------------------

# 38. Error Handling

The service does not use explicit `try / catch` blocks around the main
workflows.

Potential errors therefore propagate to the calling layer.

Explicit business errors include:

``` text
Permission request not found
This request has already been approved.
This request has already been rejected.
```

JWT verification errors are also allowed to propagate.

Database and email API errors are not transformed by this service.

------------------------------------------------------------------------

# 39. External Service Interaction

The service communicates with the CMADS email service using:

``` text
axios
```

The destination is configured through:

``` text
CMADS_EMAIL_API
```

The application base URL is configured through:

``` text
SEWAC_API
```

The JWT signing secret is configured through:

``` text
JWT_SECRET
```

------------------------------------------------------------------------

# 40. Environment Variables

The service depends on:

``` text
JWT_SECRET
CMADS_EMAIL_API
SEWAC_API
```

Their roles are:

  Environment Variable   Purpose
  ---------------------- ---------------------------------------
  `JWT_SECRET`           Signs and verifies approval JWTs
  `CMADS_EMAIL_API`      Email API endpoint
  `SEWAC_API`            Base URL for approval/rejection links

------------------------------------------------------------------------

# 41. Logging

The service logs:

``` text
CMADS_EMAIL_API
SEWAC_API
Approve Link
Reject Link
```

during permission-request creation.

This provides visibility into the configured email API and generated
approval/rejection URLs.

------------------------------------------------------------------------

# 42. Exported Functions

The service exports:

``` text
requestPermission
approvePermission
```

------------------------------------------------------------------------

# 43. Architecture

``` text
Admin Level 2
      ↓
requestPermission()
      │
      ├── Prisma
      │     ↓
      │  edit_requests
      │
      ├── JWT
      │     ↓
      │  Approval Token
      │
      └── Axios
            ↓
      CMADS Email API
            ↓
     Approve / Reject Links
```

Approval path:

``` text
Approve Link
      ↓
approvePermission(token)
      ↓
JWT Verification
      ↓
edit_requests
      ↓
Mark APPROVED
      ↓
temporary_permissions
      ↓
3-Day Temporary Permission
```

------------------------------------------------------------------------

# 44. Important Implementation Detail

The service generates both:

``` text
approveLink
rejectLink
```

during `requestPermission()`.

However, this service file exports only:

``` text
requestPermission
approvePermission
```

There is no:

``` text
rejectPermission
```

implementation in this file.

Therefore the rejection URL is generated and emailed, but the actual
rejection-processing logic is not implemented in this service file.

------------------------------------------------------------------------

# 45. Important Approval Detail

The JWT payload contains:

``` text
requestId
adminId
module
action
target
```

However, `approvePermission()` primarily uses:

``` text
decoded.requestId
```

to locate the database request.

The approval data ultimately comes from the persisted:

``` text
edit_requests
```

record rather than directly using all JWT payload fields for the
database update.

------------------------------------------------------------------------

# 46. Summary

`permissionService(20260826-120020).js` implements the
permission-request and approval workflow for administrative edits.

Its two exported functions are:

``` text
requestPermission()
approvePermission()
```

The request workflow is:

``` text
Admin Request
    ↓
Create edit_requests
    ↓
Generate 3-Day JWT
    ↓
Generate Approval / Rejection Links
    ↓
Send Email Through CMADS API
```

The approval workflow is:

``` text
Approval Token
    ↓
Verify JWT
    ↓
Find edit_requests
    ↓
Reject Already Approved / Rejected Requests
    ↓
Mark Request APPROVED
    ↓
Set approved_at
    ↓
Create / Refresh temporary_permissions
    ↓
Set expires_at to Approval + 3 Days
```

The permission system therefore separates:

``` text
Permission Request
        ↓
edit_requests
```

from:

``` text
Granted Temporary Permission
        ↓
temporary_permissions
```

The request controls the approval workflow, while the temporary
permission records the resulting short-lived authorization.

Overall architecture:

``` text
             Admin Level 2
                   ↓
          requestPermission()
                   ↓
            edit_requests
                   ↓
              JWT Token
                   ↓
          Email Approval Link
                   ↓
          approvePermission()
                   ↓
            Verify JWT
                   ↓
          Validate Request
                   ↓
             APPROVED
                   ↓
       temporary_permissions
                   ↓
          expires_at + 3 days
```
