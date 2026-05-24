# Decisions — DivePrep Buddy

## Decision 001 — PWA First

### Decision

Build the MVP as a Progressive Web App.

### Reason

- fastest development;
- offline support;
- installable on mobile;
- no App Store friction;
- ideal for solo-founder MVP.

### Alternatives Considered

- native mobile app;
- Telegram Mini App.

### Impact

- lower infrastructure complexity;
- faster validation;
- easier iteration.

### Revisit Trigger

Reconsider if:

- users strongly prefer native integrations;
- dive centers require app-store distribution;
- offline capabilities become insufficient.

---

## Decision 002 — No Backend For MVP

### Decision

Avoid backend and cloud sync in the first version.

### Reason

The core value can be validated locally.

### Alternatives Considered

- Supabase backend;
- Firebase sync.

### Impact

- lower cost;
- lower complexity;
- faster prototype development.

### Revisit Trigger

Reconsider when:

- users request multi-device sync;
- instructor/team workflows appear;
- saved profiles become important.

---

## Decision 003 — No Decompression Features

### Decision

Do not implement decompression calculations or dive-planning authority.

### Reason

The product focuses on preparation, not dive safety computation.

### Alternatives Considered

- dive planner;
- NDL calculator;
- integrated dive computer features.

### Impact

- reduced legal/safety risk;
- clearer product positioning;
- smaller MVP scope.

### Revisit Trigger

Only revisit if:

- the product evolves into professional diving tooling;
- certified experts become involved.

---

## Decision 004 — No Onboarding

### Decision

Users should get immediate value without onboarding.

### Reason

The app is intended for quick use before dives.

### Alternatives Considered

- tutorial flow;
- onboarding carousel;
- account-first experience.

### Impact

- lower friction;
- faster first interaction;
- easier validation.

### Revisit Trigger

Reconsider only if:

- users repeatedly misunderstand the workflow;
- advanced features require explanation.
