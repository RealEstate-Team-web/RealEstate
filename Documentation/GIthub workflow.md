# 🌿 GitHub Workflow

## Purpose

This document defines the Git workflow that every developer must follow throughout the project.

**Never push directly to `main` or `develop`.**

---

# 🌳 Branch Strategy

```text
main
│
└── develop
      │
      ├── feature/auth
      ├── feature/property
      ├── feature/buyer
      ├── feature/agent
      └── feature/admin
```

## Branch Purpose

| Branch | Purpose | Who Can Merge |
|---------|----------|---------------|
| `main` | Production / Stable Release | Team Lead |
| `develop` | Integration Branch | Team Lead (after PR approval) |
| `feature/*` | Individual feature development | Assigned Developer |

---

# 👨‍💻 Initial Project Setup

Team Lead creates:

- main
- develop

Developers create feature branches from `develop`.

Example:

```bash
git checkout develop
git pull origin develop

git checkout -b feature/property
```

---

# 📋 Daily Developer Workflow

Every morning, before writing code:

```bash
git checkout develop
git pull origin develop
```

Switch back to your feature branch:

```bash
git checkout feature/property
```

Update your branch:

```bash
git merge develop
```

Resolve merge conflicts (if any).

Now start coding.

---

# 💻 Development Workflow

```text
Pull latest develop
        │
        ▼
Merge develop into feature branch
        │
        ▼
Write Code
        │
        ▼
Test Feature
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
Approve
        │
        ▼
Merge into develop
```

---

# 📝 Working on a Feature

Example:

Mola is assigned:

Property Module

mola creates

```text
feature/property
```

mola writes code.

When finished:

```bash
git add .

git commit -m "Implement property CRUD"

git push origin feature/property
```

Bob **does NOT merge**.

Bob opens a Pull Request.

---

# 🔀 Pull Request

Source Branch

```text
feature/property
```

Target Branch

```text
develop
```

Never

```text
feature/property
        │
        ▼
main ❌
```

Always

```text
feature/property
        │
        ▼
develop ✅
```

---

# 👀 Team Lead Review

The Team Lead reviews:

- Code quality
- Security
- Validation
- Folder structure
- Coding standards
- API behavior
- UI behavior
- Responsive design
- GitHub Actions
- Build status

If issues exist:

```text
Request Changes
```

Developer fixes issues and pushes again.

GitHub automatically updates the Pull Request.

---

# ✅ After Approval

```text
feature/property
        │
        ▼
Merge
        │
        ▼
develop
```

Now everyone can use the new feature.

---

# 🔄 Another Developer Scenario

Charlie started working before Bob merged.

mola merges:

```text
feature/property

↓

develop
```

mila's branch is now behind.

mila updates:

```bash
git checkout develop
git pull origin develop

git checkout feature/buyer
git merge develop
```

Now mila has mola's latest changes.

Continue development.

---

# 🚨 Merge Conflict

Suppose both mola and mila modified:

```text
Navbar.jsx
```

Git cannot merge automatically.

Git reports:

```text
Merge Conflict
```

mila resolves the conflict locally.

Tests the application.

Commits:

```bash
git add .

git commit -m "Resolve merge conflict"

git push origin feature/buyer
```

Then opens or updates the Pull Request.

---

# 🧪 Before Opening Pull Request

Developer must verify:

- [ ] Project builds successfully
- [ ] No console errors
- [ ] Feature works correctly
- [ ] API tested
- [ ] Database migration created (if required)
- [ ] Responsive on mobile
- [ ] No merge conflicts
- [ ] Latest `develop` merged into feature branch

---

# 📦 Pull Request Review Checklist

The Team Lead checks:

## Code Quality

- [ ] Code is readable
- [ ] Good variable names
- [ ] Small reusable functions
- [ ] No duplicated code
- [ ] Follows project standards

---

## Security

- [ ] Passwords hashed
- [ ] JWT implemented correctly
- [ ] Authorization checks
- [ ] Input validation
- [ ] No secrets in source code

---

## Backend

- [ ] Correct API responses
- [ ] Proper HTTP status codes
- [ ] Error handling
- [ ] Efficient database queries

---

## Frontend

- [ ] Matches wireframe
- [ ] Responsive layout
- [ ] Form validation
- [ ] No console errors

---

## Testing

- [ ] Feature tested manually
- [ ] Existing features still work
- [ ] GitHub Actions passed
- [ ] Build successful

---

# 🔀 Merge to Develop

After approval:

```text
feature/property
        │
        ▼
develop
```

Developer deletes the feature branch after merging.

---

# 🚀 Release Workflow

After all planned features are merged into `develop`:

```text
develop
      │
      ▼
Integration Testing
      │
      ▼
Bug Fixes
      │
      ▼
Final Approval
      │
      ▼
Merge into main
```

Only the Team Lead merges `develop` into `main`.

---

# 🌲 Branch Lifecycle

```text
develop
    │
    ▼
Create feature branch
    │
    ▼
Develop feature
    │
    ▼
Commit
    │
    ▼
Push
    │
    ▼
Open Pull Request
    │
    ▼
Code Review
    │
    ▼
Request Changes (if needed)
    │
    ▼
Developer fixes issues
    │
    ▼
Push again
    │
    ▼
Approve
    │
    ▼
Merge into develop
    │
    ▼
Delete feature branch
```

---

# 📅 Daily Workflow

Every developer follows this routine:

```text
Start Work
      │
      ▼
Pull latest develop
      │
      ▼
Merge develop into feature branch
      │
      ▼
Write code
      │
      ▼
Test locally
      │
      ▼
Commit
      │
      ▼
Push
      │
      ▼
Open / Update Pull Request
```

---

# 🚫 Never Do

- ❌ Push directly to `main`
- ❌ Push directly to `develop`
- ❌ Merge your own Pull Request without review
- ❌ Work directly on another developer's feature branch
- ❌ Mix unrelated features in one Pull Request
- ❌ Ignore merge conflicts
- ❌ Commit `.env` files or secrets
- ❌ Force push to shared branches (`main` or `develop`)

---

# ✅ Git Workflow Summary

```text
                     main
                      ▲
                      │
             Release After Testing
                      │
                  develop
      ┌───────────────┼───────────────┐
      │               │               │
      ▼               ▼               ▼
 feature/auth   feature/property  feature/buyer
      │               │               │
      │               │               │
      └─────── Pull Requests ─────────┘
                      │
                      ▼
              Team Lead Review
                      │
          ┌───────────┴───────────┐
          │                       │
     Request Changes         Approve
          │                       │
          ▼                       ▼
   Developer Updates       Merge to develop
                                  │
                                  ▼
                         Integration Testing
                                  │
                                  ▼
                             Merge to main
```# 🌿 GitHub Workflow

## Purpose

This document defines the Git workflow that every developer must follow throughout the project.

**Never push directly to `main` or `develop`.**

---

# 🌳 Branch Strategy

```text
main
│
└── develop
      │
      ├── feature/auth
      ├── feature/property
      ├── feature/buyer
      ├── feature/agent
      └── feature/admin
```

