# Wireframes & Application Architecture

---

## Navigation Links Overview

### Public Pages (Guest)

* Landing Page (`/`)
* About Us (`/about`)
* Properties (`/properties`)
* Property Details (`/properties/:id`)
* Agents (`/agents`)
* Contact Us (`/contact`)
* Login (`/login`)
* Register (`/register`)
* Forgot Password (`/forgot-password`)
* Reset Password (`/reset-password`)


---

### Buyer / Tenant (Login Required)

* Dashboard (`/dashboard`)
* Browse Properties (`/properties`)
* Property Details (`/properties/:id`)
* Favorites (`/favorites`)
* Scheduled Visits (`/visits`)
* Messages (`/messages`)
* Notifications (`/notifications`)
* Profile (`/profile`)
* Settings (`/settings`)

---

### Agent (Login Required)

* Agent Dashboard (`/agent`)
* My Properties (`/agent/properties`)
* Add Property (`/agent/properties/new`)
* Edit Property (`/agent/properties/edit/:id`)
* Sold / Rented Properties (`/agent/properties/completed`)
* Visit Requests (`/agent/visits`)
* Customer Messages (`/agent/messages`)
* Analytics (`/agent/analytics`)
* Profile (`/agent/profile`)
* Settings (`/agent/settings`)

---

### Admin (Login Required)

* Dashboard (`/admin`)
* User Management (`/admin/users`)
* Agent Approval (`/admin/agents`)
* Property Management (`/admin/properties`)
* Categories (`/admin/categories`)
* Visit Management (`/admin/visits`)
* Reports (`/admin/reports`)
* Analytics (`/admin/analytics`)
* Settings (`/admin/settings`)

---

## Public Pages Specification

### 1. Landing Page (`/`)

* **Purpose:** Introduce the platform and drive conversion.
* **Sections & Features:**
* Property search bar
* Featured properties grid
* Latest properties grid
* Featured agents
* Testimonials
* Call-to-action sections



---

### 2. Properties (`/properties`)

* **Purpose:** Allow visitors to search and browse available properties.
* **Features:**
* Search bar
* Advanced filters
* Sorting options
* Grid / List view toggle
* Map view
* Pagination



---

### 3. Property Details (`/properties/:id`)

* **Purpose:** Display complete property listing details.
* **Features:**
* Image gallery
* Property overview & full description
* Amenities list
* Map location & nearby places
* Agent contact information
* Schedule visit action
* Save to favorites action
* Share property action



---

### 4. Login (`/login`)

* **Purpose:** Authenticate existing users.
* **Fields & Features:**
* Email
* Password
* Remember me toggle
* Forgot password link



---

### 5. Register (`/register`)

* **Purpose:** Create a new platform account.
* **Common Fields:**
* First Name
* Last Name
* Email
* Phone
* Password
* Confirm Password
* Role selection (Buyer / Tenant or Agent)


* **Conditional Agent Fields:**
* Agency Name
* License Number
* Experience
* Office Address
* Bio
* Profile Photo



---

## Buyer Dashboard Specification

### 1. Dashboard (`/dashboard`)

* **Purpose:** Provide a centralized overview of buyer activities.
* **Sections:**
* Welcome card
* Saved properties summary
* Upcoming visits tracking
* Recently viewed properties
* Recent searches history
* Recommended properties
* Notifications summary widget



---

### 2. Browse Properties (`/properties`)

* **Purpose:** Explore and search the platform catalog.
* **Features:**
* Search engine
* Filter options
* Sort options
* Map view toggle
* Property comparison tool



---

### 3. Favorites (`/favorites`)

* **Purpose:** Manage saved properties.
* **Features:**
* Favorites grid view
* Remove property action
* Share property action



---

### 4. Scheduled Visits (`/visits`)

* **Purpose:** Track and manage booked property viewings.
* **Fields & Actions:**
* Visit Date
* Time
* Agent details
* Status badge
* **Actions:** Cancel Visit, Reschedule Visit



---

### 5. Messages (`/messages`)

* **Purpose:** direct communication interface with agents.
* **Features:**
* Chat history list
* Send message thread
* Real-time replies



---

### 6. Notifications (`/notifications`)

* **Purpose:** Display account-related alerts.
* **Event Types:**
* Visit Approved
* Visit Cancelled
* Price Drop
* New Property Match
* Agent Reply



---

### 7. Profile (`/profile`)

* **Purpose:** Manage user credentials and details.
* **Fields & Features:**
* Update profile photo
* Name
* Email
* Phone
* Change password section



---

## Agent Dashboard Specification

### 1. Dashboard (`/agent`)

* **Purpose:** Provide an overview of property performance and customer engagements.
* **Dashboard Cards:**
* Total Properties
* Active Listings
* Sold / Rented
* Scheduled Visits
* Unread Messages


* **Charts & Metrics:**
* Property views trend
* Monthly inquiries volume



---

### 2. My Properties (`/agent/properties`)

* **Purpose:** Manage property listing repository.
* **Features & Actions:**
* Property list view
* Search & Filter listings
* Edit listing
* Delete listing
* Duplicate listing



---

### 3. Add Property (`/agent/properties/new`)

* **Purpose:** Create new property listings.
* **Form Steps & Fields:**
* Basic Information
* Pricing structure
* Location details
* Property attributes & amenities
* Upload images & video media
* Interactive map location picker
* Listing preview
* **Submission Note:** Listings are published and visible to buyers immediately after submission — no administrator approval is required.



---

### 4. Visit Requests (`/agent/visits`)

* **Purpose:** Process incoming property visit bookings.
* **Actions:**
* Approve Visit
* Reject Visit
* Reschedule Visit



---

### 5. Messages (`/agent/messages`)

* **Purpose:** Manage communication threads with prospective buyers.

---

### 6. Analytics (`/agent/analytics`)

* **Purpose:** Monitor listing activity and performance metrics.
* **Tracked Metrics:**
* Property views
* Favorites count
* Inquiry counts
* Completed visits count
* Top performing property designation



---

## Admin Dashboard Specification

### 1. Dashboard (`/admin`)

* **Purpose:** Overview of system-wide health and activity.
* **Dashboard Cards:**
* Total Users count
* Total Agents count
* Pending Agents count
* Total Properties count
* Scheduled Visits count



---

### 2. Agent Approval (`/admin/agents`)

* **Purpose:** Verify agent verification requests.
* **Actions:**
* View applicant details
* Approve account
* Reject account
* Suspend account



---

### 3. Property Management (`/admin/properties`)

* **Purpose:** Manage property listings across the system.
* **Actions:**
* Edit Listing details
* Delete Listing
* Feature Property flag



---

### 4. User Management (`/admin/users`)

* **Purpose:** System user accounts administration.
* **Actions:**
* View profile
* Edit user details
* Suspend account
* Activate account
* Delete user account



---

### 5. Reports (`/admin/reports`)

* **Purpose:** Generate platform reporting metrics.
* **Report Modules:**
* User reports
* Agent performance reports
* Property listing reports
* Visit logs reports



---

### 6. Analytics (`/admin/analytics`)

* **Purpose:** Platform-wide growth visualization.
* **Charts:**
* User growth timeline
* Property listing additions
* Overall property views
* Visit activity statistics



---

## System Navigation Flow

```text
Guest
│
├── Home Page
├── Browse Properties
├── Property Details
├── Login
└── Register
      │
      ▼
Choose Role
│
├── Buyer / Tenant
│     │
│     ▼
│   Buyer Dashboard
│
└── Agent
      │
      ▼
Complete Agent Profile
      │
      ▼
Pending Admin Approval
      │
      ▼
Agent Dashboard

Admin
│
├── Dashboard
├── Review Agents
├── Review Properties
├── Manage Users
└── Analytics

```