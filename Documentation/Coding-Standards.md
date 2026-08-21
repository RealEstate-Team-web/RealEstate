# Coding Standards

> Project: Real Estate Website
>
> Frontend: React + Vite
>
> Backend: Node.js + Express.js
>
> Database: MySQL
>
> Authentication: JWT + bcrypt

---

# 1. Purpose

This document defines the coding standards for the Real Estate Website project.

Every developer must follow these standards.

The goals are:

- Consistent code style
- Easy maintenance
- Readable code
- Secure implementation
- Scalable architecture
- Fewer merge conflicts

---

# 2. General Rules

## MUST

- Write clean, readable code.
- Keep functions small.
- Use meaningful variable names.
- Use async/await.
- Handle every possible error.
- Follow folder structure.
- Keep components reusable.
- Follow REST API conventions.

## NEVER

- Duplicate code.
- Hardcode secrets.
- Write SQL inside controllers.
- Push broken code.
- Commit .env files.
- Leave commented-out code.
- Push debugging console.log statements.

---

# 3. Folder Responsibility

## Frontend

pages/

Contains complete application pages.

Example

- Home
- Login
- Register
- Dashboard

---

components/

Reusable UI.

Examples

- Navbar
- Footer
- PropertyCard
- Button
- Sidebar

---

services/

Responsible for API communication only.

Example

auth.service.js

property.service.js

Never place business logic here.

---

hooks/

Reusable React logic.

Example

useAuth()

useFetch()

---

context/

Global application state.

Example

AuthContext

ThemeContext

---

utils/

Helper functions.

Examples

formatDate()

validators()

helpers()

---

assets/

Images

Fonts

Icons

CSS

---

layouts/

Shared page layouts.

Example

MainLayout

DashboardLayout

---

routes/

React Router configuration.

Never place business logic here.

---

## Backend

routes/

Receives HTTP requests.

Calls controllers.

Nothing else.

---

controllers/

Receives req

Returns res

Calls services

Controllers should never access the database directly.

---

services/

Contains business logic.

Services call models.

---

models/

Contains SQL queries only.

Business logic is not allowed.

---

middlewares/

Authentication

Authorization

Error handling

Validation

---

config/

Database

Application configuration

---

utils/

Helper functions

JWT generation

Pagination

Logger

---

# 4. Naming Convention

Folders

lowercase

Example

controllers

routes

services

Files

camelCase

Example

auth.controller.js

property.service.js

Variables

camelCase

Good

propertyPrice

userEmail

Bad

PropertyPrice

property_price

Constants

UPPER_CASE

JWT_SECRET

MAX_UPLOAD_SIZE

Classes

PascalCase

PropertyService

ApiError

React Components

PascalCase

Navbar.jsx

PropertyCard.jsx

Dashboard.jsx

---

# 5. React Standards

One component

One responsibility.

Bad

A component containing

Login

Register

Profile

Dashboard

Good

Separate components.

---

Use functional components only.

Never use class components.

---

Prefer hooks.

Example

useState

useEffect

useContext

---

Keep components reusable.

Example

Button

Card

Input

Modal

Instead of copying HTML everywhere.

---

Props

Pass only required props.

Avoid unnecessary prop drilling.

Use Context when data is shared globally.

---

# 6. CSS Standards

Prefer component-specific CSS.

Avoid inline styles.

Use CSS variables.

Example

--primary-color

--secondary-color

Use responsive design.

Desktop first or mobile first consistently.
