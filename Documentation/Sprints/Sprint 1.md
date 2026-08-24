# Sprint Plan — Real Estate Website

## Purpose

This document defines the team sprint plan for Sprints 1–3 and is formatted so the work can be copied into Trello cards.

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

# Sprint 1 — Foundations

## Sprint Goal

Build the foundations that unblock feature development: authentication, shared routing/auth context, property database/API foundation, and buyer/agent dashboard shells.

## Sprint 1 Cards

### Card S1-01 — [AUTH] Implement User Registration

**Owner:** Developer 1  
**Labels:** AUTH, BACKEND, FRONTEND, DATABASE, SECURITY  
**Branch:** `feature/auth-register`

**Objective**

Implement secure buyer and agent registration.

**Requirements**

- Create buyer registration API.
- Create agent registration API.
- Validate required fields.
- Validate email and password.
- Reject duplicate email.
- Hash password before storage.
- Create `users` and authentication credential records.
- Create pending `agent_profiles` record for agent registration.
- Never return password or password hash.
- Build responsive registration UI.

**Acceptance Criteria**

- Valid buyer registration creates a buyer account.
- Valid agent registration creates a user plus pending agent profile.
- Duplicate email returns an error.
- Invalid input returns validation errors.
- Password is stored as a bcrypt hash.
- API response never includes password data.
- Registration page works on desktop and mobile.

**Checklist**

- [ ] Registration routes
- [ ] Registration controller/service
- [ ] User model/database access
- [ ] Agent registration transaction
- [ ] Validation schema
- [ ] Password hashing
- [ ] Duplicate email handling
- [ ] Safe API response
- [ ] Register page UI
- [ ] Manual/API testing
- [ ] Documentation/card notes updated

**Done note:** This card creates a `pending` `agent_profiles` row on agent registration. The admin approve/reject flow that acts on it is implemented and marked complete (see S2-01 Admin Dashboard Foundation).

---

### Card S1-02 — [AUTH] Implement Login, JWT, Logout, and Current User

**Owner:** Developer 1  
**Labels:** AUTH, BACKEND, FRONTEND, SECURITY  
**Branch:** `feature/auth-login`

**Objective**

Allow users to log in, receive a JWT, persist identity, log out, and fetch the current user.

**Requirements**

- Login API.
- Validate login fields.
- Verify password hash.
- Generate JWT.
- Return safe user data.
- Reject invalid credentials.
- Reject suspended users.
- Logout endpoint or client-side logout behavior.
- `/me` endpoint for current authenticated user.
- Login UI with loading and error states.

**Acceptance Criteria**

- Valid credentials authenticate successfully.
- Invalid credentials are rejected.
- Suspended users cannot authenticate.
- JWT contains safe identity/role claims.
- Password is never returned.
- Logged-in identity persists across reloads.
- Logout clears local auth state.
- Login page works on desktop and mobile.

**Checklist**

- [ ] Login route
- [ ] Logout route/behavior
- [ ] `/me` route
- [ ] Password verification
- [ ] JWT generation
- [ ] Suspended-user check
- [ ] Safe user response
- [ ] Login page UI
- [ ] Loading/error states
- [ ] Manual/API testing

---

### Card S1-03 — [AUTH] Implement Auth and Role Middleware

**Owner:** Developer 1  
**Labels:** AUTH, BACKEND, SECURITY  
**Branch:** `feature/auth-middleware`

**Objective**

Protect authenticated routes and enforce buyer, agent, and admin authorization.

**Requirements**

- JWT verification middleware.
- Attach authenticated user to request context.
- Fresh database lookup for user status.
- Role authorization middleware.
- Missing/invalid token returns 401.
- Insufficient role returns 403.

**Acceptance Criteria**

- Valid token reaches protected routes.
- Missing token returns 401.
- Invalid/expired token returns 401.
- Suspended user is blocked.
- Insufficient role returns 403.
- Protected routes can read authenticated user context.

**Checklist**

- [ ] Auth middleware
- [ ] Role middleware
- [ ] 401 handling
- [ ] 403 handling
- [ ] Fresh user lookup
- [ ] Protected-route manual tests
- [ ] Documentation/card notes updated

---

### Card S1-04 — [AUTH] Build Auth Frontend Shell

**Owner:** Developer 1  
**Labels:** AUTH, FRONTEND, UI, SECURITY  
**Branch:** `feature/auth-shell`

**Objective**

Create frontend authentication infrastructure used by the full app.

**Requirements**

- API client with base URL.
- Auth service functions.
- AuthContext.
- `useAuth` hook.
- Public route guard.
- Private route guard.
- Role route guard.
- Auth layout.
- Auth page route registration.

**Acceptance Criteria**

- App can navigate auth routes.
- API client attaches token when logged in.
- Auth state hydrates after reload.
- Private routes redirect anonymous users.
- Public routes redirect logged-in users where appropriate.
- Role route blocks unauthorized roles.

**Checklist**

- [ ] API client
- [ ] Auth service
- [ ] AuthContext
- [ ] `useAuth`
- [ ] PublicRoute
- [ ] PrivateRoute
- [ ] RoleRoute
- [ ] AuthLayout
- [ ] Route registration

---

### Card S1-05 — [PROPERTY] Implement Property Database and Public API Foundation

**Owner:** Developer 4  
**Labels:** PROPERTY, BACKEND, DATABASE  
**Branch:** `feature/property-schema-api`

**Objective**

Create the property/category database foundation (owned by the agent module). The read-only public property APIs are built by Developer 2 and consume these tables.

**Requirements**

Migrations & schema (Developer 4):

- Create property-related migrations.
- Create categories table.
- Create properties table.
- Create property images table.
- Create amenities support if included in approved DB design.
- Add indexes/foreign keys.

Read-only public APIs (Developer 2):

- Public property list API.
- Public property details API.
- Public categories API.
- Search/filter/sort/pagination support.

**Acceptance Criteria**

- Migrations run successfully on local MySQL.
- Tables match approved database design.
- Public property list returns paginated results.
- Public property details returns a single property.
- Categories endpoint returns browseable categories.
- Search/filter/sort parameters work.

**Checklist**

- [ ] Review approved DB design
- [ ] Create migrations
- [ ] Add constraints/indexes
- [ ] Property model
- [ ] Category model
- [ ] Property controller/service
- [ ] Category controller/service
- [ ] Public routes
- [ ] Manual/API testing

---

### Card S1-06 — [UI] Build Header, Footer, and Public Layout

**Owner:** Developer 2  
**Labels:** FRONTEND, UI  
**Branch:** `feature/public-header-footer`

**Objective**

Create reusable public Header, Footer, and public layout components for landing/property pages.

**Requirements**

- Header/Navbar.
- Footer.
- Mobile navigation.
- Auth-state navigation placeholders.
- Public layout wrapper.
- Responsive behavior.

**Acceptance Criteria**

- Header works on desktop, tablet, and mobile.
- Footer is responsive.
- Navigation links are centralized and reusable.
- Auth-state links can be wired to auth state.
- Components are reusable by landing/property pages.

**Checklist**

- [ ] Header/Navbar
- [ ] Footer
- [ ] Mobile navigation
- [ ] Public layout
- [ ] Auth-state link placeholders
- [ ] Responsive testing
- [ ] Accessibility check

---

### Card S1-07 — [BUYER] Build Buyer Dashboard Shell

**Owner:** Developer 3  
**Labels:** BUYER, FRONTEND, UI  
**Branch:** `feature/buyer-dashboard-shell`

**Objective**

Create the buyer dashboard shell without advanced buyer features.

**Requirements**

- Buyer protected route.
- Buyer dashboard layout.
- Buyer sidebar/navigation.
- Dashboard overview placeholder.
- Authenticated user info placeholder.
- Responsive layout.

**Acceptance Criteria**

- Buyer dashboard route is protected.
- Buyer dashboard renders without API feature data.
- Sidebar/navigation displays buyer sections.
- Layout works on desktop and mobile.
- Unauthorized users cannot access the dashboard.

**Checklist**

- [ ] Buyer route
- [ ] Buyer layout
- [ ] Sidebar
- [ ] Dashboard placeholder cards
- [ ] User info placeholder
- [ ] Responsive testing

---

### Card S1-08 — [AGENT] Build Agent Dashboard Shell

**Owner:** Developer 4  
**Labels:** AGENT, FRONTEND, UI  
**Branch:** `feature/agent-dashboard-shell`

**Objective**

Create the agent dashboard shell without advanced agent features.

**Requirements**

- Agent protected route.
- Agent dashboard layout.
- Agent sidebar/navigation.
- Dashboard overview placeholder.
- Agent profile/status placeholder.
- Responsive layout.

**Acceptance Criteria**

- Agent dashboard route is protected.
- Agent dashboard renders without property feature data.
- Sidebar/navigation displays agent sections.
- Layout works on desktop and mobile.
- Unauthorized users cannot access the dashboard.

**Checklist**

- [ ] Agent route
- [ ] Agent layout
- [ ] Sidebar
- [ ] Dashboard placeholder cards
- [ ] Agent status placeholder
- [ ] Responsive testing

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

### Card S2-03 — [ADMIN] Implement Category Management

**Owner:** Developer 1  
**Labels:** ADMIN, BACKEND, FRONTEND, DATABASE, SECURITY  
**Branch:** `feature/admin-agents-categories`

**Status:** Agent Approval portion was completed earlier in S2-01 (Admin Dashboard Foundation, merged via PR #8) and is tracked there. This card now covers only Category Management.

**Objective**

Allow admins to manage property categories (create / edit / delete) and expose them publicly for listing filters.

**Requirements**

- Category create/update/delete API (admin-only).
- Public category list API for filter dropdowns.
- Admin categories page at `/admin/categories` (list, create, edit, delete).
- Status/error/empty states on the page.

**Acceptance Criteria**

- Admin can create a category.
- Admin can edit a category.
- Admin can delete a category.
- Duplicate category names are rejected.
- Categories are exposed via `GET /api/categories` for the property-browse filters (the filter UI itself is delivered with property browsing).

**Checklist**

- [ ] Category CRUD APIs
- [ ] Public category list endpoint
- [ ] Categories page (`/admin/categories`)
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

# Sprint 3 — Completion + Hardening

## Sprint Goal

Complete the remaining dashboard features, cross-feature flows, and project hardening before final integration.

## Sprint 3 Cards

### Card S3-01 — [ADMIN] Implement Reports and Analytics

**Owner:** Developer 1  
**Labels:** ADMIN, BACKEND, FRONTEND, UI  
**Branch:** `feature/admin-analytics`

**Objective**

Add admin reporting and analytics views.

**Requirements**

- Admin analytics API.
- Counts for users, agents, properties, visits where available.
- Reports page.
- Analytics dashboard page.
- Loading/error states.

**Acceptance Criteria**

- Admin can view platform summary metrics.
- Admin reports page renders safely.
- Non-admin users cannot access reports/analytics.
- UI is responsive.

**Checklist**

- [ ] Analytics API
- [ ] Reports API/data
- [ ] Reports page
- [ ] Analytics page
- [ ] Loading/error states
- [ ] Role protection

---

### Card S3-02 — [ADMIN] Implement Admin Profile and Settings

**Owner:** Developer 1  
**Labels:** ADMIN, FRONTEND, BACKEND, SECURITY  
**Branch:** `feature/admin-profile-settings`

**Objective**

Add admin profile/context and settings pages.

**Requirements**

- Admin profile/context API.
- Admin profile page.
- Admin settings page.
- Safe profile response.
- Role-protected access.

**Acceptance Criteria**

- Admin can view safe admin profile information.
- Admin profile/settings pages are protected.
- Sensitive data is not exposed.
- UI is responsive.

**Checklist**

- [ ] Admin profile API
- [ ] Admin profile page
- [ ] Settings page
- [ ] Safe response
- [ ] Role protection
- [ ] Responsive testing

---

### Card S3-03 — [PROPERTY] Polish Landing and Property Experience

**Owner:** Developer 2  
**Labels:** PROPERTY, LANDING, FRONTEND, UI  
**Branch:** `feature/property-ui-polish`

**Objective**

Polish public-facing property and landing page UX.

**Requirements**

- Testimonials/sections if in design.
- CTA polish.
- Search refinements.
- Gallery polish.
- Empty/loading/error states.
- Responsive fixes.

**Acceptance Criteria**

- Public pages look consistent with approved UI.
- Loading/empty/error states are handled.
- Search UX is usable.
- Property details gallery is usable.
- Public pages are responsive.

**Checklist**

- [ ] Testimonials/sections
- [ ] CTA polish
- [ ] Search UX refinements
- [ ] Gallery polish
- [ ] Empty states
- [ ] Loading states
- [ ] Responsive fixes

---

### Card S3-04 — [BUYER] Implement Inquiries and Messages

**Owner:** Developer 3  
**Labels:** BUYER, BACKEND, FRONTEND, DATABASE  
**Branch:** `feature/buyer-inquiries-messages`

**Objective**

Allow buyers to submit property inquiries and view related messages/placeholders.

**Requirements**

- Inquiries migration if not already present.
- Submit inquiry API.
- Buyer inquiries/messages page.
- Agent-view support for inquiry ownership.
- Read/status metadata if included in approved design.

**Acceptance Criteria**

- Buyer can submit an inquiry for a property.
- Inquiry is linked to buyer, property, and owning agent.
- Buyer can view submitted inquiries/messages area.
- Users cannot view other users' inquiry data.

**Checklist**

- [ ] Inquiries table/migration
- [ ] Submit inquiry API
- [ ] Buyer messages/inquiries page
- [ ] Authorization checks
- [ ] Error states
- [ ] Manual/API testing

---

### Card S3-05 — [BUYER] Implement Buyer Profile, Settings, and Notifications Placeholder

**Owner:** Developer 3  
**Labels:** BUYER, FRONTEND, BACKEND, UI  
**Branch:** `feature/buyer-profile-settings`

**Objective**

Complete buyer account dashboard pages.

**Requirements**

- Buyer profile page.
- Buyer profile retrieval/update API if needed.
- Settings page.
- Notifications placeholder.
- Responsive behavior.

**Acceptance Criteria**

- Buyer can view profile information.
- Buyer can update allowed profile fields if implemented.
- Notifications placeholder displays safely.
- Pages are protected and responsive.

**Checklist**

- [ ] Profile API
- [ ] Profile page
- [ ] Settings page
- [ ] Notifications placeholder
- [ ] Authorization checks
- [ ] Responsive testing

---

### Card S3-06 — [AGENT] Implement Visit Request Approval

**Owner:** Developer 4  
**Labels:** AGENT, BUYER, BACKEND, FRONTEND  
**Branch:** `feature/agent-visit-requests`

**Objective**

Allow agents to approve or reject visit requests for their properties.

**Requirements**

- Agent visit requests API.
- Approve visit API.
- Reject visit API.
- Agent visit requests page.
- Buyer sees updated visit status.

**Acceptance Criteria**

- Agent can view visit requests for their properties.
- Agent can approve a visit request.
- Agent can reject a visit request.
- Agent cannot manage requests for another agent's property.
- Buyer visit status updates after approval/rejection.

**Checklist**

- [ ] Visit requests API
- [ ] Approve API
- [ ] Reject API
- [ ] Visit Requests page
- [ ] Ownership checks
- [ ] Buyer status update check

---

### Card S3-07 — [AGENT] Implement Agent Profile, Analytics, and Messages

**Owner:** Developer 4  
**Labels:** AGENT, BACKEND, FRONTEND, UI  
**Branch:** `feature/agent-profile-analytics-messages`

**Objective**

Complete agent dashboard supporting pages.

**Requirements**

- Agent profile page.
- Agent profile retrieval/update API if needed.
- Verification status display.
- Agent analytics page.
- Agent messages/inquiries page.

**Acceptance Criteria**

- Agent can view profile information.
- Agent can see verification status.
- Agent analytics page renders summary data/placeholders safely.
- Agent can view inquiry/message area.
- Pages are protected and responsive.

**Checklist**

- [ ] Agent profile API/page
- [ ] Verification status display
- [ ] Analytics page
- [ ] Messages/inquiries page
- [ ] Protected route checks
- [ ] Responsive testing

---

### Card S3-08 — [TESTING] Integration Testing and Hardening

**Owner:** All Developers, led by Developer 1  
**Labels:** TESTING, SECURITY, BACKEND, FRONTEND  
**Branch:** `feature/integration-hardening`

**Objective**

Validate the integrated MVP and fix cross-feature issues.

**Requirements**

- Auth flow testing.
- Property browse/detail testing.
- Buyer favorite/visit/inquiry testing.
- Agent property/visit testing.
- Admin user/agent/category testing.
- Secrets/ignore audit.
- Responsive pass across main pages.

**Acceptance Criteria**

- Main user flows work end-to-end.
- No hardcoded secrets are committed.
- `.env`, `node_modules`, uploads, and generated files are ignored/untracked.
- Major pages are responsive.
- Known blockers are documented or fixed.

**Checklist**

- [ ] Auth E2E manual test
- [ ] Property E2E manual test
- [ ] Buyer E2E manual test
- [ ] Agent E2E manual test
- [ ] Admin E2E manual test
- [ ] Secrets/ignore audit
- [ ] Responsive pass
- [ ] Bug fix cards created for remaining issues

---

## Sprint Dependency Notes

- Sprint 1 authentication must land before dashboards can be fully protected.
- Sprint 1 property schema/API must land before property listing, buyer favorites, visits, and agent property management can be completed.
- Admin agent approval depends on agent registration creating pending `agent_profiles`.
- Admin category management depends on property/category migrations.
- Buyer visits and agent visit approval share visit status rules and must be coordinated between Developer 3 and Developer 4.
- Buyer inquiries and agent messages/inquiries are cross-cutting and must be coordinated between Developer 3 and Developer 4.

---

## Trello Creation Notes

When creating Trello cards from this document:

- Put Sprint 1 cards in `Sprint / To Do` first.
- Put Sprint 2 and Sprint 3 cards in `Backlog` until their sprint starts.
- Add labels exactly as listed on each card.
- Add the branch name to the card description.
- Add each checklist item as a Trello checklist item.
- Do not move a card to `Done` until the Definition of Done is complete.
