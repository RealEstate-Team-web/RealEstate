# 👨‍💻 Team Task Allocation

## Project

**Real Estate Website**

---

# 👥 Team Structure

| Developer | Role | Responsibility |
|-----------|------|----------------|
| Developer 1 | Team Lead / Full Stack | Authentication, Project Setup, Integration, Code Review |
| Developer 2 | Full Stack | Landing Page Module (Header, Footer, Testimonials, Property List) |
| Developer 3 | Full Stack | Buyer/Tenant Module |
| Developer 4 | Full Stack | Agent Module (Property Creation & Management) |

---

# 📅 Phase 1 — Planning

**Everyone participates**

## Tasks

- [ ] Review project requirements
- [ ] Review UI wireframes
- [ ] Review database schema
- [ ] Review API documentation
- [ ] Review folder structure
- [ ] Review coding standards
- [ ] Setup local development environment
- [ ] Clone GitHub repository

---

# 📅 Phase 2 — Project Setup

## 👨‍💻 Developer 1 (Team Lead)

### Project Initialization

- [ ] Create GitHub Repository
- [ ] Configure Branch Protection
- [ ] Create GitHub Issues
- [ ] Create GitHub Project Board
- [ ] Initialize React Project
- [ ] Initialize Express Project
- [ ] Configure PostgreSQL
- [ ] Configure Prisma ORM
- [ ] Create project folder structure
- [ ] Configure ESLint
- [ ] Configure Prettier
- [ ] Configure Husky (Optional)
- [ ] Configure Environment Variables
- [ ] Configure GitHub Actions (CI)
- [ ] Create README.md
- [ ] Prepare Docker (Optional)

---

# 👨‍💻 Developer 1 Mila
# Authentication Module

## Backend

- [ ] Register API
- [ ] Login API
- [ ] Logout API
- [ ] Forgot Password
- [ ] Reset Password
- [ ] Change Password
- [ ] JWT Authentication
- [ ] Password Hashing
- [ ] Authentication Middleware
- [ ] Role Authorization Middleware

## Frontend

- [ ] Login Page
- [ ] Register Page
- [ ] Forgot Password Page
- [ ] Reset Password Page

## Database

- [ ] Users Table

# Admin Dashboard Module

## Backend

### Admin

- [ ] Dashboard API
- [ ] Manage Users API
- [ ] Manage Agents API
- [ ] Approve Agent API
- [ ] Reject Agent API
- [ ] Reports API
- [ ] Analytics API

## Frontend

### Admin

- [ ] Dashboard
- [ ] User Management
- [ ] Agent Management
- [ ] Reports
- [ ] Analytics
- [ ] Settings

---

# 👨‍💻 Developer 2  shanbel dires

# Landing Page Module

## Backend

- [ ] Get All Properties API (public list, read-only)
- [ ] Get Single Property API (public details, read-only)
- [ ] Search API
- [ ] Filter API
- [ ] Sort API
- [ ] Pagination

## Frontend

- [ ] Header
- [ ] Footer
- [ ] Testimonials
- [ ] Landing Page
- [ ] Property Listing Page
- [ ] Property Details Page
- [ ] Property Card Component
- [ ] Search Component
- [ ] Filter Component
- [ ] Sort Component
- [ ] Pagination Component
- [ ] Map View
- [ ] Property Gallery

## Database

- none — reads `properties`, `property_categories` (owned by Dev 4)

---

# 👨‍💻 Developer 3 Beamlak 

# Buyer / Tenant Module

## Backend

- [ ] Favorite Property API
- [ ] Remove Favorite API
- [ ] Schedule Visit API
- [ ] Cancel Visit API
- [ ] Reschedule Visit API
- [ ] Buyer Notification API

## Frontend

- [ ] Buyer Dashboard
- [ ] Favorites Page
- [ ] Scheduled Visits
- [ ] Visit Booking Form
- [ ] Notifications Page
- [ ] Recommended Properties
- [ ] Recently Viewed
- [ ] Recent Searches

## Database

- [ ] Favorites
- [ ] Visit Bookings
- [ ] Notifications

---

# 👨‍💻 Developer 4  Termuze


# Agent Module

## Backend

### Agent

- [ ] Create Property API
- [ ] Update Property API
- [ ] Delete Property API
- [ ] My Properties API
- [ ] Property Analytics API
- [ ] Image Upload
- [ ] Property Validation
- [ ] Visit Request API
- [ ] Approve Visit API
- [ ] Reject Visit API



## Frontend

### Agent

- [ ] My Properties
- [ ] Add Property
- [ ] Edit Property
- [ ] Visit Requests
- [ ] Analytics
- [ ] Agent Profile



## Database

- [ ] Properties
- [ ] Property Images
- [ ] Categories
- [ ] Amenities

---

# 🤝 Shared Responsibilities

All developers must:

- [ ] Follow coding standards
- [ ] Write reusable components
- [ ] Validate inputs
- [ ] Handle errors properly
- [ ] Write API documentation
- [ ] Test their own features
- [ ] Resolve merge conflicts
- [ ] Review teammate pull requests
- [ ] Update documentation

---

# 🌿 Git Workflow

Each developer creates feature branches.

```text
main

develop

feature/auth

feature/property

feature/buyer

feature/admin
```

Never push directly to **main** or **develop**.

Workflow:

```text
Create Feature Branch
        │
        ▼
Write Code
        │
        ▼
Commit Changes
        │
        ▼
Push Feature Branch
        │
        ▼
Open Pull Request
        │
        ▼
Code Review
        │
        ▼
Fix Review Comments
        │
        ▼
Merge into develop
```

---

# 📋 Pull Request Checklist

Before opening a Pull Request:

- [ ] Code compiles successfully
- [ ] No lint errors
- [ ] No console errors
- [ ] Database migrations updated (if needed)
- [ ] API documented
- [ ] UI tested
- [ ] Responsive on mobile
- [ ] No hardcoded secrets
- [ ] No merge conflicts
- [ ] Self-reviewed changes

---

# 🚀 Sprint Workflow

## Monday

- Sprint Planning
- Assign GitHub Issues

## Tuesday – Thursday

- Feature Development
- Daily communication

## Friday

- Open Pull Requests
- Code Review
- Merge approved changes into `develop`

## Saturday

- Integration Testing
- Bug Fixing
- Prepare next sprint

---

# 📊 Definition of Done

A task is complete only if:

- [ ] Feature works as expected
- [ ] UI is responsive
- [ ] API returns correct responses
- [ ] Validation is implemented
- [ ] Error handling is complete
- [ ] Database changes are migrated
- [ ] Pull Request is approved
- [ ] Merged into `develop`
- [ ] Documentation updated