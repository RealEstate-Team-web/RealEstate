# Sprint 4 Plan — Real Estate Website

## Purpose

This document defines the team plan for **Sprint 4 (Quality, Testing & Hardening)** and is formatted so the work can be copied directly into Trello cards.

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

# Sprint 4 — Quality, Testing & Hardening

## Sprint Goal

Add automated test coverage for core backend flows, audit the repository for secrets and ignored files, and run a final end-to-end integration pass to harden the MVP before production release.

## Sprint 4 Cards

### Card S4-01 — [TESTING] Add Backend Test Infrastructure

**Owner:** Developer 1  
**Labels:** TESTING, BACKEND  
**Branch:** `feature/test-infrastructure`

**Objective**

Set up the backend test runner, configuration, and shared fixtures.

**Requirements**

- Test runner (Vitest) + configuration.
- `npm test` script.
- Shared fixtures/setup (DB connection, truncate/reset helper).
- Sample passing test to validate the harness.

**Acceptance Criteria**

- `npm test` runs successfully.
- Test configuration is committed.
- Test database connection works.
- At least one sample test passes.

**Checklist**

- [ ] Runner installed/configured
- [ ] `npm test` script
- [ ] Setup/fixtures
- [ ] Sample passing test
- [ ] Documentation/card notes updated

---

### Card S4-02 — [TESTING] Add Auth Endpoint Tests

**Owner:** Developer 1  
**Labels:** TESTING, AUTH, BACKEND  
**Branch:** `feature/auth-tests`

**Objective**

Cover authentication endpoints with automated integration tests.

**Requirements**

- Register (buyer + agent) tests.
- Login, logout, `/me` tests.
- Change password / reset password tests.
- Negative cases: invalid token, suspended user, duplicate email.

**Acceptance Criteria**

- Core auth flows covered and green.
- Suspended-user and invalid-token cases covered.
- Duplicate-email and invalid-input cases covered.

**Checklist**

- [ ] Register tests
- [ ] Login tests
- [ ] Logout/`/me` tests
- [ ] Change/reset password tests
- [ ] Negative cases
- [ ] Manual/CI verification

---

### Card S4-03 — [TESTING] Add Property, Buyer & Agent Endpoint Tests

**Owner:** Developer 2 + Developer 4 (coordinate with Developer 3)  
**Labels:** TESTING, PROPERTY, BUYER, AGENT, BACKEND  
**Branch:** `feature/feature-tests`

**Objective**

Cover property, buyer, and agent endpoints with automated integration tests.

**Requirements**

- Public browse/filter/details tests.
- Agent CRUD + ownership enforcement tests.
- Image upload validation tests.
- Buyer favorites/visits tests.
- Agent visit-request approval tests.

**Acceptance Criteria**

- Core property and agent flows covered and green.
- Ownership and authorization cases covered.
- Buyer/agent cross-feature flows covered.

**Checklist**

- [ ] Browse/filter tests
- [ ] Details tests
- [ ] Agent CRUD tests
- [ ] Upload validation tests
- [ ] Buyer favorites/visits tests
- [ ] Agent visit approval tests
- [ ] Ownership/authorization cases

---

### Card S4-04 — [SECURITY] Run Secrets, Environment & Git Ignore Audit

**Owner:** Developer 1 + all  
**Labels:** SECURITY, TESTING  
**Branch:** `feature/security-audit`

**Objective**

Verify the repository is secret-free and generated files are properly ignored.

**Requirements**

- Confirm `.env`, `.env.production`, `node_modules`, `uploads/` are untracked/ignored.
- Scan git history for committed secrets.
- Add guardrails against future secret commits (pre-commit hook or CI check).

**Acceptance Criteria**

- Audit passes with no tracked secrets.
- `.gitignore` correctly covers env, deps, and uploads.
- No secrets present in git history.

**Checklist**

- [ ] Ignore audit
- [ ] Git-history secrets scan
- [ ] `.gitignore` verification
- [ ] Guardrail notes

---

### Card S4-05 — [TESTING] Final End-to-End Integration & Release Verification

**Owner:** All Developers, led by Developer 1  
**Labels:** TESTING, SECURITY, BACKEND, FRONTEND  
**Branch:** `feature/integration-hardening`

**Objective**

Validate the integrated MVP end-to-end and fix cross-feature issues before release.

**Requirements**

- E2E manual tests: auth, property, buyer, agent, admin.
- Responsive pass across main pages.
- Bug-fix cards created for remaining issues.
- Production build verification (`npm run build`).

**Acceptance Criteria**

- Main user flows work end-to-end.
- No hardcoded secrets are committed.
- Major pages are responsive.
- Production build succeeds.
- Known blockers are documented or fixed.

**Checklist**

- [ ] Auth E2E manual test
- [ ] Property E2E manual test
- [ ] Buyer E2E manual test
- [ ] Agent E2E manual test
- [ ] Admin E2E manual test
- [ ] Responsive pass
- [ ] Production build check
- [ ] Bug-fix cards created for remaining issues

---

## Sprint Dependency Notes

- Sprint 4 depends on Sprints 1–3 being functionally complete (endpoints and UIs must exist before tests and E2E can run).
- Test infrastructure (S4-01) must land before S4-02 and S4-03 tests can be executed.
- Secrets/ignore audit (S4-04) is independent and can run in parallel with test work.
- Final E2E (S4-05) is the last card and should run after all feature branches are merged into `develop`.

---

## Trello Creation Notes

When creating Trello cards from this document:

- Put Sprint 4 cards in `Sprint / To Do`.
- Add labels exactly as listed on each card.
- Add the branch name to the card description.
- Add each checklist item as a Trello checklist item.
- Do not move a card to `Done` until the Definition of Done is complete.
