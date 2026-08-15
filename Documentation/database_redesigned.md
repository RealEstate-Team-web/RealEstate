# Real Estate Website — Database Design

## 1. Overview

The Real Estate Website uses **MySQL** as the primary relational database.

This redesign is based on the existing project requirements and the original database documentation. The schema is normalized to reduce duplicated data, separate authentication credentials from user profile data, store property images as relational records instead of JSON, and keep temporary password-reset data outside the `users` table.

### Main goals

- Reduce data redundancy
- Follow practical relational database normalization
- Separate authentication credentials from user profile data
- Support buyer, agent, and admin roles
- Maintain referential integrity with foreign keys
- Support multiple images per property
- Support favorites, visits, messages, and notifications
- Support secure password reset using standalone reset-token records
- Keep the schema maintainable for a multi-developer team
- Leave room for future expansion

---

# 2. Design Principles

## 2.1 Separate User Profile and Authentication

The `users` table stores common identity/profile information.

Password credentials are stored separately in `user_credentials`.

Temporary password-reset credentials are stored separately in `password_reset_tokens`.

This avoids putting authentication state and temporary reset state directly into the main user record.

## 2.2 Avoid JSON for Relational Collections

The original design stored:

- `properties.images` as JSON
- `properties.amenities` as JSON

These are replaced with relational tables:

- `property_images`
- `amenities`
- `property_amenities`

This makes searching, updating, indexing, ordering, and deleting individual records easier.

## 2.3 Use Foreign Keys

Relationships between users, properties, images, favorites, bookings, messages, notifications, and authentication records are enforced using foreign keys.

## 2.4 Keep Temporary Authentication Data Separate

Password-reset tokens are temporary security credentials and should not be stored in `users`.

Only a secure hash of the reset token is stored.

---

# 3. Entity Relationship Overview

```text
users
  │
  ├────────────── user_credentials
  │
  ├────────────── password_reset_tokens
  │
  ├────────────── agent_profiles
  │
  ├────────────── favorites ───────── properties
  │                                  │
  │                                  ├──────── property_images
  │                                  │
  │                                  └──────── property_amenities ───── amenities
  │
  ├────────────── visit_bookings ───── properties
  │
  ├────────────── messages ─────────── properties
  │
  └────────────── notifications

property_categories
  │
  └────────────── properties
```

---

# 4. Tables

## Table 1 — users

### Purpose

Stores common information for every platform user.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| first_name | VARCHAR(100) | NOT NULL |
| last_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(190) | UNIQUE, NOT NULL |
| phone | VARCHAR(20) | UNIQUE, NULL |
| role | ENUM('buyer','agent','admin') | NOT NULL, DEFAULT 'buyer' |
| status | ENUM('active','suspended') | NOT NULL, DEFAULT 'active' |
| profile_image_url | VARCHAR(500) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Notes

- No password is stored here.
- `profile_image_url` stores the Cloudinary URL for a profile image when one exists.
- Password credentials are stored in `user_credentials`.

---

# 5. Table 2 — user_credentials

### Purpose

Stores authentication credentials separately from the user profile.

### Fields

| Field | Type | Constraints |
|---|---|---|
| user_id | BIGINT UNSIGNED | PK, FK → users(id) |
| password_hash | VARCHAR(255) | NOT NULL |
| password_changed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Relationship

```text
users (1)
   │
   │
   └──────── (1) user_credentials
```

### Notes

- Store only a strong password hash, such as a bcrypt hash.
- Never store plaintext passwords.
- `user_id` is both the primary key and foreign key, enforcing one credentials record per user.

---

# 6. Table 3 — password_reset_tokens

### Purpose

Stores temporary password-reset credentials.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| token_hash | VARCHAR(255) | UNIQUE, NOT NULL |
| expires_at | DATETIME | NOT NULL |
| used_at | DATETIME | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Relationship

```text
users (1)
   │
   │
   └──────── (many) password_reset_tokens
```

### Password reset flow

```text
User
  ↓
Forgot Password
  ↓
Enter email
  ↓
Backend generates cryptographically secure random token
  ↓
Hash token
  ↓
Store token_hash + expires_at
  ↓
Send raw token in reset link
  ↓
User opens reset link
  ↓
Backend hashes submitted token
  ↓
Find matching unused and unexpired record
  ↓
Change password
  ↓
Set used_at
  ↓
Reset token cannot be reused
```

### Security rules

- Never store the raw reset token.
- Reset tokens must have a short expiration period.
- A used token must never be accepted again.
- Old reset tokens should be invalidated when appropriate.
- Do not log reset tokens.
- Do not use a normal login JWT as a password-reset credential.

---

# 7. Table 4 — agent_profiles

### Purpose

Stores information specific to agents.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | UNIQUE, NOT NULL, FK → users(id) |
| agency_name | VARCHAR(150) | NULL |
| license_number | VARCHAR(50) | UNIQUE, NULL |
| experience_years | INT UNSIGNED | NULL |
| specialization | VARCHAR(100) | NULL |
| office_address | VARCHAR(255) | NULL |
| city | VARCHAR(100) | NULL |
| bio | TEXT | NULL |
| verification_status | ENUM('pending','approved','rejected') | DEFAULT 'pending' |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Relationship

```text
users (1)
   │
   └──────── (0..1) agent_profiles
```

Only users whose role is `agent` should have an agent profile.

---

# 8. Table 5 — property_categories

### Purpose

Stores reusable property categories.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Examples

```text
Apartment
Villa
House
Commercial
Land
```

---

# 9. Table 6 — properties

### Purpose

Stores real estate listings.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| agent_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| category_id | BIGINT UNSIGNED | NOT NULL, FK → property_categories(id) |
| title | VARCHAR(200) | NOT NULL |
| description | TEXT | NOT NULL |
| listing_type | ENUM('sale','rent') | NOT NULL |
| price | DECIMAL(14,2) | NOT NULL |
| bedrooms | UNSIGNED INT | NULL |
| bathrooms | UNSIGNED INT | NULL |
| parking_spaces | UNSIGNED INT | NULL |
| area | DECIMAL(10,2) | NULL |
| country | VARCHAR(100) | NOT NULL |
| city | VARCHAR(100) | NOT NULL |
| address | VARCHAR(255) | NULL |
| latitude | DECIMAL(10,7) | NULL |
| longitude | DECIMAL(10,7) | NULL |
| status | ENUM('available','sold','rented') | DEFAULT 'available' |
| views | UNSIGNED INT | DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Relationship

```text
users (agent)
   │
   └──────── (many) properties

property_categories (1)
   │
   └──────── (many) properties
```

### Notes

- `agent_id` references `users.id`.
- Application/business logic must verify that the referenced user has role `agent`.
- `images` and `amenities` are not stored as JSON in this table.

---

# 10. Table 7 — property_images

### Purpose

Stores individual images belonging to a property.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| property_id | BIGINT UNSIGNED | NOT NULL, FK → properties(id) |
| image_url | VARCHAR(500) | NOT NULL |
| public_id | VARCHAR(255) | NOT NULL |
| sort_order | UNSIGNED INT | DEFAULT 0 |
| is_cover | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Relationship

```text
properties (1)
   │
   └──────── (many) property_images
```

### Cloudinary

Cloudinary stores the actual image.

MySQL stores:

```text
image_url
public_id
```

The `public_id` is required so the backend can delete or manage the Cloudinary asset later.

### Upload flow

```text
Agent selects image
       ↓
React
       ↓
Express backend
       ↓
Validate file
       ↓
Cloudinary
       ↓
Cloudinary returns URL + public_id
       ↓
MySQL property_images
```

---

# 11. Table 8 — amenities

### Purpose

Stores reusable property amenities.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | UNIQUE, NOT NULL |
| description | VARCHAR(255) | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Examples

```text
Swimming Pool
Parking
Gym
Security
Garden
Internet
Air Conditioning
```

---

# 12. Table 9 — property_amenities

### Purpose

Junction table implementing the many-to-many relationship between properties and amenities.

### Fields

| Field | Type | Constraints |
|---|---|---|
| property_id | BIGINT UNSIGNED | NOT NULL, FK → properties(id) |
| amenity_id | BIGINT UNSIGNED | NOT NULL, FK → amenities(id) |

### Primary Key

```text
PRIMARY KEY (property_id, amenity_id)
```

### Relationship

```text
properties
    │
    └──── property_amenities ──── amenities
```

A property can have many amenities, and an amenity can belong to many properties.

---

# 13. Table 10 — favorites

### Purpose

Stores properties saved by users.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| property_id | BIGINT UNSIGNED | NOT NULL, FK → properties(id) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Constraint

```text
UNIQUE (user_id, property_id)
```

This prevents the same user from saving the same property multiple times.

### Relationship

```text
users
   │
   └──── favorites ──── properties
```

---

# 14. Table 11 — visit_bookings

### Purpose

Stores property visit requests and their status.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| property_id | BIGINT UNSIGNED | NOT NULL, FK → properties(id) |
| buyer_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| agent_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| visit_date | DATE | NOT NULL |
| visit_time | TIME | NOT NULL |
| status | ENUM('pending','approved','cancelled','completed') | DEFAULT 'pending' |
| notes | TEXT | NULL |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP |

### Relationship

```text
users (buyer)
     │
     └──── visit_bookings ──── properties
                                  │
                                  └──── users (agent)
```

### Validation

- Buyer must be a valid user with buyer access.
- Agent must be the agent responsible for the property.
- Visit date/time must not be in the past when creating a booking.
- Cancelled bookings cannot be approved.
- Completed bookings cannot be changed back to pending.

---

# 15. Table 12 — messages

### Purpose

Stores messages between users, optionally associated with a property.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| sender_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| receiver_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| property_id | BIGINT UNSIGNED | NULL, FK → properties(id) |
| message | TEXT | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Relationship

```text
users (sender)
      │
      └──── messages ──── users (receiver)
                 │
                 └──── properties (optional)
```

A property reference is optional because users may have a conversation that is not associated with a specific listing.

---

# 16. Table 13 — notifications

### Purpose

Stores notifications for users.

### Fields

| Field | Type | Constraints |
|---|---|---|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | NOT NULL, FK → users(id) |
| title | VARCHAR(200) | NOT NULL |
| message | TEXT | NOT NULL |
| type | VARCHAR(50) | NOT NULL |
| is_read | BOOLEAN | DEFAULT FALSE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### Relationship

```text
users (1)
   │
   └──────── (many) notifications
```

---

# 17. Complete Relationship Map

```text
                                  ┌──────────────────────┐
                                  │  property_categories │
                                  └──────────┬───────────┘
                                             │ 1
                                             │
                                             │ many
┌──────────────┐       ┌────────────────────▼──────────────────┐
│    users     │       │              properties               │
└──────┬───────┘       └───────┬────────────┬───────────┬──────┘
       │                        │            │           │
       │ 1                      │ 1          │ 1         │ 1
       │                        │            │           │
       │ 1                      │ many       │ many      │ many
       ▼                        ▼            ▼           ▼
┌──────────────┐        ┌─────────────┐ ┌──────────┐ ┌───────────────┐
│    user_     │        │  property_  │ │favorites │ │property_      │
│ credentials  │        │   images    │ └──────────┘ │amenities      │
└──────────────┘        └─────────────┘               └───────┬───────┘
                                                              │
                                                              │ many
                                                              │
                                                              │ many
                                                              ▼
                                                        ┌──────────┐
                                                        │ amenities│
                                                        └──────────┘

┌──────────────┐
│    users     │
└──────┬───────┘
       │
       ├────────────── agent_profiles
       │
       ├────────────── password_reset_tokens
       │
       ├────────────── visit_bookings ───────── properties
       │
       ├────────────── messages ───────────────── properties
       │
       └────────────── notifications
```

---

# 18. Cardinality Summary

| Relationship | Cardinality |
|---|---|
| users → user_credentials | 1 : 1 |
| users → password_reset_tokens | 1 : many |
| users → agent_profiles | 1 : 0..1 |
| users → properties | 1 : many |
| property_categories → properties | 1 : many |
| properties → property_images | 1 : many |
| properties ↔ amenities | many : many |
| users ↔ properties through favorites | many : many |
| users → visit_bookings as buyer | 1 : many |
| users → visit_bookings as agent | 1 : many |
| users → messages as sender | 1 : many |
| users → messages as receiver | 1 : many |
| properties → messages | 1 : many |
| users → notifications | 1 : many |

---

# 19. Indexes

Recommended indexes:

```sql
CREATE INDEX idx_users_role
    ON users(role);

CREATE INDEX idx_users_status
    ON users(status);

CREATE INDEX idx_agent_profiles_verification
    ON agent_profiles(verification_status);

CREATE INDEX idx_properties_agent
    ON properties(agent_id);

CREATE INDEX idx_properties_category
    ON properties(category_id);

CREATE INDEX idx_properties_city
    ON properties(city);

CREATE INDEX idx_properties_listing_type
    ON properties(listing_type);

CREATE INDEX idx_properties_price
    ON properties(price);

CREATE INDEX idx_properties_status
    ON properties(status);

CREATE INDEX idx_property_images_property
    ON property_images(property_id);

CREATE INDEX idx_property_amenities_amenity
    ON property_amenities(amenity_id);

CREATE INDEX idx_favorites_user
    ON favorites(user_id);

CREATE INDEX idx_favorites_property
    ON favorites(property_id);

CREATE INDEX idx_visit_bookings_property
    ON visit_bookings(property_id);

CREATE INDEX idx_visit_bookings_buyer
    ON visit_bookings(buyer_id);

CREATE INDEX idx_visit_bookings_agent
    ON visit_bookings(agent_id);

CREATE INDEX idx_visit_bookings_date
    ON visit_bookings(visit_date);

CREATE INDEX idx_messages_sender
    ON messages(sender_id);

CREATE INDEX idx_messages_receiver
    ON messages(receiver_id);

CREATE INDEX idx_messages_property
    ON messages(property_id);

CREATE INDEX idx_notifications_user
    ON notifications(user_id);

CREATE INDEX idx_notifications_read
    ON notifications(user_id, is_read);

CREATE INDEX idx_password_reset_user
    ON password_reset_tokens(user_id);

CREATE INDEX idx_password_reset_expires
    ON password_reset_tokens(expires_at);
```

---

# 20. Foreign Key Rules

Recommended behavior:

### User deletion

Authentication and user-specific temporary records can use:

```sql
ON DELETE CASCADE
```

where appropriate, especially:

- `user_credentials`
- `password_reset_tokens`
- `agent_profiles`
- `favorites`
- `notifications`

For business records such as properties, bookings, and messages, deletion behavior should be chosen carefully because historical business data may need to remain.

### Property deletion

For dependent records such as:

- `property_images`
- `property_amenities`
- `favorites`

`ON DELETE CASCADE` can be appropriate.

For bookings and messages, consider whether the application should preserve historical records instead of physically deleting them.

---

# 21. Data Validation Rules

## Users

- Email must be unique.
- Email must be normalized before storage.
- Password must be hashed using bcrypt.
- Password hash must never be returned by API responses.
- Role must be validated server-side.
- Suspended users must not be allowed to perform protected operations.

## Agent profiles

- Only users with role `agent` should have agent profiles.
- License numbers should be unique when provided.
- Only approved agents should be allowed to publish properties if that is the platform policy.

## Properties

- Price must be greater than zero.
- Property must belong to an agent.
- Category must exist.
- Newly listed properties are immediately visible to buyers (no approval step).
- Latitude and longitude must be valid when provided.
- Views must never become negative.

## Favorites

- A user cannot save the same property more than once.
- A user cannot favorite an invalid property.

## Visit bookings

- Visit date/time cannot be in the past.
- Buyer must be authorized to create the booking.
- Agent must be associated with the selected property.
- Invalid status transitions must be rejected.

## Password reset

- Reset token must be cryptographically random.
- Only the token hash is stored.
- Token must expire.
- Token must be one-time use.
- Used tokens must be rejected.
- Reset tokens must not be logged.
- New passwords must satisfy the application's password policy.

---

# 22. Password Reset: Token vs OTP

The project should choose one password-reset mechanism unless requirements require both.

## Option A — Reset link

```text
Forgot Password
      ↓
Enter email
      ↓
Secure reset token generated
      ↓
Email reset link
      ↓
User clicks link
      ↓
Reset Password page
      ↓
New password
      ↓
Token invalidated
```

Uses:

```text
password_reset_tokens
```

## Option B — OTP

If the product requires a 6-digit OTP:

```text
Forgot Password
      ↓
Enter email
      ↓
Generate OTP
      ↓
Send OTP
      ↓
Verify OTP
      ↓
Reset Password page
      ↓
New password
```

For an OTP implementation, use a dedicated table such as:

```text
password_reset_otps
```

rather than putting OTP fields into `users`.

OTP records should include:

```text
id
user_id
otp_hash
expires_at
attempts
verified_at
created_at
```

A six-digit OTP must have:

- short expiration
- strict attempt limits
- rate limiting
- one-time use
- hashed storage
- no OTP logging

---

# 23. Cloudinary Image Architecture

Images are divided into two categories.

## Static frontend images

Examples:

- Landing hero image
- About page image
- Logo
- UI illustrations

These can be stored in:

```text
frontend/public/images/
```

and committed to Git when appropriately sized and optimized.

## Dynamic user-uploaded images

Examples:

- Property images
- Property gallery
- Agent profile image
- Buyer profile image

These should be stored in Cloudinary.

The database stores metadata such as:

```text
image_url
public_id
```

### Upload architecture

```text
Agent
  ↓
React image picker
  ↓
Express API
  ↓
Multer / file validation
  ↓
Cloudinary
  ↓
image_url + public_id
  ↓
MySQL
```

Never store the Cloudinary API secret in the frontend.

---

# 24. Normalization Improvements From the Previous Design

The previous design contained several areas that could create unnecessary redundancy or make relational operations harder.

### Password

Previous:

```text
users.password
```

Redesigned:

```text
users
   │
   └── user_credentials.password_hash
```

### Password reset

Previous:

```text
Not explicitly modeled
```

Redesigned:

```text
password_reset_tokens
```

### Property images

Previous:

```text
properties.images JSON
properties.coverImage
```

Redesigned:

```text
property_images
├── image_url
├── public_id
├── sort_order
└── is_cover
```

### Amenities

Previous:

```text
properties.amenities JSON
```

Redesigned:

```text
amenities
      ▲
      │
property_amenities
      │
      ▼
properties
```

### Property type

Previous:

```text
properties.propertyType ENUM(...)
```

Redesigned:

```text
property_categories
       │
       ▼
properties.category_id
```

This makes categories easier to manage without changing the table definition when the business adds another category.

---

# 25. Team Migration Ownership

Because this is a multi-developer project, database changes must be coordinated.

### Authentication developer

Owns migrations for:

```text
user_credentials
password_reset_tokens
```

and authentication-related changes to:

```text
users
```

### Property developer

Owns:

```text
property_categories
properties
property_images
amenities
property_amenities
```

### Buyer dashboard developer

Owns:

```text
favorites
visit_bookings
```

### Agent/Admin developer

Owns agent/admin-specific features and related schema changes.

### Important rule

Developers should **not independently modify the same shared migration without communicating with the team**.

Every schema change must be:

```text
Design
  ↓
Migration
  ↓
Local testing
  ↓
Commit
  ↓
Pull Request
  ↓
Review
  ↓
Merge into develop
```

---

# 26. Naming Conventions

## Tables

Use lowercase `snake_case`:

```text
users
user_credentials
password_reset_tokens
agent_profiles
properties
property_images
property_categories
amenities
property_amenities
favorites
visit_bookings
messages
notifications
```

## Columns

Use lowercase `snake_case`:

```text
user_id
property_id
created_at
updated_at
password_hash
reset_token_hash
expires_at
```

## Primary keys

Use:

```text
id
```

with:

```text
BIGINT UNSIGNED AUTO_INCREMENT
```

## Foreign keys

Use:

```text
<referenced_table_singular>_id
```

Examples:

```text
user_id
property_id
agent_id
category_id
```

---

# 27. Security Requirements

- Passwords must be hashed using bcrypt.
- Password hashes must never be exposed in API responses.
- Reset tokens must be random and hashed before database storage.
- Reset tokens must expire and become invalid after use.
- OTPs, if implemented, must be hashed and rate-limited.
- Database credentials must be stored in environment variables.
- SQL queries must use parameterized queries/prepared statements.
- Users must be authorized server-side before accessing protected resources.
- Cloudinary secrets must remain on the backend.
- File uploads must validate size and allowed file types.
- Foreign keys must enforce ownership and relationship integrity.

---

# 28. Final Schema

```text
users
│
├── user_credentials
├── password_reset_tokens
├── agent_profiles
├── favorites
├── visit_bookings
├── messages
└── notifications

property_categories
│
└── properties
      │
      ├── property_images
      ├── property_amenities ─── amenities
      ├── favorites
      ├── visit_bookings
      └── messages
```

This is the baseline relational schema for the Real Estate Website. Any new feature that requires persistent data should be reviewed against the existing relationships and normalization rules before adding a new column or table.
