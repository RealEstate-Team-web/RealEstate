# Sprint Plan — Phases 3–7 (Trello-Ready)

> Planning reference for the Real Estate Website team. Maps the GSD roadmap Phases 3–7 to Trello cards, owners, labels, and branches. No code — this is a task/planning artifact only.

## Context

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** Local MySQL per developer, `mysql2` raw SQL
- **Project management:** Trello
- **Git flow:** feature branch → PR → merge into `develop`

### Team allocation

| Developer | Responsibility |
|---|---|
| Developer 1 / Team Lead | Authentication + Admin Dashboard + integration/code review |
| Developer 2 | Landing Page + Header/Footer + Property Marketplace (public) |
| Developer 3 | Buyer/Tenant Dashboard |
| Developer 4 | Agent Dashboard + Agent Property Management |

### Trello board structure (shared)

**Lists:** Backlog · Sprint / To Do · In Progress · Code Review · Testing · Blocked · Done

**Labels:** AUTH · ADMIN · PROPERTY · BUYER · AGENT · FRONTEND · BACKEND · DATABASE · SECURITY · UI · TESTING

**Card movement:** To Do → In Progress (dev starts) → Code Review (PR opened) → Testing (merged) → Done (integration passes). Blocked when genuinely stuck, with a reason.

---

# Phase 3 — Property Marketplace

**Owner lead:** Developer 2 + Developer 4
**Depends on:** Phase 2 (Auth)
**Requirements:** PROP-01..05, UI-03, UI-04

## Sprint Goal

Public users can browse, search, filter, sort, and view property listings; agents can create/update/delete their own listings and upload images; landing, listing, and details pages exist.

---

### Card P3-01 — [PROPERTY] Create Property Database Schema

**Owner:** Developer 4
**Labels:** PROPERTY, DATABASE, BACKEND
**Branch:** `feature/property-schema`

**Objective**
Create the property/category database foundation matching the approved DB design.

**Requirements**
- Migrations: `property_categories`, `properties`, `property_images`, `amenities`, `property_amenities`.
- Foreign keys and indexes.
- Constraint enforcement.
- No `properties.images` / `properties.amenities` JSON columns (relational tables instead).

**Acceptance criteria**
- Migrations run successfully on clean local MySQL.
- Tables/relations match `database_redesigned.md`.
- FKs and indexes are valid.

**Checklist**
- [ ] Review approved schema
- [ ] Write migrations
- [ ] Relationships / FKs / indexes
- [ ] Clean migration test
- [ ] Documentation/card notes updated

---

### Card P3-02 — [PROPERTY] Build Public Property API

**Owner:** Developer 2
**Labels:** PROPERTY, BACKEND
**Branch:** `feature/property-public-api`

**Objective**
Expose read-only public property endpoints.

**Requirements**
- `GET /api/properties` (pagination, search by city, filter by category/listing type/price/bedrooms/bathrooms, sort).
- `GET /api/properties/:id` (images, amenities, owning agent).
- `GET /api/categories` (browseable categories).

**Acceptance criteria**
- Paginated list works.
- Filters/search/sort work.
- Details include images, amenities, agent info.
- Categories endpoint returns options.
- camelCase JSON ↔ snake_case SQL mapping.

**Checklist**
- [ ] Property model
- [ ] Category model
- [ ] Property controller/service
- [ ] Category controller/service
- [ ] Routes wired
- [ ] Manual/API testing
- [ ] Documentation/card notes updated

---

### Card P3-03 — [AGENT] Implement Property CRUD API

**Owner:** Developer 4
**Labels:** AGENT, PROPERTY, BACKEND, SECURITY
**Branch:** `feature/agent-property-api`

**Objective**
Allow agents to manage their own listings.

**Requirements**
- Create property API.
- Update own property API.
- Delete own property API.
- My properties API.
- Ownership enforcement (only own listings modifiable).

**Acceptance criteria**
- Agent can create/view/update/delete own listings.
- Another agent cannot modify someone else's listing (403).
- Requires authentication + agent role.

**Checklist**
- [ ] Create API
- [ ] Update API
- [ ] Delete API
- [ ] My properties API
- [ ] Role/ownership middleware
- [ ] Manual/API testing

---

### Card P3-04 — [AGENT] Implement Property Image Upload

**Owner:** Developer 4
**Labels:** AGENT, PROPERTY, BACKEND, FRONTEND
**Branch:** `feature/property-upload`

**Objective**
Let agents upload property images to Cloudinary with sort order and cover designation.

**Requirements**
- JPG/PNG/WebP, ≤5MB.
- Cloudinary upload.
- Store metadata in `property_images`.
- Cover image flag.
- Sort order.

**Acceptance criteria**
- Valid images upload and are stored.
- Invalid/oversized rejected (400/413, not 500).
- Cover + sort order persisted.
- Uploads tied to the agent's own property.

**Checklist**
- [ ] Upload endpoint wiring
- [ ] Cloudinary integration
- [ ] Validation
- [ ] Metadata persistence
- [ ] Cover/sort handling
- [ ] Error handling (400/413)
- [ ] Manual testing

---

### Card P3-05 — [PROPERTY] Build Public Pages (Landing, Listing, Details)

**Owner:** Developer 2
**Labels:** PROPERTY, FRONTEND, UI
**Branch:** `feature/property-public-pages`

**Objective**
Build the public-facing property pages from approved UI designs.

**Requirements**
- Landing page (hero, search entry, featured cards, CTAs).
- Listing page (search/filter/sort, pagination, property cards).
- Details page (gallery, amenities, agent info).
- Header/Footer integration.

**Acceptance criteria**
- Pages render against public API.
- Search entry routes to listing.
- Filters/pagination work.
- Details shows gallery + amenities + agent.
- Responsive on desktop/mobile.

**Checklist**
- [ ] Landing page
- [ ] Search bar
- [ ] Filter sidebar
- [ ] Sort controls
- [ ] Pagination
- [ ] Property cards
- [ ] Details page / gallery
- [ ] Loading/empty/error states
- [ ] Responsive testing

---

### Card P3-06 — [AGENT] Build Add/Edit Property Forms

**Owner:** Developer 4
**Labels:** AGENT, PROPERTY, FRONTEND, UI
**Branch:** `feature/agent-property-forms`

**Objective**
Provide forms for agents to create/edit properties including image upload UI.

**Requirements**
- Add Property form.
- Edit Property form.
- Image upload field (cover + order).
- Category/amenities selection.
- Validation + error states.

**Acceptance criteria**
- Agent can create a property from the form.
- Agent can edit an existing own property.
- Image upload works in the form.
- Validation errors shown.
- Responsive.

**Checklist**
- [ ] Add form
- [ ] Edit form
- [ ] Upload field
- [ ] Category/amenity selection
- [ ] Validation/error states
- [ ] Responsive testing

---

# Phase 4 — Buyer Experience

**Owner lead:** Developer 3
**Depends on:** Phase 3 (Property)
**Requirements:** BUY-01..03, UI-05

## Sprint Goal

Buyers can save favorite properties, book/cancel/reschedule visits, submit inquiries, and manage it all from a buyer dashboard.

---

### Card P4-01 — [BUYER] Create Buyer Database Tables

**Owner:** Developer 3
**Labels:** BUYER, DATABASE, BACKEND
**Branch:** `feature/buyer-schema`

**Objective**
Create buyer-related tables.

**Requirements**
- Migrations: `favorites`, `visit_bookings`, `inquiries`.
- FKs to users + properties.
- Status fields for visits/inquiries.

**Acceptance criteria**
- Migrations run cleanly.
- FKs valid.
- Schema matches `database_redesigned.md`.

**Checklist**
- [ ] Favorites table
- [ ] Visit bookings table
- [ ] Inquiries table
- [ ] FKs/indexes
- [ ] Clean migration test

---

### Card P4-02 — [BUYER] Implement Favorites API + UI

**Owner:** Developer 3
**Labels:** BUYER, BACKEND, FRONTEND
**Branch:** `feature/buyer-favorites`

**Objective**
Allow buyers to save, list, and remove favorite properties.

**Requirements**
- Save favorite API.
- Remove favorite API.
- List favorites API.
- Favorites page + favorite toggle on property cards/details.

**Acceptance criteria**
- Buyer can favorite/unfavorite a property.
- Duplicate favorite prevented.
- Buyer sees own favorites only.
- Auth required.

**Checklist**
- [ ] Save API
- [ ] Remove API
- [ ] List API
- [ ] Favorites page
- [ ] Toggle UI
- [ ] Authorization checks
- [ ] Manual testing

---

### Card P4-03 — [BUYER] Implement Visit Booking API + UI

**Owner:** Developer 3
**Labels:** BUYER, BACKEND, FRONTEND, DATABASE
**Branch:** `feature/buyer-visits`

**Objective**
Allow buyers to book, cancel, and reschedule visits.

**Requirements**
- Book visit API.
- Cancel visit API.
- Reschedule visit API.
- Scheduled visits page + booking form.

**Acceptance criteria**
- Buyer can book/view/cancel/reschedule own visits.
- Status field updates.
- Auth required; own-visits-only.

**Checklist**
- [ ] Book API
- [ ] Cancel API
- [ ] Reschedule API
- [ ] Scheduled visits page
- [ ] Booking form
- [ ] Authorization checks
- [ ] Manual testing

---

### Card P4-04 — [BUYER] Implement Property Inquiries

**Owner:** Developer 3 (coordinate Developer 4 for agent side)
**Labels:** BUYER, BACKEND, FRONTEND, DATABASE
**Branch:** `feature/buyer-inquiries`

**Objective**
Allow users to submit property inquiries; owning agent can view and mark read.

**Requirements**
- Submit inquiry API.
- Inquiries linked to buyer + property + owning agent.
- Agent view + mark-read (agent side).

**Acceptance criteria**
- User can submit an inquiry.
- Data is linked correctly.
- Owning agent can view and mark read.
- Auth required; no cross-user access.

**Checklist**
- [ ] Submit API
- [ ] Inquiry model
- [ ] Agent view/mark-read
- [ ] Authorization checks
- [ ] Manual testing

---

### Card P4-05 — [BUYER] Build Buyer Dashboard Pages

**Owner:** Developer 3
**Labels:** BUYER, FRONTEND, UI
**Branch:** `feature/buyer-dashboard`

**Objective**
Build the buyer dashboard UI.

**Requirements**
- Dashboard layout (protected route).
- Favorites section.
- Scheduled visits with status.
- Notifications placeholder (v2).
- Sidebar/navigation.
- Responsive.

**Acceptance criteria**
- Dashboard shows favorites + visits.
- Notifications placeholder renders.
- Protected + responsive.

**Checklist**
- [ ] Dashboard layout
- [ ] Sidebar
- [ ] Favorites section
- [ ] Visits section
- [ ] Notifications placeholder
- [ ] Responsive testing

---

# Phase 5 — Agent Dashboard

**Owner lead:** Developer 4
**Depends on:** Phase 4 (Buyer)
**Requirements:** AGENT-01, UI-06

## Sprint Goal

Agents can monitor their business — dashboard stats, own listings, and visit requests they can approve or reject.

---

### Card P5-01 — [AGENT] Build Agent Dashboard API

**Owner:** Developer 4
**Labels:** AGENT, BACKEND
**Branch:** `feature/agent-dashboard-api`

**Objective**
Provide agent dashboard statistics and my-properties data.

**Requirements**
- Dashboard stats API (listings, visits, inquiries).
- My properties API.

**Acceptance criteria**
- Stats summarize the agent's data.
- My properties returns the agent's listings.
- Auth + agent role required.

**Checklist**
- [ ] Stats API
- [ ] My properties API
- [ ] Role guard
- [ ] Manual testing

---

### Card P5-02 — [AGENT] Implement Visit Request Approval

**Owner:** Developer 4 (coordinate Developer 3)
**Labels:** AGENT, BUYER, BACKEND, FRONTEND
**Branch:** `feature/agent-visit-requests`

**Objective**
Allow agents to approve/reject visit requests for their properties.

**Requirements**
- List visit requests for agent's properties.
- Approve API.
- Reject API.
- Agent visit requests page.
- Buyer sees updated status.

**Acceptance criteria**
- Agent can view requests for own properties only.
- Approve/reject updates status.
- Buyer sees updated visit status.

**Checklist**
- [ ] List requests API
- [ ] Approve API
- [ ] Reject API
- [ ] Visit requests page
- [ ] Ownership checks
- [ ] Buyer status update check

---

### Card P5-03 — [AGENT] Build Agent Profile + Analytics Pages

**Owner:** Developer 4
**Labels:** AGENT, FRONTEND, UI
**Branch:** `feature/agent-profile-analytics`

**Objective**
Complete agent dashboard supporting pages.

**Requirements**
- Agent profile page (retrieval/update).
- Verification status display.
- Analytics page.
- Messages/inquiries page.

**Acceptance criteria**
- Agent can view/update own profile.
- Verification status shown.
- Analytics renders summary safely.
- Pages protected + responsive.

**Checklist**
- [ ] Profile API/page
- [ ] Verification status display
- [ ] Analytics page
- [ ] Messages/inquiries page
- [ ] Protected routes
- [ ] Responsive testing

---

# Phase 6 — Admin Dashboard

**Owner lead:** Developer 1 / Team Lead
**Depends on:** Phase 2 (Auth) + Phase 3 (Property)
**Requirements:** ADMIN-01, ADMIN-02, UI-07

## Sprint Goal

Admins can oversee the platform — dashboard overview, user management, agent approvals, and property category management.

---

### Card P6-01 — [ADMIN] Build Admin Dashboard Foundation

**Owner:** Developer 1
**Labels:** ADMIN, FRONTEND, BACKEND, SECURITY, UI
**Branch:** `feature/admin-dashboard`

**Objective**
Create the protected admin dashboard foundation.

**Requirements**
- Admin-only route + layout + sidebar.
- Dashboard API (users/agents/categories overview).
- Overview cards.
- Unauthorized state.

**Acceptance criteria**
- Only admins access admin dashboard.
- Non-admins see blocked/unauthorized state.
- Dashboard loads overview data.
- Responsive.

**Checklist**
- [ ] Admin route
- [ ] Admin layout/sidebar
- [ ] Dashboard API
- [ ] Overview cards
- [ ] Role guard
- [ ] Unauthorized state
- [ ] Responsive testing

---

### Card P6-02 — [ADMIN] Implement User Management

**Owner:** Developer 1
**Labels:** ADMIN, BACKEND, FRONTEND, SECURITY
**Branch:** `feature/admin-users`

**Objective**
Let admins view users and suspend/activate accounts.

**Requirements**
- List users API.
- Update status API.
- Users page with status badges + confirmations.
- Admin-only enforcement.

**Acceptance criteria**
- Admin can view users.
- Admin can suspend/activate.
- Suspended users cannot authenticate/access protected routes.
- Non-admins blocked from user APIs.

**Checklist**
- [ ] Users API
- [ ] Status update API
- [ ] Users page
- [ ] Status badges
- [ ] Confirm UI
- [ ] Role guard
- [ ] Manual testing

---

### Card P6-03 — [ADMIN] Implement Agent Approval

**Owner:** Developer 1
**Labels:** ADMIN, BACKEND, FRONTEND, SECURITY
**Branch:** `feature/admin-agent-approval`

**Objective**
Let admins approve/reject pending agents.

**Requirements**
- Pending agents API.
- Approve agent API.
- Reject agent API.
- Agents page.

**Acceptance criteria**
- Admin can view pending agents.
- Approve/reject updates `verification_status`.
- Approved agent gains agent access.
- Admin-only.

**Checklist**
- [ ] Pending agents API
- [ ] Approve API
- [ ] Reject API
- [ ] Agents page
- [ ] Status/error states
- [ ] Manual testing

---

### Card P6-04 — [ADMIN] Implement Category Management

**Owner:** Developer 1
**Labels:** ADMIN, PROPERTY, BACKEND, FRONTEND
**Branch:** `feature/admin-categories`

**Objective**
Let admins manage property categories.

**Requirements**
- Category create/update/delete API.
- Categories page.
- Changes appear in public filters.

**Acceptance criteria**
- Admin can create/edit/delete categories.
- Public category filters reflect changes.
- Admin-only.

**Checklist**
- [ ] CRUD APIs
- [ ] Categories page
- [ ] Public filter sync
- [ ] Error states
- [ ] Manual testing

---

### Card P6-05 — [ADMIN] Build Reports and Analytics

**Owner:** Developer 1
**Labels:** ADMIN, FRONTEND, BACKEND, UI
**Branch:** `feature/admin-reports-analytics`

**Objective**
Add admin reporting/analytics views.

**Requirements**
- Analytics API (counts: users, agents, properties, visits).
- Reports page.
- Analytics page.
- Loading/error states.

**Acceptance criteria**
- Admin can view platform metrics.
- Reports/analytics pages render safely.
- Non-admins blocked.
- Responsive.

**Checklist**
- [ ] Analytics API
- [ ] Reports page
- [ ] Analytics page
- [ ] Loading/error states
- [ ] Role guard

---

# Phase 7 — Quality & Hardening

**Owner lead:** Developer 1 + all
**Depends on:** Phase 2 (Auth) + Phase 3 (Property)
**Requirements:** Q-01, Q-03

## Sprint Goal

Automated tests cover core backend flows and the repository is verified secret-free.

---

### Card P7-01 — [TESTING] Add Backend Test Infrastructure

**Owner:** Developer 1
**Labels:** TESTING, BACKEND
**Branch:** `feature/test-infrastructure`

**Objective**
Set up the backend test runner and config.

**Requirements**
- Test runner (vitest) + config.
- `npm test` script.
- Shared fixtures/setup (DB connection, truncate helper).

**Acceptance criteria**
- `npm test` runs.
- Test config committed.
- Test DB connection works.

**Checklist**
- [ ] Runner installed/config
- [ ] npm test script
- [ ] Setup/fixtures
- [ ] Sample passing test

---

### Card P7-02 — [TESTING] Add Auth Endpoint Tests

**Owner:** Developer 1
**Labels:** TESTING, AUTH, BACKEND
**Branch:** `feature/auth-tests`

**Objective**
Cover auth endpoints with automated tests.

**Requirements**
- Register (buyer + agent), login, logout, `/me`, change/reset password tests.

**Acceptance criteria**
- Core auth flows covered and green.
- Suspended-user + invalid-token cases covered.

**Checklist**
- [ ] Register tests
- [ ] Login tests
- [ ] Logout/me tests
- [ ] Change/reset password tests
- [ ] Negative cases

---

### Card P7-03 — [TESTING] Add Property Endpoint Tests

**Owner:** Developer 2 + Developer 4
**Labels:** TESTING, PROPERTY, BACKEND
**Branch:** `feature/property-tests`

**Objective**
Cover property endpoints with automated tests.

**Requirements**
- Browse/filter/details tests.
- Agent CRUD + ownership tests.
- Image upload tests.

**Acceptance criteria**
- Core property flows covered and green.
- Ownership/authorization cases covered.

**Checklist**
- [ ] Browse/filter tests
- [ ] Details tests
- [ ] Agent CRUD tests
- [ ] Upload tests
- [ ] Ownership cases

---

### Card P7-04 — [SECURITY] Run Secrets and Ignore Audit

**Owner:** Developer 1 + all
**Labels:** SECURITY, TESTING
**Branch:** `feature/security-audit`

**Objective**
Verify the repo is secret-free and generated files are ignored.

**Requirements**
- Confirm `.env`, `.env.production`, `node_modules`, `uploads` untracked/ignored.
- No secrets in git history.
- Guard against future commits.

**Acceptance criteria**
- Audit passes with no tracked secrets.
- `.gitignore` correct.

**Checklist**
- [ ] Ignore audit
- [ ] Git-history secrets scan
- [ ] Guardrail notes

---

### Card P7-05 — [TESTING] Final Integration Testing

**Owner:** All (led by Developer 1)
**Labels:** TESTING
**Branch:** `feature/integration-hardening`

**Objective**
Validate the integrated MVP and fix cross-feature issues.

**Requirements**
- E2E manual tests: auth, property, buyer, agent, admin.
- Responsive pass.
- Bug fixes.

**Acceptance criteria**
- Main user flows work end-to-end.
- Major pages responsive.
- Known blockers documented/fixed.

**Checklist**
- [ ] Auth E2E
- [ ] Property E2E
- [ ] Buyer E2E
- [ ] Agent E2E
- [ ] Admin E2E
- [ ] Responsive pass
- [ ] Bug-fix cards created

---

# Sprint Mapping (recommended)

| Sprint | Focus |
|---|---|
| Sprint 1 | Auth foundation + property schema/API foundation + dashboard shells |
| Sprint 2 | Phase 3 Property Marketplace + start Phase 6 Admin |
| Sprint 3 | Phase 4 Buyer + Phase 5 Agent + continue Phase 6 Admin |
| Sprint 4 | Phase 7 Quality & Hardening + final integration |

# Key Dependencies

| Dependency | Reason |
|---|---|
| Phase 2 → 3–6 | Protected routes, roles, identity required |
| Property schema → Buyer/Agent | Favorites/visits/inquiries/listings need `properties` |
| Buyer visits → Agent visit approval | Agent approval changes buyer visit status |
| Agent registration → Admin agent approval | Admin acts on pending `agent_profiles` |
| Categories → Admin category mgmt | Admin category CRUD affects public filters |
| Phase 2 + 3 → Phase 7 | Tests need the endpoints to exist |

# Trello Creation Notes

- Put Phase 3 cards in `Sprint / To Do` (next sprint); Phase 4–7 in `Backlog`.
- Add labels exactly as listed.
- Add branch name to card description.
- Add each checklist item as a Trello checklist item.
- Do not move to `Done` until the Definition of Done is complete.
