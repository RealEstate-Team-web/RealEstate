# Sprint 2 Plan — Real Estate Website

## Purpose

This document defines the team plan for **Sprint 2 (Marketplace + Dashboards)** and is formatted so the work can be copied directly into Trello cards.

The project uses:

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** Local MySQL per developer, using `mysql2` raw SQL
- **Project management:** Trello
- **Git flow:** feature branches → pull request → merge into `develop`

---

## Sprint Cadence

Recommended sprint length: **1 week**.

| Day | Activity |
|---|---|
| Monday | Sprint planning, assign cards |
| Tuesday–Thursday | Feature development |
| Friday | Pull requests, code review, merge approved work into `develop` |
| Saturday | Integration testing, bug fixes, prepare next sprint |

---

## Team Allocation

| Developer | Responsibility |
|---|---|
| Developer 1 / Team Lead | Authentication + Admin Dashboard + integration/code review |
| Developer 2 | Landing Page + Header/Footer + Property Marketplace |
| Developer 3 | Buyer/Tenant Dashboard |
| Developer 4 | Agent Dashboard + Agent Property Management |

### Ownership Rules

- Developer 1 owns authentication frontend/backend and admin dashboard frontend/backend.
- Developer 2 owns all public landing-page work, including Header, Footer, Navbar, landing page, property listing page, and property details page.
- Developer 3 owns buyer dashboard features.
- Developer 4 owns agent dashboard features.
- Cross-developer files must be coordinated before coding starts.

---

## Trello Board Structure

### Lists

1. Backlog
2. Sprint / To Do
3. In Progress
4. Code Review
5. Testing
6. Blocked
7. Done

### Labels

| Label | Purpose |
|---|---|
| AUTH | Authentication and authorization |
| ADMIN | Admin dashboard and admin APIs |
| PROPERTY | Property marketplace |
| BUYER | Buyer dashboard and buyer APIs |
| AGENT | Agent dashboard and agent APIs |
| FRONTEND | Frontend/UI work |
| BACKEND | Backend/API work |
| DATABASE | Schema, migrations, or database work |
| SECURITY | Auth, authorization, secrets, or access control |
| UI | Layouts, components, responsive work |
| TESTING | Testing, QA, integration validation |

### Card Movement Rules

- `Sprint / To Do` → `In Progress`: assigned developer starts work.
- `In Progress` → `Code Review`: developer finishes implementation, self-tests, and opens a PR.
- `Code Review` → `Testing`: PR is approved and merged into `develop`.
- `Testing` → `Done`: integration testing passes and Definition of Done is satisfied.
- Any active list → `Blocked`: developer adds blocker reason to the card.

---

## Definition of Done

A Trello card is Done only when:

- Feature works as expected.
- Frontend is responsive where applicable.
- Backend API returns correct responses where applicable.
- Input validation is implemented.
- Error handling is implemented.
- Database migration is completed where required.
- No hardcoded secrets are introduced.
- Developer self-tested the work.
- Pull request was opened.
- Pull request was reviewed.
- Pull request was merged into `develop`.
- Integration testing passed.
- Documentation/card checklist was updated.

---

# Sprint 2 — Marketplace + Dashboards

## Sprint Goal

Build the first real marketplace and dashboard features: admin management, public property pages, buyer favorites/visits, and agent property management.

## Sprint 2 Cards

### Card S2-01 — [ADMIN] Build Protected Admin Dashboard Foundation

**Owner:** Developer 1  
**Labels:** ADMIN, FRONTEND, BACKEND, SECURITY, UI  
**Branch:** `feature/admin-dashboard`

**Objective**

Create the protected admin dashboard foundation.

**Requirements**

- Admin-only route.
- Admin layout/sidebar.
- Admin dashboard overview cards.
- Admin dashboard API.
- Role authorization enforcement.
- Unauthorized state.

**Acceptance Criteria**

- Only admin users can access admin dashboard.
- Non-admin users receive blocked/unauthorized state.
- Dashboard loads overview data.
- Layout is responsive.

**Checklist**

- [ ] Admin route
- [ ] Admin layout
- [ ] Admin sidebar
- [ ] Dashboard API
- [ ] Overview cards
- [ ] Role guard
- [ ] Unauthorized state
- [ ] Responsive testing

---

### Card S2-02 — [ADMIN] Implement User Management

**Owner:** Developer 1  
**Labels:** ADMIN, BACKEND, FRONTEND, SECURITY  
**Branch:** `feature/admin-users`

**Objective**

Allow admins to view users and suspend/activate accounts.

**Requirements**

- List users API.
- User status update API.
- Admin-only enforcement.
- User management page.
- Status badges.
- Confirmation for status-changing actions.

**Acceptance Criteria**

- Admin can view users.
- Admin can suspend active users.
- Admin can activate suspended users.
- Suspended users cannot authenticate/access protected routes.
- Non-admin users cannot call admin user APIs.

**Checklist**

- [ ] Users API
- [ ] Status update API
- [ ] Admin authorization
- [ ] Users page
- [ ] Status badges
- [ ] Confirm action UI
- [ ] Manual/API testing

---

### Card S2-03 — [ADMIN] Implement Agent Approval and Category Management

**Owner:** Developer 1  
**Labels:** ADMIN, BACKEND, FRONTEND, DATABASE, SECURITY  
**Branch:** `feature/admin-agents-categories`

**Objective**

Allow admins to approve/reject pending agents and manage property categories.

**Requirements**

- Pending agents API.
- Approve agent API.
- Reject agent API.
- Category create/update/delete API.
- Admin agents page.
- Admin categories page.

**Acceptance Criteria**

- Admin can view pending agents.
- Admin can approve an agent.
- Admin can reject an agent.
- Approved agent gains agent access.
- Admin can create/edit/delete categories.
- Category changes appear in public filters.

**Checklist**

- [ ] Pending agents API
- [ ] Approve/reject APIs
- [ ] Category CRUD APIs
- [ ] Agents page
- [ ] Categories page
- [ ] Status/error states
- [ ] Manual/API testing

---

### Card S2-04 — [LANDING] Build Landing Page

**Owner:** Developer 2  
**Labels:** PROPERTY, LANDING, FRONTEND, UI  
**Branch:** `feature/landing-page`

**Objective**

Build the public landing page using approved UI designs.

**Requirements**

- Hero section.
- Search entry.
- Featured property cards.
- CTA sections.
- Header/Footer integration.
- Responsive layout.

**Acceptance Criteria**

- Landing page matches approved UI direction.
- Search entry routes to property listing/search.
- Featured cards render correctly.
- Page is responsive on desktop and mobile.

**Checklist**

- [ ] Hero section
- [ ] Search entry
- [ ] Featured property cards
- [ ] CTA sections
- [ ] Header integration
- [ ] Footer integration
- [ ] Responsive testing

---

### Card S2-05 — [PROPERTY] Build Property Listing and Details Pages

**Owner:** Developer 2  
**Labels:** PROPERTY, FRONTEND, BACKEND, UI  
**Branch:** `feature/property-pages`

**Objective**

Build public property listing and property detail pages.

**Requirements**

- Listing page.
- Search/filter/sort UI.
- Pagination.
- Property cards.
- Property details page.
- Gallery/amenities/agent info display.

**Acceptance Criteria**

- Users can browse properties.
- Users can search/filter/sort properties.
- Users can paginate results.
- Users can open a property details page.
- Details page shows images, amenities, and agent info.

**Checklist**

- [ ] Listing page
- [ ] Search bar
- [ ] Filter sidebar
- [ ] Sort controls
- [ ] Pagination
- [ ] Property cards
- [ ] Details page
- [ ] Gallery
- [ ] Responsive testing

---

### Card S2-06 — [BUYER] Implement Favorites

**Owner:** Developer 3  
**Labels:** BUYER, BACKEND, FRONTEND, DATABASE  
**Branch:** `feature/buyer-favorites`

**Objective**

Allow buyers to save, view, and remove favorite properties.

**Requirements**

- Favorites migration if not already present.
- Save favorite API.
- Remove favorite API.
- List favorites API.
- Favorites page.
- Favorite action on property cards/details.

**Acceptance Criteria**

- Buyer can favorite a property.
- Buyer can view favorites.
- Buyer can remove a favorite.
- Duplicate favorite is prevented.
- Users can only manage their own favorites.

**Checklist**

- [ ] Favorites table/migration
- [ ] Save API
- [ ] Remove API
- [ ] List API
- [ ] Favorites page
- [ ] Favorite UI action
- [ ] Authorization tests/manual checks

---

### Card S2-07 — [BUYER] Implement Visit Booking

**Owner:** Developer 3
**Labels:** BUYER, BACKEND, FRONTEND, DATABASE
**Branch:** `feature/buyer-visits`

**Objective**

Allow buyers to book, cancel, and reschedule property visits.

**Requirements**

- Visits migration if not already present.
- Book visit API.
- Cancel visit API.
- Reschedule visit API.
- Scheduled visits page.
- Visit booking form.

**Acceptance Criteria**

- Buyer can book a visit.
- Buyer can view scheduled visits.
- Buyer can cancel a visit.
- Buyer can reschedule a visit.
- Users can only manage their own visits.

**Checklist**

- [ ] Visits table/migration
- [ ] Book API
- [ ] Cancel API
- [ ] Reschedule API
- [ ] Scheduled visits page
- [ ] Booking form
- [ ] Authorization checks

---

### Card S2-08 — [AGENT] Implement Agent Property Management

**Owner:** Developer 4  
**Labels:** AGENT, PROPERTY, BACKEND, FRONTEND, DATABASE  
**Branch:** `feature/agent-properties`

**Objective**

Allow agents to create, view, update, and delete their own property listings.

**Requirements**

- Agent property list API.
- Create property API.
- Update own property API.
- Delete own property API.
- My Properties page.
- Add/Edit Property forms.

**Acceptance Criteria**

- Agent can create a property.
- Agent can view their own properties.
- Agent can update only their own properties.
- Agent can delete only their own properties.
- Other agents cannot modify someone else's property.

**Checklist**

- [ ] My properties API
- [ ] Create API
- [ ] Update API
- [ ] Delete API
- [ ] My Properties page
- [ ] Add Property form
- [ ] Edit Property form
- [ ] Ownership authorization checks

---

### Card S2-09 — [AGENT] Implement Property Image Upload

**Owner:** Developer 4  
**Labels:** AGENT, PROPERTY, BACKEND, FRONTEND  
**Branch:** `feature/property-upload`

**Objective**

Allow agents to upload property images with cover image and sort order.

**Requirements**

- Image upload endpoint integration.
- Cloudinary upload flow.
- Validate image type/size.
- Store image metadata.
- Cover image support.
- Sort order support.
- Upload UI in Add/Edit Property forms.

**Acceptance Criteria**

- Agent can upload JPG/PNG/WebP images.
- Oversized/invalid images are rejected.
- Uploaded images are stored in Cloudinary.
- Image metadata is saved in MySQL.
- One image can be marked as cover.
- Image order is preserved.

**Checklist**

- [ ] Upload endpoint wiring
- [ ] Cloudinary integration
- [ ] Validation
- [ ] Metadata persistence
- [ ] Cover image handling
- [ ] Sort order handling
- [ ] Upload UI
- [ ] Manual testing

---

## Sprint Dependency Notes

- Sprint 1 authentication must land before dashboards can be fully protected.
- Sprint 1 property schema/API must land before property listing, buyer favorites, visits, and agent property management can be completed.
- Admin agent approval depends on agent registration creating pending `agent_profiles`.
- Admin category management depends on property/category migrations.
- Buyer visits and agent visit approval share visit status rules and must be coordinated between Developer 3 and Developer 4.

---

## Trello Creation Notes

When creating Trello cards from this document:

- Put Sprint 2 cards in `Sprint / To Do`.
- Add labels exactly as listed on each card.
- Add the branch name to the card description.
- Add each checklist item as a Trello checklist item.
- Do not move a card to `Done` until the Definition of Done is complete.
