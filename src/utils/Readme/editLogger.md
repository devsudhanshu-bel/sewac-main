# editLogger.js Documentation

## 1. File Overview

**File:** `editLogger(1).js`

The edit logger records application-level edit activity into the:

``` text
edit_logs
```

database table.

It uses:

``` text
sewacPrisma
```

------------------------------------------------------------------------

# 2. logEdit()

The main function is:

``` text
logEdit({
  user,
  req,
  module,
  action,
  recordId,
  description
})
```

It records information about an edit operation performed by a user.

------------------------------------------------------------------------

# 3. Input Parameters

The function accepts:

  Parameter       Purpose
  --------------- --------------------------------------------
  `user`          User performing the operation
  `req`           Express request object
  `module`        Application module where the edit occurred
  `action`        Action performed
  `recordId`      Identifier of the affected record
  `description`   Description of the edit

`recordId` defaults to:

``` text
null
```

when it is not supplied.

------------------------------------------------------------------------

# 4. Database Operation

The logger creates a record using:

``` text
prisma.edit_logs.create()
```

The following values are stored:

``` text
performed_by
performed_by_id
role
module
action
record_id
description
ip_address
```

------------------------------------------------------------------------

# 5. User Information

The following information is obtained from the supplied user object:

``` text
user.full_name
user.id
user.role
```

These values are stored as:

``` text
performed_by
performed_by_id
role
```

------------------------------------------------------------------------

# 6. Request Information

The request IP address is obtained from:

``` text
req.ip
```

and stored as:

``` text
ip_address
```

------------------------------------------------------------------------

# 7. Record Information

The affected record is represented by:

``` text
recordId
```

The value defaults to:

``` text
null
```

if no record identifier is provided.

The operation description is stored through:

``` text
description
```

------------------------------------------------------------------------

# 8. Error Handling

The database operation is wrapped in:

``` text
try / catch
```

If logging fails, the error is written to the console as:

``` text
Edit Logger Error:
```

The error is not re-thrown.

Therefore a failure in edit-log creation does not propagate through this
helper.

------------------------------------------------------------------------

# 9. Complete Flow

``` text
Edit Operation
      ↓
logEdit()
      ↓
Read User + Request Details
      ↓
Build edit_logs Record
      ↓
prisma.edit_logs.create()
      ↓
+----------------------+
|                      |
Success              Error
|                      |
↓                      ↓
Log Stored         Console Error
```

------------------------------------------------------------------------

# 10. Export

The function is exported directly:

``` text
module.exports = logEdit
```

It can therefore be imported and invoked wherever edit logging is
required.

------------------------------------------------------------------------

# 11. Summary

`editLogger(1).js` provides a centralized helper for recording edit
operations. It captures the performing user's identity and role,
module/action details, affected record, description, and request IP
address, then persists the information in `edit_logs`. Logging failures
are caught and reported without being propagated.
