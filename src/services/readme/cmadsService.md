# cmadsService.js Documentation

## 1. File Overview

**File:** `cmadsService.js`\
**Location:** `src/services/cmadsService.js`

This service handles CMADS authentication for two user categories:

``` text
WORKER
ADMIN L1 & L2
```

The authentication flow depends on the authenticated user's role.

It handles:

``` text
User lookup
Worker password verification
CMADS Admin L1/L2 authentication
CMADS API communication
Authentication result forwarding
Authentication error propagation
```

------------------------------------------------------------------------

## 2. Dependencies

The service uses:

``` text
axios
bcrypt
cmadsPrisma
```

The Prisma client is imported from:

``` text
../config/cmadsPrisma
```

The external CMADS API base URL is obtained from:

``` text
process.env.CMADS_API
```

------------------------------------------------------------------------

# 3. verifyCMADS()

This is the main authentication function.

It receives:

``` text
payload
```

The payload is expected to contain:

``` text
email
password
```

The function extracts:

``` js
const { email, password } = payload;
```

------------------------------------------------------------------------

# 4. User Lookup

Before determining the authentication flow, the service searches the
local CMADS database.

It calls:

``` js
prisma.admins.findUnique({
  where: { email },
})
```

Therefore the user is identified using:

``` text
email
```

------------------------------------------------------------------------

## User Not Found

If no user is returned from:

``` text
prisma.admins.findUnique()
```

the service throws:

``` text
Invalid email or password
```

The same message is also used for an invalid worker password.

------------------------------------------------------------------------

# 5. WORKER Login

When:

``` text
user.role === "WORKER"
```

the service performs local password verification.

The stored password hash is:

``` text
user.password_hash
```

The supplied password is compared using:

``` js
bcrypt.compare(
  password,
  user.password_hash
)
```

------------------------------------------------------------------------

## Worker Password Failure

If the password does not match, the service throws:

``` text
Invalid email or password
```

No external CMADS API request is made.

------------------------------------------------------------------------

## Successful Worker Login

When the password matches, the service returns:

``` json
{
  "admin": {}
}
```

where the object is:

``` text
user
```

retrieved from the local:

``` text
admins
```

table.

The service does not generate a JWT itself for the worker.

The implementation comment describes this path as:

``` text
WORKER LOGIN (Simple JWT)
```

but this service itself only verifies the password and returns the user
object.

------------------------------------------------------------------------

# 6. ADMIN L1 & L2 Login

Users who are not:

``` text
WORKER
```

follow the external CMADS authentication flow.

This includes the CMADS:

``` text
ADMIN L1
ADMIN L2
```

path as described by the service comments.

The service sends the complete authentication payload to:

``` text
${process.env.CMADS_API}/api/auth/login
```

------------------------------------------------------------------------

# 7. CMADS API Request

The external authentication request uses:

``` js
axios.post()
```

The endpoint is constructed as:

``` text
CMADS_API
    ↓
/api/auth/login
```

The complete `payload` received by `verifyCMADS()` is sent as the
request body.

------------------------------------------------------------------------

# 8. CMADS API Response

When the external request succeeds, the service returns:

``` js
response.data
```

directly.

The service does not transform the external response.

Therefore the response structure is determined by the CMADS API.

------------------------------------------------------------------------

# 9. Authentication Flow

The complete authentication decision flow is:

``` text
Email + Password
       ↓
Find User in admins
       ↓
User Found?
   ↙          ↘
 NO            YES
 ↓              ↓
Invalid       Check Role
Credentials      ↓
             WORKER?
             ↙     ↘
           YES      NO
            ↓        ↓
       bcrypt      CMADS API
       compare     /api/auth/login
            ↓        ↓
        Return     Return
        user       response.data
```

------------------------------------------------------------------------

# 10. Worker Authentication Architecture

The worker authentication path is:

``` text
Client
  ↓
verifyCMADS()
  ↓
CMADS admins table
  ↓
Find by email
  ↓
Check role = WORKER
  ↓
bcrypt.compare()
  ↓
admin user object
```

No external CMADS login request is performed for a worker.

------------------------------------------------------------------------

# 11. Admin Authentication Architecture

The CMADS admin path is:

``` text
Client
  ↓
verifyCMADS()
  ↓
CMADS admins table
  ↓
Find by email
  ↓
Role is not WORKER
  ↓
CMADS_API
  ↓
/api/auth/login
  ↓
response.data
```

The external CMADS API therefore handles authentication for the
non-worker path.

------------------------------------------------------------------------

# 12. Error Handling

The entire authentication operation is wrapped in:

``` text
try / catch
```

When an error occurs, the service executes:

``` js
throw error.response?.data || error;
```

This means:

``` text
Axios response error with response.data
        ↓
Throw response.data

Otherwise
        ↓
Throw original error
```

------------------------------------------------------------------------

# 13. Error Propagation

The service does not construct an HTTP response.

It throws the resulting error back to the calling layer.

For local authentication failures, the service explicitly throws:

``` text
Invalid email or password
```

For external CMADS API failures, the response body is propagated when
available.

------------------------------------------------------------------------

# 14. Database Interaction

The service performs one local database lookup:

``` js
prisma.admins.findUnique({
  where: { email },
})
```

The service does not create, update, or delete admin records.

Its database operation is read-only.

------------------------------------------------------------------------

# 15. Password Security

Worker passwords are verified using:

``` text
bcrypt.compare()
```

The service compares the supplied plaintext password against the stored:

``` text
password_hash
```

The stored password hash is not regenerated or modified during
authentication.

------------------------------------------------------------------------

# 16. Environment Configuration

The external CMADS authentication endpoint depends on:

``` text
CMADS_API
```

The service constructs:

``` text
${CMADS_API}/api/auth/login
```

If the environment configuration is invalid or unavailable, the
resulting Axios error is propagated through the service's error handler.

------------------------------------------------------------------------

# 17. Payload Handling

The same incoming:

``` text
payload
```

is used for the external CMADS API request.

The service does not create a separate payload object for the external
request.

For worker authentication, only:

``` text
email
password
```

are explicitly extracted from the payload for local verification.

------------------------------------------------------------------------

# 18. Return Values

There are two successful return paths.

## Worker

Returns:

``` json
{
  "admin": {}
}
```

where the value is the locally retrieved:

``` text
user
```

------------------------------------------------------------------------

## Admin L1 / L2

Returns:

``` text
response.data
```

from:

``` text
CMADS_API /api/auth/login
```

The service does not modify this response.

------------------------------------------------------------------------

# 19. Architecture

``` text
                 verifyCMADS()
                       ↓
                Find admin by email
                       ↓
                  User exists?
                 ↙           ↘
               NO             YES
               ↓               ↓
          Error: Invalid     Check role
          credentials          ↓
                         ┌─────┴─────┐
                         ↓           ↓
                       WORKER      ADMIN L1/L2
                         ↓           ↓
                    bcrypt.compare  Axios POST
                         ↓           ↓
                    admin: user   CMADS API
```

------------------------------------------------------------------------

# 20. Export

The module exports:

``` text
verifyCMADS
```

using:

``` js
exports.verifyCMADS = async (payload) => { ... }
```

------------------------------------------------------------------------

# 21. Summary

`cmadsService.js` is the authentication service for CMADS users.

It first looks up the user by email in the local `admins` table. When
the user's role is `WORKER`, the service verifies the supplied password
locally using `bcrypt` and returns the local user object.

For the CMADS admin authentication path, the service forwards the
supplied authentication payload to:

``` text
${CMADS_API}/api/auth/login
```

and returns the external API's response data unchanged.

The service is read-only with respect to the local database and
delegates non-worker authentication to the CMADS authentication API.
