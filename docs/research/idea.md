# DivePrep Buddy

## One-line summary

Pre-dive preparation assistant that helps divers prepare for a dive, avoid forgotten gear and complete a structured buddy-check.

---

## Problem

Divers can forget important preparation steps or small pieces of gear before a dive, especially during trips, boat dives, night dives, cold-water dives or photo/video dives.

Common issues:

- forgotten accessories or spare parts;
- incomplete buddy-checks;
- poor preparation for specific dive conditions;
- stress before entering the water;
- reliance on memory instead of repeatable process.

## Target Audience

- recreational divers;
- traveling divers;
- beginner and intermediate divers;
- underwater photographers;
- instructors and dive guides as a future B2B segment.

## Solution

A mobile-first assistant that generates context-aware preparation checklists and guides the diver through a simple buddy-check flow.

The product focuses only on preparation and readiness. It is not a logbook, dive computer or decompression planner.

## Core Features

- [ ] Choose dive type: shore, boat, night, cold water, photo/video, training
- [ ] Generate adaptive checklist
- [ ] Mark checklist items as done
- [ ] Run buddy-check flow
- [ ] Save common gear preferences locally
- [ ] Work offline as a PWA
- [ ] Share/export checklist

## User Flow

1. User chooses dive context.
2. App generates a preparation checklist.
3. User checks gear and preparation tasks.
4. User runs buddy-check.
5. App shows preparation completion summary.

## Why This Might Work

The idea solves a concrete pre-dive pain without competing with established logbook or decompression apps. It can be useful even as a simple MVP, requires no complex backend and can be validated quickly with real divers.

## Competitors / Alternatives

| Product / Alternative | Similarity | Difference |
| --- | --- | --- |
| Paper checklists | Helps remember gear | Not adaptive, not interactive, hard to reuse |
| Generic todo apps | Can store checklist | Not dive-specific, no buddy-check logic |
| Dive log apps | Diving-related apps | Usually focus on post-dive logs, not preparation |
| Instructor briefings | Help with safety and prep | Not always personalized or reusable |

## Monetization

Potential later options:

- freemium checklist packs;
- paid travel / photo / cold-water packs;
- instructor or dive-center mode;
- gear service tracker add-on;
- affiliate partnerships with dive gear or insurance providers.

## MVP

The first MVP should be a backend-free PWA:

- dive type selector;
- rule-based checklist engine;
- buddy-check flow;
- local storage;
- offline support.

No accounts, no cloud sync, no weather API, no AI and no decompression logic in the first version.

## Tech Stack Ideas

- Frontend: React, TypeScript, Vite
- UI: Tailwind CSS
- Storage: IndexedDB via Dexie.js or LocalStorage for prototype
- State: Zustand or plain React state
- Hosting: Vercel / Netlify
- Backend: none for MVP

## Risks

- App must not imply it guarantees diving safety.
- A simple checklist may feel too basic unless it is context-aware.
- Content quality matters: checklist templates need input from real divers/instructors.
- Over-expansion into safety recommendations could create liability.

## Validation Plan

- [ ] Build an interactive checklist prototype.
- [ ] Test with 10 recreational divers.
- [ ] Test with 2 instructors or dive guides.
- [ ] Ask whether it would be used before a real dive.
- [ ] Track whether users customize or repeat checklist usage.
- [ ] Validate if it helps prevent forgotten gear or missed steps.

## Priority Scores

See `scorecard.md` for rationale per criterion. Max total: 40.

| Criteria | Score (1-5) |
| --- | --- |
| Pain Strength | 4 |
| Pain Frequency | 4 |
| Willingness To Pay | 3 |
| MVP Simplicity | 5 |
| Distribution Access | 3 |
| Differentiation | 4 |
| Founder Interest | 5 |
| Expansion Potential | 4 |
| **Total** | 32 |

## Current Status

Researching.

## Next Action

Create a tiny PWA prototype with only three flows:

1. choose dive context;
2. generate adaptive checklist;
3. complete buddy-check.
