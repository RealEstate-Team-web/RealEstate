# API Design

## Overview

The Real Estate Website exposes a RESTful API for communication between the React frontend and the Node.js/Express backend.

Base URL

```
http://localhost:5000/api
```

Production

```
https://your-domain.com/api
```

---

# API Standards

## Request Format

```
Content-Type: application/json
Authorization: Bearer <JWT Token>
```

---

## Naming Convention

API request/response JSON uses **camelCase** (`firstName`, `userId`, `propertyId`). Database columns use **snake_case** (`first_name`, `user_id`, `property_id`). The backend maps between the two — JSON payloads stay camelCase, SQL uses snake_case.

---

## Success Response

```json
{
    "success": true,
    "message": "Request completed successfully",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Validation failed",
    "errors": []
}
```

---

# Authentication APIs

Purpose

- Register users
- Login
- Logout
- Password management
- JWT Authentication

---

## Register

POST

```
/api/auth/register
```

For

- Buyer Registration
- Agent Registration

Request

```json
{
    "firstName":"John",
    "lastName":"Doe",
    "email":"john@gmail.com",
    "phone":"0911111111",
    "password":"password123",
    "role":"buyer"
}
```

Response

```json
{
    "success":true,
    "message":"Account created successfully."
}
```

---

## Register Agent

POST

```
/api/auth/register-agent
```

Request

```json
{
    "firstName":"John",
    "lastName":"Doe",
    "email":"agent@gmail.com",
    "password":"password123",
    "agencyName":"Dream Homes",
    "licenseNumber":"AG123456",
    "experience":5
}
```

Response

```json
{
    "success":true,
    "message":"Registration submitted. Waiting for admin approval."
}
```

---

## Login

POST

```
/api/auth/login
```

---

## Logout

POST

```
/api/auth/logout
```

---

## Current User

GET

```
/api/auth/me
```

---

## Change Password

PUT

```
/api/auth/change-password
```

---

## Forgot Password

POST

```
/api/auth/forgot-password
```

---

## Reset Password

POST

```
/api/auth/reset-password
```

---

# Property APIs

Purpose

Manage property listings.

---

## Get All Properties

GET

```
/api/properties
```

Query Parameters

```
page

limit

city

categoryId

listingType

minPrice

maxPrice

bedrooms

bathrooms

sort
```

For

- Browse Properties
- Home Page

---

## Get Single Property

GET

```
/api/properties/:id
```

For

- Property Details Page

---

## Create Property

POST

```
/api/properties
```

Permission

Agent Only

---

## Update Property

PUT

```
/api/properties/:id
```

Permission

Agent Owner

---

## Delete Property

DELETE

```
/api/properties/:id
```

Permission

Agent Owner

---

## My Properties

GET

```
/api/properties/my-properties
```

Permission

Agent

---

## Upload Property Images

POST

```
/api/properties/:id/images
```

Permission

Agent Owner

Upload

- `multipart/form-data`, field `images` (one or more files)
- Allowed types: JPG, PNG, WebP
- Files are validated on the backend, uploaded to Cloudinary, then metadata is stored in `property_images`: `image_url`, `public_id`, `sort_order`, `is_cover`.

Response

```json
{
    "success": true,
    "data": [
        {
            "imageUrl": "https://res.cloudinary.com/...",
            "publicId": "properties/abc123",
            "sortOrder": 1,
            "isCover": true
        }
    ]
}
```

---

# Favorites APIs

Purpose

Manage saved properties.

---

## Get Favorites

GET

```
/api/favorites
```

---

## Add Favorite

POST

```
/api/favorites
```

Request

```json
{
    "propertyId":"12345"
}
```

---

## Remove Favorite

DELETE

```
/api/favorites/:propertyId
```

---

# Visit Booking APIs

Purpose

Schedule property visits.

---

## Book Visit

POST

```
/api/visits
```

---

## My Visits

GET

```
/api/visits
```

---

## Cancel Visit

PATCH

```
/api/visits/:id/cancel
```

---

## Reschedule Visit

PATCH

```
/api/visits/:id/reschedule
```

---

# Messages APIs

Purpose

Communication between buyers and agents.

---

## Get Conversations

GET

```
/api/messages
```

---

## Get Conversation

GET

```
/api/messages/:conversationId
```

---

## Send Message

POST

```
/api/messages
```

---

# Notification APIs

Purpose

User notifications.

---

## Get Notifications

GET

```
/api/notifications
```

---

## Mark Notification Read

PATCH

```
/api/notifications/:id/read
```

---

# Inquiry / Contact APIs

Purpose

Contact and inquiry messages sent by visitors or buyers to agents.

---

## Submit Inquiry

POST

```
/api/inquiries
```

For

- Contact Us Page
- Property Details "Ask a Question" Form

Request

```json
{
    "propertyId": "12345",
    "name": "John Doe",
    "email": "john@gmail.com",
    "phone": "0911111111",
    "message": "Is this property still available?"
}
```

---

## Get My Inquiries

GET

```
/api/inquiries
```

Permission

Buyer — returns inquiries sent by the logged-in user.

---

## Get Inquiry Thread Details

GET

```text
/api/inquiries/:id
```

Permission

Buyer or Agent — returns detailed inquiry with full message thread history.

---

## Send Message / Reply to Inquiry

POST

```text
/api/inquiries/:id/messages
```

Permission

Buyer or Agent — sends a follow-up message within the active inquiry thread.

Request

```json
{
    "message": "Yes, I would like to schedule a viewing this Saturday."
}
```

---

## Get Agent Inquiries

GET

```
/api/agent/inquiries
```

Permission

Agent — returns inquiries received for the agent's properties.

---

## Mark Inquiry Read

PATCH

```
/api/inquiries/:id/read
```

Permission

Agent

---

# Agent APIs

Purpose

Agent dashboard functionality.

---

## Dashboard Statistics

GET

```
/api/agent/dashboard
```

---

## Get Agent Profile

GET

```
/api/agent/profile
```

Permission

Agent (authenticated, `role = agent`).

Request

None.

Success response — `200 OK`

```
{
  "success": true,
  "message": "Agent profile retrieved",
  "data": {
    "profile": {
      "id": 21,
      "firstName": "S2",
      "lastName": "Tester",
      "email": "s2test.1788595216@test.com",
      "phone": "+251911000199",
      "role": "agent",
      "userStatus": "active",
      "profileImageUrl": null,
      "memberSince": "2026-09-05T08:00:16.000Z",
      "agency": "Test Realty Updated",
      "licenseNumber": "LIC-TEST9",
      "experienceYears": 1,
      "specialization": "Residential",
      "officeAddress": "Bole, Addis Ababa",
      "city": "Addis Ababa",
      "bio": "Updated bio for testing the agent profile API.",
      "verificationStatus": "pending"
    }
  }
}
```

Error responses

- `401` — authentication required (missing or invalid token).
- `403` — insufficient permissions (non-agent).
- `404` — agent profile not found for the authenticated user.

---

## Update Agent Profile

PUT

```
/api/agent/profile
```

Permission

Agent (authenticated, `role = agent`).

Request fields (all optional; undefined fields are preserved)

```
{
  "firstName": "S2",
  "lastName": "Tester",
  "phone": "+251911000199",
  "agencyName": "Test Realty Updated",
  "specialization": "Residential",
  "officeAddress": "Bole, Addis Ababa",
  "city": "Addis Ababa",
  "bio": "Updated bio for testing the agent profile API."
}
```

- `firstName`, `lastName`, `phone` — non-null, trimmed string; `firstName`/`lastName` at most 100 chars, `phone` must match `^\+?[0-9]{7,15}$`. Null/blank identity values are rejected or preserved, never written as `NULL`.
- `agencyName` — at most 150 chars; `specialization` — at most 100 chars; `officeAddress` — at most 255 chars; `city` — at most 100 chars; `bio` — at most 1000 chars. Blank optional profile fields clear the stored value.
- Unknown fields are rejected.

Success response — `200 OK`

```
{
  "success": true,
  "message": "Agent profile updated",
  "data": { "profile": { /* same shape as Get Agent Profile */ } }
}
```

Error responses

- `400` — validation failed. Body: `{ "message": "Validation failed", "errors": ["firstName must be a non-empty string", ...] }`.
- `401` — authentication required (missing or invalid token).
- `403` — insufficient permissions (non-agent).
- `404` — agent profile not found for the authenticated user.

---

## Analytics

GET

```
/api/agent/analytics
```

---

## Visit Requests

GET

```
/api/agent/visit-requests
```

---

## Approve Visit

PATCH

```
/api/agent/visits/:id/approve
```

---

## Reject Visit

PATCH

```
/api/agent/visits/:id/reject
```

---

# Admin APIs

Purpose

Platform administration.

---

## Dashboard

GET

```
/api/admin/dashboard
```

---

## Get Users

GET

```
/api/admin/users
```

---

## Get Agents

GET

```
/api/admin/agents
```

---

## Approve Agent

PATCH

```
/api/admin/agents/:id/approve
```

---

## Reject Agent

PATCH

```
/api/admin/agents/:id/reject
```

---

## Manage Categories

GET

```
/api/admin/categories
```

POST

```
/api/admin/categories
```

PUT

```
/api/admin/categories/:id
```

DELETE

```
/api/admin/categories/:id
```

---

# Profile APIs

Purpose

Manage user profile.

---

## View Profile

GET

```
/api/profile
```

---

## Update Profile

PUT

```
/api/profile
```

---

## Upload Profile Image

POST

```
/api/profile/image
```

Upload

- `multipart/form-data`, field `image`
- Validated on the backend, uploaded to Cloudinary; the returned URL is saved to `users.profile_image_url`.

---

# Search APIs

## Search Properties

GET

```
/api/search
```

Example

```
/api/search?city=Addis%20Ababa&listingType=sale&bedrooms=3&minPrice=100000&maxPrice=500000
```

---

# Category APIs

## Get Categories

GET

```
/api/categories
```

Purpose

Public list of property categories used in filter dropdowns.

Permission

Public

---

# API Authorization Matrix

| Endpoint | Guest | Buyer | Agent | Admin |
|-----------|:----:|:-----:|:-----:|:-----:|
| Register | ✅ | ✅ | ✅ | ❌ |
| Login | ✅ | ✅ | ✅ | ✅ |
| Browse Properties | ✅ | ✅ | ✅ | ✅ |
| Property Details | ✅ | ✅ | ✅ | ✅ |
| Browse Categories | ✅ | ✅ | ✅ | ✅ |
| Favorites | ❌ | ✅ | ❌ | ❌ |
| Book Visit | ❌ | ✅ | ❌ | ❌ |
| Submit Inquiry | ✅ | ✅ | ❌ | ❌ |
| Messages | ❌ | ✅ | ✅ | ❌ |
| Add Property | ❌ | ❌ | ✅ | ❌ |
| Edit Own Property | ❌ | ❌ | ✅ | ❌ |
| Approve Agent | ❌ | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ❌ | ✅ |

---

# API Development Order

## Phase 1

- Authentication
- Users
- Roles

## Phase 2

- Properties
- Categories
- Image Upload

## Phase 3

- Favorites
- Property Search
- Property Filters
- Public Categories

## Phase 4

- Visit Booking
- Messages
- Notifications
- Inquiry / Contact

## Phase 5

- Agent Dashboard
- Admin Dashboard
- Analytics