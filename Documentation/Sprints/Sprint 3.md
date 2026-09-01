# Sprint 3 Plan — Real Estate Website

## Purpose

This document defines the team plan for **Sprint 3 (Completion + Hardening)** and is formatted so the work can be copied directly into Trello cards.

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

- [x] Inquiries table/migration
- [x] Submit inquiry API
- [x] Buyer messages/inquiries page
- [x] Authorization checks
- [x] Error states
- [x] Manual/API testing

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

- Put Sprint 3 cards in `Sprint / To Do`.
- Add labels exactly as listed on each card.
- Add the branch name to the card description.
- Add each checklist item as a Trello checklist item.
- Do not move a card to `Done` until the Definition of Done is complete.
