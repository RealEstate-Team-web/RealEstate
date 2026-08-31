# AGENTS.md

Project-wide guidance for AI agents and developers working in this repository.

## Project

Real Estate Website — full-stack marketplace (buyers browse/visit, agents list properties, admin approves agents and manages the platform).

## Backend foundation (implemented)

The backend initial foundation is complete and feature branches can build on it:

- Express app setup in `backend/app.js` (Helmet, CORS from `CLIENT_URL`, JSON/URL-encoded parsing, Morgan)
- Entry point `backend/server.js` — validates env vars, verifies MySQL connection, then listens
- MySQL pool in `backend/config/db.config.js` (mysql2/promise) — reuse `pool`/`query` in models
- Env validation in `backend/config/env.js` — fails fast if required vars are missing
- `GET /api/health` in `backend/routes/index.js` + `health.routes.js`
- Central 404 + global error middleware (`middlewares/`)
- Copy `.env.example` → `.env` and set local MySQL credentials before running

## First, read these

- `PROGRESS.md` — implementation status (source of truth for what's done/pending)
- `Documentation/` — planning docs (API, database, wireframes, task allocation)
- `.opencode/skills/` — load the matching skill for the task (e.g. `database`, `api`, `coding-standards`)

## Stack

- Frontend: React 19 + Vite 8 (`frontend/`)
- Backend: Node.js + Express 5 (`backend/`)
- Database: MySQL via `mysql2` driver (raw SQL, no ORM)

## Commands

```bash
# Backend (from backend/)
npm run dev      # nodemon server.js
npm start        # node server.js

# Frontend (from frontend/)
npm run dev      # vite dev server
npm run build    # production build
npm run lint     # eslint
```

## Folder conventions

- Backend: `routes/` (HTTP only) → `controllers/` (req/res) → `services/` (business logic) → `models/` (SQL only)
- Frontend: `pages/`, `components/`, `services/` (API only), `hooks/`, `context/`, `utils/`, `layouts/`, `routes/`
- Files camelCase (`auth.controller.js`), components PascalCase (`PropertyCard.jsx`)

## Rules

- Read `PROGRESS.md` first; never re-scan the whole repo for status
- Use parameterized SQL, bcrypt for passwords, JWT in `.env` only — see `security-guidelines` skill
- Never commit `.env`, `node_modules`, `uploads`
- Update `PROGRESS.md` after every completed task
- Keep changes scoped to the assigned developer's files (see `file-ownership` skill)


# AI-Assisted Software Engineering Rules

## Purpose

This document defines reusable engineering rules for AI-assisted software development.

These rules apply across projects, programming languages, frameworks, databases, and architectures.

The objective is not merely to produce working code.

The objective is to produce software that is:

* Secure
* Correct
* Maintainable
* Understandable
* Testable
* Performant
* Reviewable
* Reliable
* Easy to change

AI-generated code must be treated as a starting point that requires engineering review.

---

# 1. Core Engineering Principles

## 1.1 Make the next change easier

Prefer implementations that make future changes easier.

Code should be:

* Easy to understand
* Easy to test
* Easy to debug
* Easy to modify
* Easy to review
* Explicit about important business rules
* Consistent with the existing architecture

Do not optimize only for fewer lines of code.

Do not introduce clever abstractions when a simple implementation is clearer.

## 1.2 Prefer simplicity

Prefer the simplest solution that correctly satisfies the requirements.

Avoid:

* Unnecessary abstractions
* Premature optimization
* Duplicate implementations
* Unnecessary dependencies
* Over-engineering
* Clever code that is difficult to understand

Complexity must have a reason.

---

# 2. Understand Before Changing

Before modifying code:

1. Inspect the relevant existing files.
2. Understand the current architecture.
3. Identify existing utilities, services, components, middleware, repositories, and patterns.
4. Reuse existing functionality where appropriate.
5. Identify dependencies between the files being changed.
6. Check existing tests.
7. Check existing API and database contracts.
8. Determine whether the change affects security, data integrity, performance, or business rules.

Do not guess the project's architecture when it can be inspected.

Do not rewrite unrelated code.

Do not introduce a new pattern when the project already has an established pattern that is appropriate.

---

# 3. Keep the Main Path Easy to Follow

Prefer guard clauses and early returns when they improve clarity.

Avoid unnecessary deeply nested conditionals.

Prefer:

```text
Validate
Return if invalid
Authorize
Return if unauthorized
Perform main operation
Return result
```

instead of deeply nesting the successful operation inside multiple conditions.

The main execution path should be visually obvious.

Do not mechanically eliminate all nesting. Use the structure that best communicates the domain logic.

---

# 4. Name Things by Meaning

Names must communicate intent and business meaning.

Avoid vague names such as:

* data
* result
* item
* value
* object
* temp
* thing
* info

when a more meaningful name is available.

Prefer names such as:

```text
pendingOrders
authenticatedUser
availableProducts
scheduledAppointments
failedPayments
```

instead of:

```text
data
userData
result
items
```

Function names should describe the operation they perform.

Prefer:

```text
calculateOrderTotal()
```

over:

```text
processData()
```

Use concise but meaningful names.

Maintain consistent terminology throughout the project.

---

# 5. Keep External Systems Behind Boundaries

External systems must not spread their implementation details throughout the application.

Examples include:

* Payment providers
* Email providers
* Cloud storage
* Maps APIs
* Authentication providers
* Third-party APIs
* External databases
* Messaging systems

Prefer:

```text
Application
    ↓
Application service
    ↓
Integration boundary
    ↓
External system
```

Map external data into application-specific models.

Do not make internal business logic depend directly on third-party response formats when avoidable.

If an external provider changes its API, the required adaptation should be localized to the integration boundary whenever practical.

---

# 6. Make Invalid States Harder to Represent

Validate data at trusted system boundaries.

Do not assume data from users, browsers, APIs, files, external services, environment variables, or databases is automatically valid.

Use appropriate:

* Types
* Schemas
* Enumerations
* Required fields
* Database constraints
* Domain validation
* State transition rules

Prefer precise models over making everything optional.

Represent finite domain states explicitly.

Do not allow arbitrary status values when the domain has a known set of valid states.

Prevent invalid state transitions where practical.

---

# 7. Separate Decisions From Actions

Separate business decisions from side effects whenever practical.

Business decisions include:

* Is the user authorized?
* Is the resource available?
* Is the order eligible for cancellation?
* Is registration allowed?
* Is a discount applicable?
* Should a retry occur?

Actions include:

* Database writes
* Email sending
* Notifications
* External API calls
* File uploads
* Message publishing

Prefer:

```text
Business rule
    ↓
Decision
    ↓
Side effect
```

instead of mixing all decisions and side effects into one large function.

Important business decisions should be independently testable whenever practical.

---

# 8. Security Is Mandatory

Never assume AI-generated code is secure.

Review implementations for common vulnerabilities, including:

* Injection
* SQL injection
* XSS
* CSRF where applicable
* Broken authentication
* Broken authorization
* IDOR/resource ownership vulnerabilities
* Hardcoded secrets
* Sensitive information leakage
* Unsafe file uploads
* Unsafe redirects
* Missing validation
* Insecure dependencies
* Excessive permissions
* Rate-limit requirements
* Improper error handling

Security controls must be enforced at the appropriate trusted boundary.

Frontend restrictions are not security boundaries.

---

# 9. Authentication and Authorization

Authentication determines:

```text
Who is the user?
```

Authorization determines:

```text
What is the user allowed to do?
```

Never rely on frontend state for authorization.

The following are not sufficient security controls:

* Hidden buttons
* Disabled buttons
* Frontend role checks
* Client-side route protection alone
* Client-side permission variables

Protected operations must be enforced server-side or at the appropriate trusted security boundary.

For resource-specific operations, verify ownership or permission where required.

Never trust user-supplied:

* Roles
* User IDs
* Ownership information
* Permission information

---

# 10. Database Security

Never construct SQL using string concatenation or interpolation of untrusted input.

Use parameterized queries or the secure query mechanism provided by the database library or ORM.

Validate:

* Route parameters
* Query parameters
* Request bodies
* Uploaded data

Use database constraints where appropriate.

Use transactions when multiple operations must succeed or fail atomically.

Avoid unnecessary database queries.

Do not expose raw database errors to clients.

---

# 11. Secrets Management

Never hardcode:

* Passwords
* API keys
* JWT secrets
* Database credentials
* Private keys
* Access tokens
* Encryption keys

Use the approved secret-management or environment-variable mechanism.

Never commit secrets to version control.

If a secret is exposed:

1. Revoke or rotate it.
2. Remove it from the exposed location.
3. Investigate possible exposure.
4. Update secure configuration.
5. Check repository history when appropriate.

---

# 12. Dependencies

Do not install dependencies blindly.

Before introducing a dependency:

1. Confirm that it exists.
2. Verify its source and ownership.
3. Confirm that it solves a real requirement.
4. Check maintenance activity.
5. Consider ecosystem reputation.
6. Check for known security issues where appropriate.
7. Determine whether an existing dependency already provides the required functionality.
8. Prefer the smallest reasonable dependency footprint.

Do not install a package merely because an AI agent suggested it.

---

# 13. Input Validation

Never trust client-side validation alone.

Validate data at the server or trusted boundary.

Validate:

* Type
* Format
* Length
* Range
* Required fields
* Allowed values
* Relationships between fields
* Business rules

Reject malformed and unexpected input.

Perform validation before sensitive operations or database writes.

---

# 14. Error Handling

Errors must be useful to humans and systems.

Avoid vague errors such as:

```text
Something went wrong.
```

Prefer structured application errors with predictable codes.

Example:

```json
{
  "code": "RESOURCE_NOT_FOUND",
  "message": "The requested resource was not found"
}
```

Use:

* Stable error codes
* Safe human-readable messages
* Appropriate status codes
* Useful server-side context

Never expose unnecessary:

* Stack traces
* SQL errors
* Secrets
* Tokens
* Internal paths
* Implementation details
* Sensitive information

to clients.

---

# 15. Logging and Auditability

Important security and business events should be observable.

Depending on the application, consider logging:

* Authentication events
* Authorization failures
* Administrative actions
* Important data changes
* Resource creation
* Resource deletion
* Important state transitions
* Security-related failures
* External-service failures

Logs should contain enough context to investigate failures.

Never log:

* Passwords
* Access tokens
* Secret keys
* Private keys
* Credentials

For sensitive business systems, use audit logs to record important user actions and data changes.

---

# 16. Testing

Do not consider an implementation complete because the happy path works.

Test appropriate:

## Happy paths

* Valid input
* Valid authentication
* Valid authorization
* Successful operation

## Failure paths

* Missing input
* Invalid input
* Unauthenticated request
* Unauthorized request
* Missing resource
* Duplicate operation
* Invalid state
* Database failure
* External-service failure

## Security paths

* Injection attempts
* Authorization bypass
* Resource ownership violations
* Malformed input
* Unexpected values
* Sensitive information exposure

Important business decisions should be testable independently from side effects where practical.

---

# 17. Performance Engineering

Performance matters, but do not optimize blindly.

## 17.1 Correctness before optimization

Do not sacrifice:

* Security
* Correctness
* Data integrity
* Maintainability

for speculative performance improvements.

Prefer:

```text
Correct
    ↓
Measured
    ↓
Identify bottleneck
    ↓
Optimize
    ↓
Measure again
```

Do not perform optimization solely because code "looks slow."

## 17.2 Avoid unnecessary work

Avoid:

* Repeated calculations
* Duplicate database queries
* Unnecessary API requests
* Unnecessary rendering
* Unnecessary serialization/deserialization
* Loading data that is not required
* Repeated file operations
* Unnecessary network calls

Only retrieve the data required for the operation.

## 17.3 Database performance

Pay particular attention to database performance.

Avoid:

* N+1 queries
* Full-table scans when inappropriate
* Fetching unnecessary columns
* Loading huge datasets into memory
* Missing pagination for large collections
* Repeating identical queries unnecessarily

Use:

* Appropriate indexes
* Pagination
* Efficient queries
* Selective columns
* Transactions where appropriate
* Query analysis/profiling when needed

Do not add indexes blindly. Indexes have storage and write-performance costs.

## 17.4 API performance

APIs should:

* Return only necessary data
* Support pagination for large collections
* Avoid unnecessary downstream requests
* Use appropriate caching where justified
* Avoid blocking operations when asynchronous processing is appropriate
* Handle timeouts for external services
* Avoid unnecessarily large responses

Do not introduce caching without understanding cache invalidation and consistency requirements.

## 17.5 Frontend performance

Avoid unnecessary:

* Component renders
* State updates
* Network requests
* Large bundle dependencies
* Large images
* DOM operations

Use appropriate techniques such as:

* Lazy loading
* Pagination
* Virtualization for very large lists
* Memoization when measurement justifies it
* Code splitting
* Image optimization

Do not add memoization or caching everywhere without evidence that it improves performance.

## 17.6 Memory and resource usage

Avoid unnecessarily retaining:

* Large objects
* Large datasets
* File contents
* Network responses
* Event listeners
* Timers
* Connections

Release resources when they are no longer needed.

For large data processing, prefer streaming or incremental processing when appropriate.

## 17.7 Complexity

Prefer appropriate algorithmic complexity.

When processing large datasets, consider:

* Time complexity
* Space complexity
* Database query complexity
* Network complexity

Avoid replacing a simple O(n) solution with a complicated abstraction unless there is a measurable reason.

For nested loops over large collections, consider whether indexing, hashing, batching, or another data structure can reduce complexity.

## 17.8 Performance measurement

When performance is a requirement or concern:

1. Establish a baseline.
2. Identify the bottleneck.
3. Make the smallest reasonable optimization.
4. Measure again.
5. Verify that correctness and security remain intact.

Do not claim an optimization is successful without evidence when measurement is practical.

---

# 18. Keep Changes Focused

Each change should have a clear purpose.

Prefer small, focused commits and pull requests.

Good examples:

```text
Add user authentication
```

```text
Fix property authorization
```

```text
Add event registration validation
```

Avoid combining unrelated work:

```text
Add authentication
Refactor database layer
Redesign dashboard
Change CSS
Update dependencies
Rewrite notification system
```

in a single change unless the changes are genuinely dependent.

Focused changes are easier to:

* Review
* Test
* Debug
* Revert
* Deploy
* Understand

---

# 19. Git and Pull Requests

Use feature or fix branches rather than making unrelated changes directly on the primary development branch.

Before opening a pull request:

1. Review all changed files.
2. Remove debugging code.
3. Remove unnecessary changes.
4. Run tests.
5. Run linting/type checks where applicable.
6. Review security implications.
7. Confirm no secrets were introduced.
8. Check performance implications where relevant.
9. Confirm the change matches the requested scope.

Pull requests should clearly explain:

* What changed
* Why it changed
* Important implementation decisions
* Testing performed
* Known limitations

---

# 20. AI-Specific Rules

AI is an implementation assistant, not an authority.

Before implementing a change, inspect the existing project.

AI must:

* Follow existing project conventions.
* Reuse existing abstractions where appropriate.
* Preserve existing behavior unless change is required.
* Avoid unnecessary dependencies.
* Avoid unrelated refactoring.
* Validate assumptions against the codebase.
* Consider security.
* Consider failure cases.
* Consider authorization.
* Consider data integrity.
* Consider performance.
* Add or update tests when appropriate.

AI must not:

* Invent APIs that do not exist.
* Invent database fields without checking the schema.
* Invent packages without verification.
* Assume frontend validation provides security.
* Assume user input is trusted.
* Hardcode secrets.
* Remove security controls simply to make code work.
* Rewrite unrelated files.
* Perform speculative optimization without justification.

---

# 21. Before Declaring a Task Complete

Perform a final review.

## Architecture

* Does the implementation follow the existing architecture?
* Is responsibility placed in the correct layer?
* Are external systems isolated?
* Did the change introduce unnecessary complexity?

## Maintainability

* Is the main execution path easy to follow?
* Are names meaningful?
* Are business rules obvious?
* Are decisions separated from side effects?
* Are invalid states appropriately prevented?

## Security

* Is authentication enforced where required?
* Is authorization enforced at the trusted boundary?
* Is input validated?
* Are database queries parameterized?
* Are secrets protected?
* Are sensitive errors hidden?
* Are dependencies trustworthy?

## Performance

* Does the implementation perform unnecessary work?
* Does it introduce unnecessary database queries?
* Does it fetch unnecessary data?
* Does it create N+1 queries?
* Does it require pagination?
* Does it introduce unnecessary network requests?
* Is there an obvious algorithmic or resource bottleneck?
* If optimization was performed, was it measured where practical?

## Reliability

* Are failure cases handled?
* Are database operations safe?
* Are transactions used where appropriate?
* Are external-service failures handled?
* Are resources properly released?

## Testing

* Does the happy path work?
* Are important failure cases tested?
* Are security-sensitive cases tested?
* Are performance-sensitive cases tested when appropriate?
* Do existing tests still pass?

## Scope

* Did the implementation modify only what was necessary?
* Are unrelated refactors excluded?
* Is the change focused enough for review?

Do not declare the task complete if critical checks fail.

---

# 22. Priority Order

When requirements conflict, prioritize:

```text
1. Security
2. Data integrity
3. Correctness
4. Reliability
5. Architectural consistency
6. Maintainability
7. Testability
8. Performance
9. Developer convenience
10. Implementation speed
```

Never sacrifice security or correctness for speed.

Do not sacrifice maintainability for speculative performance improvements.

---

# 23. Final Engineering Principle

The objective is not:

```text
Write more code.
```

The objective is:

```text
Write code that people can understand,
verify, change, operate, and trust.
```

AI should make development faster without lowering engineering standards.

The best implementation is not necessarily the shortest, most clever, or fastest-looking implementation.

It is the implementation that solves the problem correctly while keeping the system secure, understandable, maintainable, testable, and appropriately performant.


# Real Estate Project — Code Review Guidelines

Every Pull Request review must:
1. Check the PR against the current sprint scope and report any sprint-scope violations.
2. Check the PR against the project's documentation and report any documentation violations.
3. Continue normal code-quality and security review.

## Source of Truth

Before reviewing a Pull Request, use these documents:

1. Documentation/Sprints/CURRENT-SPRINT.md
2. The sprint document referenced by CURRENT-SPRINT.md
3. Documentation/database_redesigned.md
4. Documentation/API Design.md
5. Documentation/Coding-Standards.md
6. Documentation/Security-Guidelines.md

Project documentation takes precedence over generic assumptions.

Do not invent project requirements.

---

## Sprint Scope

The current sprint is defined by:

Documentation/Sprints/CURRENT-SPRINT.md

A Pull Request must be evaluated against the current sprint.

Classify changes as:

- Required
- Supporting
- Out of scope
- Unrelated

Do not automatically reject supporting work.

Do flag significant unrelated or future-sprint functionality.

---

## Security

Always check:

- SQL injection
- authentication bypass
- authorization bypass
- IDOR
- privilege escalation
- insecure password handling
- JWT security
- input validation
- file upload security
- secret exposure
- unsafe CORS
- XSS
- sensitive data exposure

---

## Database

Compare database changes against:

Documentation/database_redesigned.md

Check:

- normalization
- relationships
- foreign keys
- indexes
- constraints
- data types
- migrations
- nullable fields
- duplicate data

---

## API

Compare API changes against:

Documentation/API Design.md

Check:

- HTTP methods
- endpoint paths
- authentication
- authorization
- request validation
- response format
- HTTP status codes
- error handling

---

## Cloudinary

Image uploads must follow the project's Cloudinary architecture.

Expected structure:

real-estate/
├── properties/{propertyId}
├── agents/{agentId}
└── profiles/{userId}

Never expose Cloudinary secrets to the frontend.

Verify authorization before uploads.

Verify property ownership before property-image uploads.

Validate uploaded files.

---

## Final Review

Every PR review should identify:

1. Critical problems
2. Security problems
3. Database problems
4. API problems
5. Frontend problems
6. Backend problems
7. Testing gaps
8. Out-of-scope work

The Team Lead makes the final merge decision.