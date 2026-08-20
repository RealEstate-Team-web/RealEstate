# Security Guidelines

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

This document defines the minimum security requirements for the Real Estate Website project.

Every developer must follow these rules.

Goals

- Protect user accounts
- Protect personal information
- Prevent common web attacks
- Secure API endpoints
- Secure database operations
- Keep application secrets confidential

---

# 2. Authentication

Authentication verifies a user's identity.

We use:

- JWT (JSON Web Token)
- bcrypt

Never create your own authentication system.

---

# 3. Password Security

## MUST

- Hash every password using bcrypt.
- Minimum password length: 8 characters.
- Require at least:
  - one uppercase letter
  - one lowercase letter
  - one number
- Never store plain text passwords.
- Never log passwords.

Example

Correct

Password

↓

bcrypt.hash()

↓

Database

Incorrect

Password

↓

Database

---

# 4. JWT Security

JWT Secret

Store only inside

.env

Example

JWT_SECRET=your_secret_key

Never

- Hardcode JWT secrets
- Upload .env to GitHub
- Share secrets in chat

JWT Expiration

Access Token

7 days

All protected routes must verify JWT before allowing access.

---

# 5. Authorization

Authentication

"Who are you?"

Authorization

"What are you allowed to do?"

Roles

Buyer

Agent

Admin

Example

Buyer

Allowed

- Browse properties
- Save favorites
- Schedule visits
- Update own profile

Not Allowed

- Delete properties
- Manage users
- Access admin dashboard

---

Agent

Allowed

- Create properties
- Edit own properties
- Delete own properties
- Respond to inquiries
- Manage visits

Not Allowed

- Delete another agent's property
- Manage users
- Access admin settings

---

Admin

Allowed

- Manage users
- Manage agents
- Manage properties
- Manage categories
- View reports

---

# 6. Route Protection

Public Routes

- Home
- About
- Contact
- Login
- Register
- Property List
- Property Details

Protected Routes

Buyer Dashboard

Agent Dashboard

Admin Dashboard

Every protected route must verify JWT.

---

# 7. Input Validation

Never trust user input.

Validate

- Email
- Phone
- Password
- Price
- Title
- Description
- IDs

Reject

- Empty values
- Invalid email
- Negative price
- Invalid phone
- Invalid dates

---

# 8. SQL Injection Prevention

Always use parameterized queries.

Correct

SELECT * FROM users WHERE email = ?

Incorrect

SELECT * FROM users WHERE email='${email}'

Never concatenate SQL strings.

---

# 9. XSS Prevention

Never trust HTML from users.

Escape user input before displaying.

Never use dangerous HTML rendering unless absolutely necessary.

Do not allow JavaScript inside comments or messages.

---

# 10. Environment Variables

Store only in

.env

Examples

DB_HOST

DB_PORT

DB_NAME

DB_USER

DB_PASSWORD

JWT_SECRET

Never commit

.env

to GitHub.

Commit only

.env.example

---

# 11. CORS

Allow only trusted frontend origins.

Do not use unrestricted CORS in production.

Development

http://localhost:5173

Production

Only the deployed frontend domain.

---

# 12. File Upload Security

Allow only

- JPG
- JPEG
- PNG
- WEBP

Maximum file size

5 MB

Reject

- EXE
- ZIP
- JS
- PHP
- HTML

Rename uploaded files.

Never trust the original filename.

Store uploads outside the source code if possible.

---

# 13. Sensitive Data

Never return

- Password
- Password Hash
- JWT Secret
- Database Password

Example Response

Correct

{
    "id": 1,
    "name": "John",
    "email": "john@example.com"
}

Incorrect

{
    "password":"$2b$10..."
}

---

# 14. Error Messages

Never expose internal errors.

Correct

{
    "message":"Internal Server Error"
}

Incorrect

SQL syntax error near...

Stack Trace

Database Password

Server Path

---

# 15. API Security

Every protected endpoint must

- Verify JWT
- Verify user role
- Validate input
- Handle errors
- Return proper status codes

Status Codes

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

500 Internal Server Error

---

# 16. Logging

Log

- Login attempts
- Failed login attempts
- Server errors

Do Not Log

Passwords

JWT Tokens

Credit card information

Sensitive personal data

---

# 17. Rate Limiting

Protect endpoints against brute-force attacks.

Recommended

Login

Maximum 5 failed attempts within a short period.

Registration

Limit repeated requests from the same IP.

---

# 18. Ownership Validation

Users may only modify their own resources.

Buyer

Can edit only:

- Their profile
- Their favorites
- Their scheduled visits

Agent

Can edit only:

- Their own properties
- Their own profile
- Their own inquiries

Admin

Can manage all resources.

---

# 19. Git Security

Never commit

- .env
- node_modules
- uploads
- logs

Always check

git status

before committing.

Review commits before pushing.

---

# 20. Pull Request Security Checklist

Before approving a Pull Request verify:

- No hardcoded secrets
- No plain text passwords
- JWT validation implemented
- Authorization checks added
- SQL uses parameterized queries
- Input validation exists
- Error handling added
- No sensitive data returned
- No debugging code
- No unnecessary console.log()
- No commented-out code

Reject the PR if any critical security issue exists.

---

# 21. Security Checklist Before Release

Authentication tested

Authorization tested

Password hashing verified

JWT expiration verified

Protected routes tested

Input validation tested

SQL Injection prevention verified

XSS prevention verified

CORS configured

Environment variables configured

HTTPS enabled

No secrets inside repository

Database backups configured

Error handling verified

Production build tested

---

# 22. Security Principles

Always assume user input is malicious.

Validate every request.

Authorize every protected action.

Use least privilege.

Never trust the client.

Keep secrets out of source code.

Prefer secure defaults over convenience.

Security is everyone's responsibility.