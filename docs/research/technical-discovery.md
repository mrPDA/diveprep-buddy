# DivePrep Buddy — Technical Discovery

## Goal

Design the smallest realistic MVP for a pre-dive preparation assistant.

---

# Product Definition

## Core Value

Help divers prepare calmly and systematically before a dive.

The app focuses on:

- preparation;
- readiness;
- gear checks;
- buddy-check flow.

The app is NOT:

- a dive computer;
- a decompression planner;
- a diving certification authority;
- a dive logbook.

---

# Recommended MVP

## Included in MVP

- dive type selector;
- adaptive checklist generation;
- checklist completion tracking;
- buddy-check flow;
- local persistence;
- offline support.

## Explicitly Excluded

- accounts;
- cloud sync;
- AI assistant;
- weather/ocean APIs;
- dive logging;
- social features;
- marketplace;
- equipment rental integration.

---

# Architecture Recommendation

## Platform

Recommended platform:

```text
PWA (Progressive Web App)
```

Reasons:

- installable on mobile;
- offline support;
- fast development;
- no App Store approval;
- easy iteration;
- low infrastructure cost.

Telegram Mini App can be explored later.

---

# Suggested Stack

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS

## State Management

- Zustand

or plain React state for earliest MVP.

## Storage

- IndexedDB
- Dexie.js

## Hosting

- Vercel
- Netlify

## Backend

No backend for MVP.

---

# Core Technical Components

## 1. Checklist Engine

Rule-based checklist generator.

Example input:

```json
{
  "dive_type": "night",
  "cold_water": true,
  "camera": true
}
```

Example output:

```json
[
  "primary torch",
  "backup torch",
  "SMB",
  "camera housing o-ring",
  "extra batteries"
]
```

No AI required.

---

## 2. Dive Templates

Static JSON-based templates.

Example:

```json
{
  "boat_dive": [...],
  "night_dive": [...]
}
```

---

## 3. Buddy Check Flow

Simple interactive sequence:

```text
BCD -> Weights -> Releases -> Air -> Final OK
```

Potential UI:

- swipe cards;
- step-by-step flow;
- large buttons for sunlight readability.

---

## 4. Local Persistence

Store:

- preferred gear;
- common dive setups;
- last-used options.

No authentication initially.

---

# MVP Implementation Strategy

## Fastest Build Path

1. Build static dive templates.
2. Build checklist generator.
3. Add checklist completion state.
4. Add buddy-check flow.
5. Add offline support.
6. Deploy publicly.

---

# Estimated Timeline

| Task | Estimate |
| --- | --- |
| UI skeleton | 1-2 days |
| Checklist engine | 1-2 days |
| Buddy-check flow | 1 day |
| Offline support | 1 day |
| Polish/testing | 2 days |

Estimated MVP:

```text
~1.5 weeks for solo developer
```

---

# Technical Risks

## Low Risk

- checklist logic;
- PWA deployment;
- offline storage.

## Medium Risk

- mobile UX in bright sunlight;
- overly generic checklist quality.

## High Risk (Future)

- real-time dive condition recommendations;
- safety-sensitive decision support;
- instructor workflows;
- cloud sync complexity.

---

# Safety & Legal Considerations

The app must NOT:

- calculate decompression;
- recommend depth/time limits;
- imply diving safety guarantees;
- replace dive training.

Required disclaimer:

```text
This app assists with dive preparation only.
It does not replace dive training,
professional instruction,
or certified dive safety procedures.
```

---

# Validation Strategy

## First Prototype

Build only:

- dive context selector;
- adaptive checklist;
- buddy-check.

## Success Criteria

Users say:

```text
This actually helped me prepare and avoid forgetting things.
```

## Validation Targets

- 10 recreational divers;
- 2 instructors or dive guides.

---

# Long-Term Expansion Possibilities

## Phase 2

- gear maintenance tracking;
- travel packing mode;
- instructor briefing mode;
- cloud sync;
- QR checklist sharing.

## Phase 3

- dive center collaboration;
- local dive site packs;
- weather/ocean integrations;
- equipment rental workflows.

---

# Final Technical Verdict

| Metric | Score |
| --- | --- |
| MVP Feasibility | 5/5 |
| Solo Founder Fit | 5/5 |
| Infrastructure Complexity | 1/5 |
| Validation Speed | 5/5 |
| Expansion Potential | 5/5 |

## Final Recommendation

Strong MVP candidate.

Recommended next step:

Build an ultra-small PWA prototype without backend or accounts.
