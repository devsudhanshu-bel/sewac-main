# ApproveDevice.jsx Documentation

## 1. File Overview

The `ApproveDevice` component provides the frontend approval page for a device-registration request.

It:

```text
Reads approval token
Calls device approval API
Displays loading state
Displays success/failure state
Provides navigation back to login
```

## 2. URL Token

The component uses:

```text
useSearchParams()
```

to retrieve:

```text
token
```

from the query string.

## 3. Approval Validation

If no token is present, the component sets:

```text
success = false
message = "Invalid approval link."
loading = false
```

No API request is made.

## 4. Device Approval API

For a valid token, the component sends a GET request to:

```text
/api/devices/approve?token=<token>
```

The response is converted to JSON.

## 5. Response State

The response fields used by the component are:

```text
success
message
```

These values determine the final UI state.

## 6. Loading State

Initially:

```text
loading = true
```

The interface displays:

```text
Approving Device...
Please wait while we verify your request.
```

A spinning `Loader2` icon is displayed.

## 7. Successful Approval

When:

```text
data.success === true
```

the component displays:

```text
Device Approved
```

along with the backend-provided message.

A button allows the user to:

```text
Go to Login
```

which navigates to:

```text
/
```

## 8. Failed Approval

When approval fails, the component displays:

```text
Approval Failed
```

and the backend-provided message.

A button allows navigation back to:

```text
/
```

## 9. Network Error

If the API request fails, the component:

```text
logs the error
sets success = false
sets message = "Unable to approve device."
```

## 10. Effect Lifecycle

The approval operation executes inside:

```text
useEffect()
```

and depends on:

```text
searchParams
```

The API request therefore runs when the search-parameter state is initialized/updated.

## 11. UI States

The component has three primary states:

```text
Loading
Success
Failure
```

### Loading

```text
Loader2
Approving Device...
```

### Success

```text
CheckCircle2
Device Approved
Go to Login
```

### Failure

```text
XCircle
Approval Failed
Back to Login
```

## 12. Styling

The page uses:

```text
Tailwind CSS
Lucide React
```

The background uses a gradient and the approval card uses a white rounded container.

## 13. Export

The component is exported as:

```text
export default ApproveDevice
```

## 14. Summary

`ApproveDevice.jsx` is the device-registration approval page. It reads the token from the URL, calls the device approval endpoint, handles missing tokens and network failures, presents loading/success/failure states, and allows the user to return to the login page.
