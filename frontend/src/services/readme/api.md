# api(1).js Documentation

## 1. File Overview

The API configuration module defines the base URLs used by the frontend to communicate with the CMADS backend and the SEWAC main frontend.

## 2. API Base URL

The backend base URL is determined using:

```text
import.meta.env.VITE_API_BASE_URL
```

If the environment variable is unavailable, the default value is:

```text
http://localhost:5003
```

This represents the local CMADS backend.

## 3. SEWAC Main URL

The SEWAC main frontend URL is defined as:

```text
http://localhost:5173
```

The source notes that this should be changed back to the Render URL when deploying.

## 4. Exports

The module provides two exports:

```text
API_BASE_URL
SEWAC_MAIN_URL
```

`API_BASE_URL` is the default export.

## 5. Configuration Flow

```text
VITE_API_BASE_URL
       ↓
API_BASE_URL
       ↓
Frontend API Requests
```

The SEWAC frontend URL is maintained separately through:

```text
SEWAC_MAIN_URL
```

## 6. Summary

`api(1).js` centralizes frontend URL configuration. It obtains the CMADS backend URL from the Vite environment configuration with a localhost fallback and defines the local SEWAC main frontend URL for development.
