<div align="center">

# SEWAC

### Segregated Waste Accountability System

**Technical Architecture and Project Documentation**

![SEWAC](https://img.shields.io/badge/SEWAC-Completed-6C2BD9?style=for-the-badge)
![Phase 2](https://img.shields.io/badge/Phase%202-Helper%20App-7C3AED?style=for-the-badge)
![Phase 3](https://img.shields.io/badge/Phase%203-Citizen%20App-9333EA?style=for-the-badge)

</div>

---

## Table of Contents

- [1. Project Overview](#1-project-overview)
- [2. System Objectives](#2-system-objectives)
- [3. Technology Stack](#3-technology-stack)
- [4. Overall System Architecture](#4-overall-system-architecture)
- [5. SEWAC Main App — Phase 1 Context](#5-sewac-main-app--phase-1-context)
- [6. Phase 2 — SEWAC Helper App](#6-phase-2--sewac-helper-app)
- [7. Phase 2 — Helper App Workflow](#7-phase-2--helper-app-workflow)
- [8. Phase 2 — Helper Frontend Structure](#8-phase-2--helper-frontend-structure)
- [9. Phase 2 — Helper Backend Structure](#9-phase-2--helper-backend-structure)
- [10. Phase 3 — SEWAC Citizen App](#10-phase-3--sewac-citizen-app)
- [11. Phase 3 — Citizen App Functional Modules](#11-phase-3--citizen-app-functional-modules)
- [12. Phase 3 — Complaint Lifecycle](#12-phase-3--complaint-lifecycle)
- [13. Phase 3 — Citizen Frontend Structure](#13-phase-3--citizen-frontend-structure)
- [14. Phase 3 — Citizen Backend Structure](#14-phase-3--citizen-backend-structure)
- [15. Shared Authentication Module](#15-shared-authentication-module)
- [16. Database Architecture](#16-database-architecture)
- [17. Redis and Asynchronous Processing](#17-redis-and-asynchronous-processing)
- [18. Real-Time Telemetry Architecture](#18-real-time-telemetry-architecture)
- [19. GIS and Geographic Architecture](#19-gis-and-geographic-architecture)
- [20. SEWAC Main Backend Context](#20-sewac-main-backend-context)
- [21. Cloud Deployment Architecture](#21-cloud-deployment-architecture)
- [22. Backend Service and Port Architecture](#22-backend-service-and-port-architecture)
- [23. PM2 Process Management](#23-pm2-process-management)
- [24. Deployment and Update Workflow](#24-deployment-and-update-workflow)
- [25. Environment and Security Configuration](#25-environment-and-security-configuration)
- [26. Security Architecture](#26-security-architecture)
- [27. Inter-Application Relationship](#27-inter-application-relationship)
- [28. Repository-Level Structure](#28-repository-level-structure)
- [29. Operational Design Principles](#29-operational-design-principles)
- [30. Production Deployment Outcome](#30-production-deployment-outcome)
- [31. Repository Branch Reference](#31-repository-branch-reference)
- [32. Final Project Structure](#32-final-project-structure)
- [33. Technology and Infrastructure Summary](#33-technology-and-infrastructure-summary)
- [34. Documentation Reference](#34-documentation-reference)

---


---

# 1. Project Overview

SEWAC (Segregated Waste Accountability System) is an integrated digital platform developed to support municipal solid-waste collection, accountability, monitoring, citizen participation, and operational management. The platform connects field-level activities, administrative operations, collection vehicles, waste generators, processing plants, RFID-based identification, citizen services, and complaint workflows into a single digital ecosystem.

The project is organized into three major phases. Phase 1 represents the central SEWAC Main application used for administrative monitoring and operational management. Phase 2 extends the platform into the field through the SEWAC Helper App, which supports authorized personnel in citizen registration, surveys, RFID assignment, and related operational activities. Phase 3 extends the system to citizens through the SEWAC Citizen App, providing waste analytics, collection information, vehicle monitoring, and complaint services.

This repository documentation primarily explains the implementation and architecture associated with Phase 2 and Phase 3 while also documenting the Main App and shared authentication components required to understand the complete system. The supplied product manual describes the Helper App as the mobile operational component connecting field activities with the central SEWAC system, while the final deployment documentation establishes the cloud architecture used to run the backend ecosystem.

---

# 2. System Objectives

The primary objective of SEWAC is to replace fragmented and manually intensive waste-management activities with a connected digital workflow. Information collected in the field should become usable by administrative and monitoring systems without requiring the same information to be repeatedly entered into different applications. This creates a consistent data flow between field workers, administrators, citizens, and operational infrastructure.

A second objective is traceability. RFID identifiers associate waste containers and collection activity with the corresponding household or establishment. Vehicle telemetry adds operational visibility, while complaint records create a traceable channel between citizen-reported problems and municipal response. Together, these mechanisms allow the platform to maintain a digital history of important waste-management activities.

The completed system also emphasizes controlled access, geographic context, real-time information, and extensibility. Administrative roles receive controlled functionality, geographic filters narrow information to the relevant City, Zone, Division and Ward, Socket.IO supports live operational updates, and the modular backend architecture allows additional services to be introduced without redesigning the complete platform.

---

# 3. Technology Stack

The frontend ecosystem uses React and Vite for the web-based SEWAC Main application, Tailwind CSS for responsive interface styling, Leaflet for geographic visualization, Socket.IO for real-time communication, and GSAP for selected interface animations. Mobile applications are implemented using Flutter and Dart, allowing the Helper and Citizen applications to provide dedicated interfaces for field personnel and citizens.

The backend ecosystem is built primarily with Node.js and Express.js. Prisma ORM provides structured access to PostgreSQL, while Redis is used for caching, temporary state, and asynchronous processing. Axios supports HTTP communication between services and external dependencies, CORS manages cross-origin API access, node-cron supports scheduled processing where required, and SMTP is used for email-related communication.

The production environment separates application compute from persistent infrastructure. AWS EC2 provides the Linux compute host, PM2 manages independent Node.js processes, Aurora PostgreSQL/Amazon RDS provides managed PostgreSQL persistence, Upstash provides managed Redis, GitHub provides source and deployment control, and Render provides an additional application delivery path for selected workstreams. The deployment report explicitly treats these concerns as separate operational layers.

---


<div align="center">

[![React](https://skillicons.dev/icons?i=react)](https://react.dev/)
[![Vite](https://skillicons.dev/icons?i=vite)](https://vite.dev/)
[![Tailwind](https://skillicons.dev/icons?i=tailwind)](https://tailwindcss.com/)
[![Flutter](https://skillicons.dev/icons?i=flutter)](https://flutter.dev/)
[![Dart](https://skillicons.dev/icons?i=dart)](https://dart.dev/)
[![Node.js](https://skillicons.dev/icons?i=nodejs)](https://nodejs.org/)
[![Express](https://skillicons.dev/icons?i=express)](https://expressjs.com/)
[![Prisma](https://skillicons.dev/icons?i=prisma)](https://www.prisma.io/)
[![Redis](https://skillicons.dev/icons?i=redis)](https://redis.io/)
[![PostgreSQL](https://skillicons.dev/icons?i=postgres)](https://www.postgresql.org/)
[![AWS](https://skillicons.dev/icons?i=aws)](https://aws.amazon.com/)
[![GitHub](https://skillicons.dev/icons?i=github)](https://github.com/)

![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-0AE448?style=for-the-badge&logo=greensock&logoColor=111111)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-334155?style=for-the-badge)
![node-cron](https://img.shields.io/badge/node--cron-374151?style=for-the-badge)
![SMTP](https://img.shields.io/badge/SMTP-Email%20Integration-475569?style=for-the-badge)
![PM2](https://img.shields.io/badge/PM2-Process%20Manager-2B037A?style=for-the-badge)

</div>


### Frontend Stack

| Technology | Role in SEWAC |
|---|---|
| React | Administrative web interface |
| Vite | Web application build and development environment |
| Tailwind CSS | Responsive and utility-based interface styling |
| Leaflet / React Leaflet | Maps, boundaries, locations and vehicle visualization |
| Socket.IO | Real-time communication |
| GSAP | Interface animations and transitions |
| Flutter | Helper and Citizen mobile applications |
| Dart | Flutter application language |

### Backend Stack

| Technology | Role in SEWAC |
|---|---|
| Node.js | Backend runtime |
| Express.js | REST API framework |
| Prisma ORM | Relational data access |
| PostgreSQL | Persistent relational database |
| Redis | Cache, temporary state and asynchronous processing |
| Axios | Inter-service and external HTTP communication |
| CORS | Cross-origin request configuration |
| Socket.IO | Real-time server communication |
| node-cron | Scheduled processing |
| SMTP | Email communication |

### Infrastructure Stack

| Technology | Role in SEWAC |
|---|---|
| AWS EC2 | Backend compute |
| Aurora PostgreSQL / Amazon RDS | Managed database |
| Upstash Redis | Managed Redis |
| PM2 | Node.js process supervision |
| GitHub | Source control and deployment source |
| Render | Complementary application delivery |
| pgAdmin | Database administration and verification |

---

# 4. Overall System Architecture

SEWAC follows a modular client-server architecture. Web and mobile clients communicate with backend services through REST APIs, while Socket.IO provides a persistent real-time communication channel for operational features that require immediate updates. The backend layer is responsible for validation, authentication, business logic, database interaction, asynchronous processing, and communication with external services.

The architecture separates presentation, application services, persistence, caching, and infrastructure. This separation is important because the lifecycle of a frontend application should not determine the lifecycle of the database, and a temporary telemetry workload should not block normal CRUD operations. The deployment therefore places Node.js services on EC2 while keeping PostgreSQL and Redis as managed external services.

At the infrastructure level, five backend services are independently managed on one EC2 host. The documented service ports are 5000, 5001, 5002, 5003, and 5004. The database is not installed as a database server on EC2; instead, backend services connect to the managed Aurora PostgreSQL/Amazon RDS layer. Upstash Redis remains external to EC2 and supports selected cache and asynchronous workloads.

---


### High-Level Architecture

```text
                         SEWAC ECOSYSTEM
                                |
       +------------------------+------------------------+
       |                        |                        |
       v                        v                        v
   SEWAC MAIN              HELPER APP             CITIZEN APP
 React / Vite            Flutter / Dart          Flutter / Dart
       |                        |                        |
       +------------------------+------------------------+
                                |
                                v
                       Node.js Backend Layer
                                |
              +-----------------+-----------------+
              |                 |                 |
              v                 v                 v
          REST APIs         Socket.IO       Authentication
              |                 |                 |
              +-----------------+-----------------+
                                |
              +-----------------+-----------------+
              |                 |                 |
              v                 v                 v
        PostgreSQL           Redis          External Services
        Prisma ORM       Upstash Redis       SMTP / Media
```

### Request Processing Model

```text
Client
  |
  v
Express Route
  |
  v
Controller
  |
  v
Service
  |
  +------> Repository / Prisma ------> PostgreSQL
  |
  +------> Redis
  |
  +------> Axios / External Service
  |
  v
Response
```

---

# 5. SEWAC Main App — Phase 1 Context

The SEWAC Main App is the central administrative interface through which authorized personnel monitor and manage the wider waste-management ecosystem. Although this README focuses on Phase 2 and Phase 3, the Main App is an essential part of the system because information generated by field operations and citizen interactions ultimately contributes to the centralized operational view.

The Main App contains major administrative areas including Overview, Waste Generators, Vehicles, Plants, Complaints, and Users. Its dashboards present operational statistics, geographic information, vehicle status, waste-generation information, collection-point information, and plant information. The interface also provides administrative controls for users and operational records.

The Main App uses a hierarchical geographic selection model in which City is followed by Zone or Corporation, Division, and Ward. The product manual explains that changing a geographic selection updates the information displayed throughout the application so that administrators can work with data relevant to the selected area. This geographic hierarchy is fundamental to the platform's monitoring model.

---

# 6. Phase 2 — SEWAC Helper App

The SEWAC Helper App is the mobile operational component of the SEWAC ecosystem. It was created because a web portal alone cannot efficiently support every activity performed by personnel working directly in the field. The mobile interface gives authorized personnel a structured way to perform field operations while remaining connected to the central waste-management system.

The product manual describes the Helper App as supporting operational and RFID-related activities. It reduces dependence on manual processes by allowing field information to be captured digitally and transferred into the wider SEWAC data flow. This makes field activities more consistent and allows administrative users to work with information generated during those activities.

The Helper App is particularly important for RFID operations because RFID identifiers provide a digital link between a physical waste container and a household or establishment. The application therefore combines authentication, household survey workflows, RFID hardware registration, RFID assignment, verification, and operational logging within a dedicated mobile environment.

---

# 7. Phase 2 — Helper App Workflow

The Helper App begins with authentication so that only authorized personnel can access field operations. After login, the user works within the functionality permitted for the account. The documented workflow includes assigning an RFID range before RFID-related operations, locating or registering a household, entering survey information, assigning RFID identifiers when applicable, reviewing the captured information, and finally confirming the record.

For existing records, the worker can locate the relevant citizen or household and continue with RFID-related operations without unnecessarily creating a duplicate record. For a new household, the worker completes the survey, selects whether the survey is being conducted with or without RFID tags, enters household and contact details, records building information, and provides the required waste-generator information.

The final verification step is an important control. The product manual states that the worker should review location, household or establishment details, contact information, RFID numbers, and building photograph before confirming the survey. When RFID tags are used, the Wet and Dry RFID values are re-entered during verification to reduce accidental or mismatched assignments.

---


### RFID Range Workflow

```text
Authorized Login
      |
      v
Assign RFID Range
      |
      +---- Start RFID
      |
      +---- End RFID
      |
      v
Save Range
      |
      v
RFID Operations Enabled
```

### Survey Workflow

```text
Select / Verify Location
          |
          v
Survey Details
          |
          v
With Tags / Without Tags
          |
          v
Waste Generator Type
          |
          v
Building + Household Details
          |
          v
Person + Contact Details
          |
          v
Wet RFID / Dry RFID
          |
          v
Number of People
          |
          v
Submit Survey
          |
          v
Verify Details
          |
          v
Confirm and Save
```

---

# 8. Phase 2 — Helper Frontend Structure

The Helper frontend is implemented as a Flutter/Dart mobile application. Its structure separates reusable application infrastructure from business features so that authentication, network communication, storage, models, screens, and widgets do not become tightly coupled. This is important for a field application because the same network and authentication mechanisms are reused across multiple operational screens.

The logical structure contains core configuration and utility areas, models for application data, services for API communication, providers for application state where required, feature-specific screens, and reusable widgets. The feature areas include authentication, citizen operations, survey operations, RFID functionality, tracking, and master data.

The Android and iOS project directories are maintained alongside the Flutter source, while assets and package configuration are maintained through the standard Flutter project structure. The resulting organization allows the application to evolve without placing all field functionality inside a single screen or monolithic service.

---


```text
sewac-helper-app/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   ├── network/
│   │   ├── storage/
│   │   └── theme/
│   ├── models/
│   ├── services/
│   ├── providers/
│   ├── screens/
│   │   ├── auth/
│   │   ├── citizen/
│   │   ├── survey/
│   │   ├── rfid/
│   │   ├── tracking/
│   │   └── master/
│   ├── widgets/
│   └── main.dart
├── android/
├── ios/
├── assets/
├── pubspec.yaml
└── README.md
```

---

# 9. Phase 2 — Helper Backend Structure

The Helper backend follows a modular Node.js and Express architecture. The principal business domains include authentication, citizen operations, master data, phone-related operations, remarks, RFID, survey, and tracking. Each domain can expose routes and controllers while delegating business logic to service layers rather than placing all processing directly inside HTTP handlers.

The backend also contains configuration, middleware, utilities, application initialization, and server startup components. Prisma is used for relational data access, while Redis and other configured external dependencies are accessed through dedicated infrastructure configuration. This arrangement keeps the business modules independent from deployment-specific connection details.

The layered backend flow can be summarized as Route to Controller to Service and then to persistence or external services. This separation improves maintainability because validation and HTTP concerns remain in controllers while domain decisions remain in services and database operations remain in the persistence layer.

---


```text
helper-backend/
├── src/
│   ├── auth/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── routes/
│   │   └── middleware/
│   ├── citizen/
│   │   ├── controller/
│   │   ├── service/
│   │   └── routes/
│   ├── master/
│   ├── phone/
│   ├── remarks/
│   ├── rfid/
│   ├── survey/
│   ├── tracking/
│   ├── config/
│   ├── middleware/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed/
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 10. Phase 3 — SEWAC Citizen App

The SEWAC Citizen App is the citizen-facing mobile component of the platform. It allows residents to interact directly with waste-management services instead of relying exclusively on administrative personnel. The application provides access to waste-disposal information, collection history, vehicle visibility, and complaint functionality.

The Citizen App is designed to turn citizens into active participants in the waste-management ecosystem. Citizens can view information associated with their waste activity, monitor collection-related information, and report problems observed in their neighbourhood. The complaint workflow also allows citizens to provide photographic evidence and geographic information.

The application is implemented using Flutter and Dart and communicates with a dedicated Node.js backend. This separation allows the mobile interface to evolve independently while maintaining a stable service boundary for authentication, complaints, analytics, and other citizen-facing operations.

---

# 11. Phase 3 — Citizen App Functional Modules

The Citizen App is organized around several functional areas. Authentication establishes the citizen session and verifies the device context where required. The home and analytics areas provide access to waste-related information, while collection-history views allow citizens to inspect activity across dates. Vehicle functionality provides operational visibility, and the Complaints module provides a formal reporting and verification workflow.

Waste analytics are intended to provide citizens with understandable information about their participation in collection activities. The application can present Wet Waste and Dry Waste information, collection history, date-based activity, and related participation indicators. The calendar-oriented presentation allows collection activity to be interpreted at an individual-day level rather than only as an aggregate number.

The vehicle and complaint modules connect the citizen interface to live and operational backend services. Vehicle visibility relies on telemetry and real-time communication, while complaints move through defined backend states and can require a citizen verification step before closure.

---

# 12. Phase 3 — Complaint Lifecycle

The complaint system provides a complete lifecycle rather than a simple submission form. A citizen identifies a waste problem, opens the Complaints module, provides the relevant location, adds a photograph when required, selects a category, enters a description, confirms the information, and submits the complaint. The system generates a unique complaint identifier that can be used for later tracking.

The complaint may subsequently move through operational states. When citizen verification is required, the complaint can enter an OTP_SENT stage. The product manual states that the citizen can see a six-digit verification code and share it with the SEWAC worker. This creates a verification mechanism for complaints that require an actual interaction between the citizen and the field worker.

The citizen can refresh the complaints list to obtain the latest status and can open an individual complaint to inspect details such as the complaint ID, submission time, description, location, uploaded image, status, and verification code where applicable. Successful verification allows the complaint to progress to CLOSED.

---


### Complaint State Flow

```text
SUBMITTED
    |
    v
Operational Processing
    |
    v
OTP_SENT
    |
    v
Citizen Shares Verification Code
    |
    v
Verification
    |
    v
CLOSED
```

The product manual describes the complete citizen-facing sequence as identifying a waste problem, opening Complaints, checking location, submitting the complaint, adding a photograph, selecting the category, entering the description, confirming the location, receiving the complaint ID, tracking the complaint, receiving an OTP when required, sharing the OTP with the SEWAC worker, and finally reaching the CLOSED state.

---

# 13. Phase 3 — Citizen Frontend Structure

The Citizen frontend follows a Flutter/Dart project structure that separates core application functionality, data models, API services, feature screens, and reusable widgets. Models represent structured application data such as citizen information, complaint records, and login responses. Services encapsulate communication with backend APIs so that screens do not directly manage HTTP implementation details.

Feature screens are organized around authentication, home, analytics, complaints, vehicles, and profile functionality. This feature-oriented arrangement makes it possible to modify a single functional area without restructuring the complete application.

The standard Flutter Android and iOS directories are maintained with the source project, while assets and package dependencies are managed through the Flutter project configuration. The architecture is therefore suitable for maintaining a single mobile codebase across supported mobile platforms.

---


```text
sewac-citizen-app/
├── lib/
│   ├── core/
│   │   ├── constants/
│   │   ├── network/
│   │   ├── storage/
│   │   └── theme/
│   ├── models/
│   │   ├── citizen.dart
│   │   ├── complaint_model.dart
│   │   └── login_response.dart
│   ├── services/
│   │   ├── auth_service.dart
│   │   ├── complaint_service.dart
│   │   └── ...
│   ├── screens/
│   │   ├── authentication/
│   │   ├── home/
│   │   ├── analytics/
│   │   ├── complaints/
│   │   ├── vehicles/
│   │   └── profile/
│   ├── widgets/
│   └── main.dart
├── android/
├── ios/
├── assets/
├── pubspec.yaml
└── README.md
```

---

# 14. Phase 3 — Citizen Backend Structure

The Citizen backend is a modular Express service. Its authentication domain contains dedicated constants, controller, repository, routes, service, and validation components. Its complaint domain follows a similar separation so that complaint routing, business rules, database operations, and validation remain independently understandable.

A dedicated Redis module is also present because citizen authentication and device-related workflows require temporary state and controlled session handling. The backend's configuration and middleware layers provide the common infrastructure required by all modules.

The overall processing model is Route to Controller to Service to Repository or external dependency. This design prevents database queries and business rules from becoming embedded directly in route declarations and allows the same service layer to be reused by different endpoints when necessary.

---


```text
sewac-citizen-app-backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.constants.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.repository.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   └── auth.validation.js
│   │   ├── complaint/
│   │   │   ├── complaint.controller.js
│   │   │   ├── complaint.service.js
│   │   │   ├── complaint.repository.js
│   │   │   └── complaint.routes.js
│   │   └── redis/
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 15. Shared Authentication Module

Authentication is maintained as a separate module because identity and session management are cross-cutting concerns used by multiple SEWAC applications. The authentication implementation covers both frontend and backend responsibilities and is intended to keep credential handling, token creation, protected access, and device-related checks outside individual business modules.

Administrative authentication uses an email and password model with JWT-based sessions. Passwords are protected using bcrypt hashing, and authenticated requests use Bearer tokens. Administrative roles are then used by the application to determine which modules and operations are available to the user.

Citizen authentication follows a different identity model centered on the registered mobile number and device context. Redis can maintain temporary device and session state, while the backend creates the authenticated session required by the Citizen App. This separation allows administrative and citizen authentication to use different identity workflows while remaining part of the same authentication ecosystem.

---


### Authentication Flow

```text
Credentials / Mobile Number
            |
            v
         Validation
            |
            v
      Identity Resolution
            |
            v
 Device / Session Verification
            |
            v
       Redis State
            |
            v
        JWT Session
            |
            v
      Protected Application
```

### Administrative Authentication

```text
Email + Password
      |
      v
Authentication API
      |
      v
JWT
      |
      v
Role Resolution
      |
      v
Administrative Portal
```

### Citizen Authentication

```text
Mobile Number
      |
      v
Citizen Identity
      |
      v
Device Verification
      |
      v
Redis State
      |
      v
JWT Session
      |
      v
Citizen App
```

---

# 16. Database Architecture

PostgreSQL is the primary relational persistence layer for the SEWAC ecosystem. In production, PostgreSQL is hosted as an AWS-managed Aurora PostgreSQL/Amazon RDS resource rather than as a database server installed on the EC2 application host. This creates a clear separation between application compute and persistent data storage.

Backend services connect to the managed PostgreSQL endpoint through environment configuration. Prisma ORM provides structured access to relational models and supports schema generation and database introspection. pgAdmin is used for controlled database inspection, SQL verification, and operational administration.

The deployment documentation specifically distinguishes `prisma db pull` from migrations. `prisma db pull` introspects the existing database and can modify the local Prisma schema representation; it does not itself perform a database migration. This distinction is important when maintaining production systems because a modified local schema file does not automatically imply that the database was changed.

---


### Database Connection

```text
Node.js Service
      |
      v
Prisma / PostgreSQL Client
      |
      v
Managed PostgreSQL Endpoint
      |
      v
Aurora PostgreSQL / RDS
```

### Database Administration

pgAdmin is used for controlled inspection and validation. The database endpoint is registered in pgAdmin, authorized credentials are used for access, schemas and tables are inspected, and Query Tool can be used for controlled SQL verification.

The database remains separate from EC2 so that replacing or scaling application compute does not require rebuilding the PostgreSQL infrastructure.

---

# 17. Redis and Asynchronous Processing

SEWAC uses Upstash Redis as its managed Redis layer. Upstash is external to the EC2 host and is separate from the Aurora PostgreSQL/Amazon RDS database. Applications connect to it through environment configuration rather than through a locally installed Redis server.

Redis is used for selected workloads where temporary state, caching, asynchronous processing, or queue-based decoupling provides an operational benefit. Authentication and device workflows can use Redis for short-lived state, while telemetry processing can use Redis to separate high-frequency ingestion from database persistence.

This separation is particularly important on the current small EC2 host. Because Redis is externally managed, its memory and processing workload do not consume the EC2 instance's local RAM and CPU. The deployment report also recommends sizing managed Redis from measured workload rather than introducing infrastructure solely because it is available.

---


### Redis Separation

```text
EC2 Backend Services
        |
        v
   Upstash Redis
        |
   +----+----+
   |         |
 Cache    Async Queue
   |         |
   +----+----+
        |
        v
Application Processing
```

Upstash is not a Redis process installed on EC2. It is a managed external dependency accessed through configuration. This distinction is important for both infrastructure planning and cost analysis because Redis resource consumption is not the same as EC2-local memory consumption.

---

# 18. Real-Time Telemetry Architecture

Vehicle telemetry is treated as a high-frequency operational workload rather than ordinary CRUD data. A telemetry source sends information to a Node.js API, the backend validates the event, and the processing layer can place work into Redis before persistence. Per-vehicle processing helps preserve ordering while keeping the ingestion path independent from normal administrative API traffic.

Telemetry records can contain vehicle identity, timestamps, RFID information, citizen association, waste weights, GPS coordinates, and driver information. The telemetry documentation distinguishes the device-reported timestamp from the time the backend received the data and the time the database record was created. These timestamps should therefore be interpreted according to their individual meanings.

After successful persistence, Socket.IO can be used to distribute the latest operational information to connected clients. This allows dashboard and map interfaces to display live vehicle information without requiring constant manual refresh requests.

---


### Telemetry Processing

```text
Vehicle / IoT Device
        |
        v
Telemetry API
        |
        v
Validation
        |
        v
Redis Queue
        |
        v
Per-Vehicle Processor
        |
        v
PostgreSQL
        |
        +----------------+
        |                |
        v                v
   Historical Data    Socket.IO
                         |
                         v
                    Live Map
```

Telemetry records can contain RFID EPC information, citizen association, waste weights, latitude, longitude, driver information, vehicle number, and multiple timestamps. The telemetry schema distinguishes device time, backend receipt time, and database creation time so that operational analysis can determine when an event occurred and when the platform processed it.

---

# 19. GIS and Geographic Architecture

Geographic visualization is an important part of SEWAC because waste operations are inherently spatial. Leaflet and React Leaflet are used to display operational locations, vehicle positions, collection points, plants, complaint locations, routes, and administrative boundaries.

The administrative hierarchy is City, Zone or Corporation, Division, and Ward. The product manual explains that users select these levels progressively and that the available options at one level depend on the selection made at the previous level. This prevents administrators from having to manually filter every dashboard component separately.

GIS information is used both for monitoring and for context. A vehicle location can be understood alongside ward boundaries, a plant can be displayed on a city map, and a complaint can retain its geographic position. The same geographic structure therefore supports dashboards, operational analysis, and field workflows.

---


### Geographic Hierarchy

```text
City
 |
 +--> Zone / Corporation
       |
       +--> Division
              |
              +--> Ward
```

### GIS Data Flow

```text
Operational Entity
      |
      v
Latitude / Longitude
      |
      v
Leaflet / React Leaflet
      |
      v
Map Visualization
```

GIS is therefore not limited to a single map screen. Geographic context is shared across operational monitoring, vehicle tracking, plant visualization, complaint locations, collection points, and administrative filtering.

---

# 20. SEWAC Main Backend Context

The SEWAC Main backend provides the centralized operational API layer for the administrative platform and related services. Its functional areas include dashboards, citizen and waste-generator information, vehicle operations, plants, complaints, users, geographic filtering, telemetry, historical information, and supporting Redis workflows.

The backend follows a modular service architecture in which HTTP routes delegate to controllers and business services. Persistence is handled through Prisma and PostgreSQL for structured relational information, while Redis is used for selected high-frequency or temporary workflows. External integrations such as authentication, email, and media services are treated as separate dependencies.

This architecture allows the Main backend to act as the central operational layer without forcing every feature into one implementation unit. The same approach also makes it possible to introduce additional modules or services while retaining the established routing, service, persistence, and infrastructure boundaries.

---

# 21. Cloud Deployment Architecture

The final deployment uses AWS as the primary infrastructure foundation with Render serving as a complementary application delivery platform for selected workstreams. AWS EC2 provides the Linux compute environment for the Node.js backend services, while PM2 keeps those services running and provides process status, logs, and restart controls.

The current EC2 deployment uses a t3.micro instance in the documented `ap-south-2` region. Five independent backend services are hosted on the same EC2 instance and listen on ports 5000 through 5004. They are separate processes even though they share the same compute host.

The database layer is intentionally separated from EC2. Aurora PostgreSQL/Amazon RDS provides managed PostgreSQL persistence, pgAdmin provides operator-side database administration, and Upstash Redis provides managed cache/asynchronous processing capability. The deployment report treats application compute, source code, process supervision, database persistence, caching, email, and external integrations as separate operational concerns.

---


### Deployment Relationship

```text
                         GitHub
                            |
                +-----------+-----------+
                |                       |
                v                       v
              Render                  AWS
                                        |
                                        v
                                     EC2
                                   t3.micro
                                        |
                                        v
                                       PM2
                                        |
             +-----------+--------------+--------------+-----------+
             |           |              |              |           |
            5000        5001           5002           5003        5004
             |           |              |              |           |
             +-----------+--------------+--------------+-----------+
                                        |
                                        v
                            Aurora PostgreSQL / RDS

                    Upstash Redis remains external
```

---

# 22. Backend Service and Port Architecture

The completed deployment documents five backend services running as independently managed processes on a single EC2 host. Port allocation prevents services from competing for the same listener and allows each application to be restarted or inspected independently.

The documented mapping is: port 5000 for SEWAC Helper Admin, port 5001 for the SEWAC Helper App backend, port 5002 for the SEWAC Main backend, port 5003 for Authentication/CMADS, and port 5004 for the Citizen backend. These ports represent application processes and do not represent five separate EC2 instances.

The architecture can therefore be visualized as one compute host containing five independently managed Node.js applications. All services can share managed infrastructure where appropriate while maintaining separate source repositories, environment configuration, PM2 processes, ports, and application responsibilities.

---


| Port | Service | Primary Responsibility |
|---:|---|---|
| `5000` | SEWAC Helper Admin | Helper administration and administrative operations |
| `5001` | SEWAC Helper App | Field application backend |
| `5002` | SEWAC Main | Main operational and telemetry APIs |
| `5003` | Authentication / CMADS | Authentication and related service dependency |
| `5004` | Citizen Backend | Citizen-facing and citizen-service APIs |

The five services share the same EC2 compute host but remain independently managed processes. This arrangement provides a simple deployment model for the completed project while retaining a clear path to future service separation if workload or availability requirements increase.

---

# 23. PM2 Process Management

PM2 is the process manager used to supervise the Node.js services deployed on EC2. It keeps backend applications running after an interactive SSH session closes and provides operational commands for checking process status, viewing logs, restarting services, and saving the process configuration.

The deployment report documents commands such as `pm2 status`, `pm2 logs <service-name>`, `pm2 restart <service-name>`, `pm2 save`, and `pm2 startup`. Each backend service must have a unique PM2 process name and a unique port so that service ownership remains clear.

Operational verification should begin with PM2 status and logs before moving to API testing. The deployment documentation also emphasizes that the correct HTTP method must be used when testing an endpoint. A GET request to a POST-only route can legitimately return 404 and does not necessarily indicate that the backend process is unavailable.

---


### PM2 Operations

```bash
pm2 status
pm2 logs <service-name> --lines 50
pm2 restart <service-name>
pm2 save
pm2 startup
```

### Verification Order

```text
PM2 Status
    |
    v
Application Logs
    |
    v
Local Port
    |
    v
Actual Route + HTTP Method
    |
    v
Public Endpoint
```

This verification sequence avoids confusing process failures with API contract errors. The deployment report specifically notes that a GET request sent to a POST-only route can correctly return 404.

---

# 24. Deployment and Update Workflow

The deployment workflow is based on GitHub as the source repository and EC2 as the persistent application host. A developer pushes code to the appropriate branch, the deployment workspace on EC2 retrieves the branch, dependencies are updated when necessary, and PM2 is restarted for the affected service.

The documented operational sequence is GitHub push, EC2 git pull, dependency or Prisma update when required, PM2 restart, and endpoint/log verification. This approach allows application code to be updated without recreating the underlying EC2 instance or managed PostgreSQL database.

A typical update requires entering the relevant application directory, fetching branches, checking out the intended branch, pulling the latest code, installing dependencies, restarting the correct PM2 process, and checking logs. Verification should progress from the local EC2 listener to the actual route and HTTP method and finally to the public endpoint.

---


### Standard Update Sequence

```bash
cd ~/apps/<service>

git fetch --all
git branch -a
git checkout <required-branch>
git pull origin <required-branch>

npm install

pm2 restart <service-name>

pm2 status
pm2 logs <service-name>
```

### Operational Model

```text
GitHub Push
    |
    v
EC2 Git Pull
    |
    v
Dependency / Prisma Update
    |
    v
PM2 Restart
    |
    v
Endpoint Verification
```

---

# 25. Environment and Security Configuration

Runtime configuration is separated from application source code through environment variables. Database connection strings, JWT signing secrets, service URLs, Redis endpoints, SMTP settings, media-service credentials, and other environment-specific values must be supplied through the deployment environment rather than hard-coded in source files.

The final deployment documentation intentionally excludes actual credentials, passwords, JWTs, private keys, and third-party API secrets. The same principle applies to GitHub repositories, screenshots, technical reports, and operational messages. Secrets should remain in approved environment configuration and should be rotated through controlled procedures.

As the system matures, the deployment report identifies AWS Secrets Manager or SSM Parameter Store as appropriate future mechanisms for production secret management. The important architectural principle is that application code should remain portable while sensitive runtime configuration remains outside version control.

---


### Configuration Categories

```text
DATABASE_URL
JWT_SECRET
PORT
NODE_ENV

AUTHENTICATION / CMADS URLS
SEWAC API URLs
CITIZEN API URLs

UPSTASH_REDIS_URL

SMTP configuration
Cloudinary configuration
```

These values are deployment configuration rather than source-code constants. The exact secret values are intentionally not included in this README.

---

# 26. Security Architecture

SEWAC applies application-level security controls to protect both administrative and citizen workflows. Administrative authentication uses JWT sessions and bcrypt password hashing, while protected API endpoints rely on Bearer-token authorization. Role-based access determines which administrative modules are available to different users.

The Helper App is also protected by authentication because it handles operational and RFID-related information. The product manual states that authorized personnel must authenticate before using the operational functionality. This prevents uncontrolled access to field-level processes that can alter important system records.

Citizen authentication introduces device-aware controls in addition to identity validation. Redis can be used to maintain temporary device and session state. Across the deployment, secrets are kept outside source control, database infrastructure is separated from application compute, and CORS and middleware provide additional request-level controls.

---


### Role Model

| Role | General Scope |
|---|---|
| Admin Layer 1 | Broad administrative access |
| Admin Layer 2 | Administrative and operational management |
| Worker | Focused operational access |

### Security Flow

```text
Request
  |
  v
Authentication
  |
  v
JWT / Session Validation
  |
  v
Role / Permission Check
  |
  v
Controller
  |
  v
Service
```

---

# 27. Inter-Application Relationship

The SEWAC applications are separate clients and services but form one connected ecosystem. The Helper App produces field-level information, the Main App provides centralized administrative monitoring, and the Citizen App exposes selected waste-management services directly to residents. Shared backend dependencies and authentication services provide the connections between these applications.

Field operations can create or update citizen and RFID information that later becomes visible to administrative users. Citizen-facing analytics and collection information can be derived from the same centralized operational data, while complaints move between citizen and administrative workflows through defined service interfaces.

This separation prevents the applications from becoming a single monolithic codebase. Each application can evolve according to its users and responsibilities while APIs, authentication, PostgreSQL, Redis, and real-time services maintain the integration boundaries.

---


```text
                     SEWAC
                       |
       +---------------+---------------+
       |               |               |
       v               v               v
   Main App        Helper App      Citizen App
       |               |               |
       v               v               v
Central Admin      Field Work      Citizen Services
       |               |               |
       +---------------+---------------+
                       |
                       v
                Shared Services
                       |
          +------------+------------+
          |            |            |
          v            v            v
      PostgreSQL     Redis     Authentication
```

The applications therefore remain independent at the interface level while participating in a common data and service ecosystem.

---

# 28. Repository-Level Structure

The repository ecosystem is organized around application responsibilities rather than a single combined frontend and backend codebase. The Main App has its web frontend and backend, the Helper App has its Flutter frontend and Node.js backend, the Citizen App has its Flutter frontend and Node.js backend, and the authentication module contains both its frontend and backend components.

Within each backend, source code is further divided into domains and infrastructure concerns. Within each Flutter application, screens, services, models, providers, core configuration, and widgets are separated according to responsibility. This arrangement makes it possible for developers to work on one feature without navigating a single oversized source tree.

The repository model also aligns with the deployment model. Independent repositories and branches can be pulled into EC2 separately, and PM2 can restart only the service that changed. This provides a practical operational boundary between development and production execution.

---


```text
SEWAC
├── Main Application
│   ├── Frontend
│   └── Backend
├── Helper Application
│   ├── Flutter Frontend
│   └── Node.js Backend
├── Citizen Application
│   ├── Flutter Frontend
│   └── Node.js Backend
└── Authentication Module
    ├── Frontend
    └── Backend
```

The repository structure mirrors the deployment architecture and keeps each major application independently maintainable.

---

# 29. Operational Design Principles

The system is designed around modularity, controlled access, managed persistence, asynchronous processing, real-time communication, and geographic context. These principles are not isolated implementation choices; they are intended to reduce coupling between components and make the system easier to operate.

Frontend applications remain responsible for presentation and user interaction, while backend services own business rules and database access. PostgreSQL remains independently managed, Redis remains externally managed, and PM2 manages application processes. This allows each infrastructure layer to have a clear operational owner and lifecycle.

The system also favors measured scaling. The deployment documentation recommends observing CPU, memory, database connections, Redis usage, API latency, telemetry rate, and data transfer before moving to a larger infrastructure tier. This avoids introducing unnecessary infrastructure while the workload remains suitable for the current deployment.

---


### Principle Summary

| Principle | Implementation |
|---|---|
| Modularity | Domain-oriented backend services and feature-oriented mobile clients |
| Separation | Frontend, API, database and infrastructure boundaries |
| Managed Persistence | Aurora PostgreSQL / RDS |
| Managed Cache | Upstash Redis |
| Real-Time Operations | Socket.IO |
| Process Supervision | PM2 |
| Geographic Context | City → Zone → Division → Ward |
| Source Control | GitHub branches |
| Controlled Access | JWT, bcrypt and role-based permissions |
| Scalable Deployment | Independent services and non-conflicting ports |

---

# 30. Production Deployment Outcome

The completed deployment establishes a repeatable cloud operating model. GitHub provides source control and the deployment source, EC2 provides persistent Linux compute, PM2 supervises Node.js services, Aurora PostgreSQL/Amazon RDS provides managed relational persistence, pgAdmin provides database administration, and Upstash Redis provides a managed asynchronous and caching dependency.

The final deployment contains five documented backend ports and supports the Helper Admin, Helper App, SEWAC Main, Authentication/CMADS, and Citizen backend services. Render is maintained as a complementary application delivery platform rather than being treated as a replacement for the AWS infrastructure foundation.

The deployment report emphasizes that production readiness is more than keeping ports online. The objective is to maintain secure, observable, cost-controlled services with isolated secrets, managed persistence, recoverable data, reliable external integrations, and a documented scaling path.

---


### Final Infrastructure Facts

| Item | Documented Deployment |
|---|---|
| AWS Region | `ap-south-2` |
| EC2 | `t3.micro` |
| Process Manager | PM2 |
| Database | Aurora PostgreSQL / Amazon RDS |
| Redis | Upstash Redis |
| Source | GitHub |
| Application Delivery | Render where applicable |
| Backend Ports | 5000, 5001, 5002, 5003, 5004 |

The deployment report describes this as a repeatable architecture rather than a one-time server setup. New application versions can be pulled from GitHub, restarted through PM2, and verified without rebuilding the managed database layer.

---

# 31. Repository Branch Reference

The completed project is divided across application-specific repositories and branches. The branch names below represent the final source-control organization for the major SEWAC applications and authentication module. These names should be used when checking out or updating the corresponding deployment workspace.

For the SEWAC Main App, the primary frontend branch is `sewac-frontend-v3`, while the backend branch is `Admin-Backend`. For the Citizen App, the frontend branch is `sewac_citizen`, while the backend branch is `citizen-app-backend`.

The authentication module uses `app-authentication` for both its frontend and backend implementation. Keeping these branches explicitly documented reduces deployment ambiguity and ensures that the intended application version is pulled into the corresponding environment.

---


| Application | Component | Branch |
|---|---|---|
| SEWAC Main App | Main Frontend | `sewac-frontend-v3` |
| SEWAC Main App | Backend | `Admin-Backend` |
| Citizen App | Frontend | `sewac_citizen` |
| Citizen App | Backend | `citizen-app-backend` |
| Authentication Module | Frontend + Backend | `app-authentication` |

These are the final branch references specified for the completed project.

---

# 32. Final Project Structure

At the system level, SEWAC consists of the Main App, Helper App, Citizen App, and shared Authentication Module. The Main App provides centralized administration, the Helper App provides field operations, and the Citizen App provides resident-facing services. The Authentication Module provides the identity and session mechanisms needed across the ecosystem.

Phase 2 is centered on field operations such as authentication, RFID range assignment, citizen lookup, household survey, RFID hardware registration, verification, and operational logging. Phase 3 is centered on citizen interaction such as authentication, waste analytics, collection history, live vehicle tracking, complaint submission, complaint tracking, and verification.

The resulting structure is intentionally layered: client applications communicate with backend services, backend services communicate with managed data and infrastructure services, and real-time communication is introduced only where the operational requirement justifies it.

---


```text
SEWAC
│
├── PHASE 1
│   └── SEWAC MAIN APP
│       ├── React / Vite
│       ├── Tailwind CSS
│       ├── Leaflet
│       ├── Socket.IO
│       └── Node.js / Express
│
├── PHASE 2
│   └── SEWAC HELPER APP
│       ├── Flutter / Dart
│       ├── Authentication
│       ├── Citizen Registration
│       ├── Digital Survey
│       ├── RFID Assignment
│       ├── RFID Hardware Registry
│       ├── Verification
│       └── Node.js / Express
│
├── PHASE 3
│   └── SEWAC CITIZEN APP
│       ├── Flutter / Dart
│       ├── Waste Analytics
│       ├── Collection History
│       ├── Live Vehicle Tracking
│       ├── Complaint Management
│       └── Node.js / Express
│
└── AUTHENTICATION MODULE
    ├── Frontend
    └── Backend
```

---

# 33. Technology and Infrastructure Summary

The frontend stack combines React, Vite, Tailwind CSS, Leaflet, Socket.IO, GSAP, Flutter, and Dart. React and Vite support the web administrative interface, Leaflet provides geographic visualization, Socket.IO supports live updates, and GSAP provides selected visual animations. Flutter and Dart provide the mobile implementation for field and citizen workflows.

The backend stack combines Node.js, Express.js, Prisma ORM, PostgreSQL, Redis, Axios, CORS, Socket.IO, node-cron, and SMTP. These technologies cover API delivery, relational persistence, caching, asynchronous processing, service communication, scheduled work, real-time updates, cross-origin requests, and email communication.

The infrastructure layer consists of AWS EC2, Aurora PostgreSQL/Amazon RDS, Upstash Redis, PM2, GitHub, Render, and pgAdmin. The final deployment report establishes that these components operate as separate concerns, allowing the system to be updated, monitored, and scaled without unnecessarily rebuilding unrelated infrastructure.

---


### Complete Stack

| Layer | Technologies |
|---|---|
| Web | React, Vite, Tailwind CSS |
| Mobile | Flutter, Dart |
| GIS | Leaflet / React Leaflet |
| Animation | GSAP |
| Real-Time | Socket.IO |
| Runtime | Node.js |
| API | Express.js |
| ORM | Prisma |
| Database | PostgreSQL |
| Cache / Async | Upstash Redis |
| HTTP | Axios |
| Cross-Origin | CORS |
| Scheduling | node-cron |
| Email | SMTP |
| Compute | AWS EC2 |
| Managed Database | Aurora PostgreSQL / Amazon RDS |
| Process Management | PM2 |
| Source Control | GitHub |
| Delivery | Render |
| Database Administration | pgAdmin |

---

# 34. Documentation Reference

This README is intended to serve as the primary technical entry point for the completed SEWAC repository ecosystem. It combines the project's functional structure with the final deployment architecture so that a developer, reviewer, maintainer, or deployment engineer can understand how the applications and services fit together.

The functional descriptions in this document are based on the supplied SEWAC Product Manual, including the documented Helper App workflows, RFID operations, survey verification, citizen complaint lifecycle, and final deliverables. The infrastructure descriptions are based on the supplied AWS deployment documentation, including the EC2, PM2, Aurora/RDS, Upstash Redis, GitHub, Render, and five-service architecture.

For implementation-level maintenance, the individual repository documentation and source code remain authoritative for exact endpoint contracts, model definitions, environment variables, and module behavior. This README should therefore be treated as the system-level architecture and project-structure reference rather than a replacement for module-specific documentation.

---


---

<div align="center">

## SEWAC

**Segregated Waste Accountability System**

**Phase 2 & Phase 3 — Completed Technical Architecture**

**Production Release — 2026**

</div>
