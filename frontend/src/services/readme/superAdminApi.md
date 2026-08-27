# superAdminApi.js Documentation

## 1. File Overview

The Super Admin API module provides the frontend function used to authenticate a Super Administrator.

It uses:

```text
API_BASE_URL
fetch()
```

## 2. API Base URL

The module imports:

```text
API_BASE_URL
```

from:

```text
./api
```

The configured base URL is used to construct the Super Admin authentication endpoint.

## 3. superAdminLogin()

The function accepts:

```text
email
password
```

## 4. Login Request

The function sends:

```text
POST /api/super-admin/login
```

with:

```text
Content-Type: application/json
```

## 5. Request Body

The submitted JSON contains:

```text
email
password
```

Example structure:

```json
{
  "email": "<email>",
  "password": "<password>"
}
```

## 6. Response Handling

The function converts the HTTP response to JSON using:

```text
res.json()
```

and returns the resulting data directly to the caller.

No response-status validation or error transformation is performed inside this service function.

## 7. Execution Flow

```text
Super Admin Login Component
          ↓
superAdminLogin(email, password)
          ↓
POST /api/super-admin/login
          ↓
JSON Response
          ↓
Return Data
```

## 8. Export

The module exports:

```text
superAdminLogin
```

as a named export.

## 9. Summary

`superAdminApi.js` provides the frontend API abstraction for Super Admin authentication. It accepts the administrator's email and password, sends them to the Super Admin login endpoint as JSON, converts the response to JSON, and returns the result to the calling component.
