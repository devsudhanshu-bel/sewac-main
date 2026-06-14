# CMADS Development Journal

## Project Overview

**Project Name:** CMADS (Contextual Multi-Factor Adaptive Defense System)

**Objective:**
Develop a prototype adaptive authentication framework that secures a privileged administrator account using identity authentication, device trust verification, behavioral authentication, risk scoring, decision engine logic, audit logging, and dashboard monitoring.

**Technology Stack:**

- Node.js
- Express.js
- PostgreSQL
- AWS RDS
- JWT Authentication
- React (planned)
- AWS EC2 (planned)

---

# Day 1

## Goal

Establish the authentication foundation for CMADS by implementing secure administrator login, database connectivity, JWT authentication, protected routes, and audit logging.

---

## Tasks Completed

### 1. AWS RDS Database Connectivity

Configured the backend application to connect with a PostgreSQL database hosted on AWS RDS.

Created:

```text
backend/src/config/db.js
```

Verified connectivity using a test script and successfully established communication between Node.js and the cloud database.

### Outcome

Database connection successfully established.

---

### 2. Initial Authentication Architecture Review

Originally the project followed a multi-user architecture consisting of:

- Users
- Roles
- Protected routes
- Role middleware

The project requirements were revised to support a single privileged administrator.

### Architectural Decision

Refactored the authentication system from:

```text
Multi-User Authentication
```

to:

```text
Single Administrator Security Platform
```

This simplified future implementation of device trust and behavioral authentication.

---

### 3. Database Refactoring

Renamed the authentication table:

```sql
users
```

to:

```sql
admins
```

Removed:

```sql
role
```

column because role-based access control is no longer required.

### Outcome

Database schema aligned with revised CMADS architecture.

---

### 4. Administrator Registration

Implemented administrator registration endpoint.

Endpoint:

```http
POST /api/auth/register
```

Features:

- Input validation
- Email validation
- Duplicate account prevention
- Password hashing

### Outcome

Administrator accounts can be created securely.

---

### 5. Password Hashing

Integrated bcrypt.

Implemented:

```javascript
bcrypt.hash()
```

Passwords are stored as hashes instead of plaintext.

### Security Benefit

Protection against credential exposure if database records are compromised.

---

### 6. Administrator Login

Implemented:

```http
POST /api/auth/login
```

Authentication flow:

```text
Email
↓
Password Verification
↓
JWT Generation
↓
Authentication Success
```

### Outcome

Administrator identity verification successfully implemented.

---

### 7. JWT Authentication

Integrated:

```javascript
jsonwebtoken
```

Generated JWT tokens after successful login.

Payload contains:

```json
{
  "adminId": 1,
  "email": "admin@example.com"
}
```

### Outcome

Stateless session management successfully implemented.

---

### 8. Authentication Middleware

Implemented:

```text
authMiddleware.js
```

Purpose:

- Validate JWT
- Extract administrator identity
- Protect secured endpoints

### Outcome

Protected APIs can now verify authenticated administrators.

---

### 9. Security Profile Endpoint

Created:

```http
GET /api/security/profile
```

Returns information about the authenticated administrator.

### Outcome

Protected API functionality verified.

---

### 10. Audit Logging Framework

Created:

```sql
audit_logs
```

table.

Created:

```text
auditService.js
```

to centralize audit event creation.

### Logged Events

- LOGIN_SUCCESS
- LOGIN_FAILED

### Outcome

Security events are now persisted for monitoring and investigation.

---

## Issues Encountered

### Database Access Error

Encountered:

```text
no pg_hba.conf entry for host
```

### Root Cause

AWS RDS security configuration did not initially allow incoming connections from the development environment.

### Resolution

Updated AWS RDS networking and security group configuration.

### Outcome

Database connection successfully restored.

---

### Middleware Error

Encountered:

```text
Cannot read properties of undefined (reading 'status')
```

### Root Cause

Legacy role middleware was still referenced after architectural refactoring.

### Resolution

Removed role-based components and migrated to JWT-based authentication middleware.

### Outcome

Server startup issue resolved.

---

## Security Features Implemented

- Password hashing
- JWT authentication
- Protected routes
- Login auditing
- Failed login tracking
- Administrator-only architecture

---

## Deliverables Completed

- AWS RDS Connected
- PostgreSQL Integrated
- Administrator Authentication
- JWT Authentication
- Authentication Middleware
- Security Profile Endpoint
- Audit Logging

---

## Day 1 Status

Completed Successfully

Estimated Progress:

35% Overall Project Completion

---

## Preparation for Day 2

Planned Components:

- Device Registry
- Device Fingerprinting
- Device Trust Scoring
- Known Device Detection
- Unknown Device Detection
- Device Audit Events

The Day 1 authentication foundation is ready for Device Trust Layer implementation.