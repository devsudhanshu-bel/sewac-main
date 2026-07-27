                 Admin Users
                       │
                 Login (JWT)
                       ▼
        app-authentication (Render)
                       │
             Returns JWT Token
                       ▼
        Admin-Backend (Render)
         Authorization: Bearer <JWT>




                 IoT Device
                       │
GET /api/iot/telemetry/record
Header:
x-api-key: 8fd2A7B3K91XZ
                       ▼
        Admin-Backend (Render)
       iotAuthMiddleware verifies API Key
                       ▼
        Telemetry Processing → Redis → Database