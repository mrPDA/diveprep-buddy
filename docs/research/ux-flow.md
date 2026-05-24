# DivePrep Buddy — UX Flow

## Goal

Design the simplest possible pre-dive preparation experience for divers.

The product should reduce stress and forgotten items before entering the water.

---

# Primary User Scenario

A diver is preparing for a dive trip or is already at the dive site.

The diver wants to:

- quickly verify preparation;
- avoid forgetting critical gear;
- complete buddy-check calmly;
- avoid cognitive overload.

The diver may:

- be outdoors in bright sunlight;
- have wet hands;
- be distracted or rushed;
- have weak internet connection.

---

# UX Principles

## Core UX Direction

The app should feel:

- calm;
- fast;
- trustworthy;
- lightweight;
- focused.

The app should NOT feel:

- like a productivity dashboard;
- like a dive computer;
- like enterprise software;
- overloaded with controls.

---

# Primary User Journey

```text
Open app
  ↓
Choose dive context
  ↓
Generate checklist
  ↓
Review and complete items
  ↓
Run buddy-check
  ↓
Ready-to-dive summary
```

Target total interaction time:

```text
1-3 minutes
```

---

# Core Flow

## Step 1 — Context Selection

User selects:

- shore / boat;
- night dive;
- cold water;
- photography;
- training dive.

### UX Notes

- use large touch targets;
- avoid dropdowns;
- use card-based selection;
- support one-hand usage.

---

## Step 2 — Checklist Review

Generated checklist appears immediately.

### Checklist Rules

- grouped by category;
- short labels;
- large checkbox targets;
- visible progress;
- minimal scrolling.

### Suggested Categories

- Core Gear
- Safety
- Exposure Protection
- Camera / Accessories
- Documents / Extras

---

## Step 3 — Buddy Check

Interactive step-by-step flow.

Recommended sequence:

```text
BCD → Weights → Releases → Air → Final OK
```

### UX Notes

- one step per screen;
- swipe or tap navigation;
- avoid dense tables;
- use very large buttons.

---

## Step 4 — Ready Summary

Final screen:

```text
Preparation reviewed.
Remember to verify all equipment physically before entering the water.
```

Avoid wording like:

```text
You are safe to dive.
```

---

# Recommended Screen List

## MVP Screens

1. Home / Context Selection
2. Checklist Screen
3. Buddy Check Flow
4. Ready Summary
5. Settings (minimal)

---

# First Screen Recommendation

The first screen should immediately ask:

```text
What kind of dive are you preparing for?
```

Suggested layout:

```text
[ Boat Dive ]
[ Shore Dive ]
[ Night Dive ]
[ Cold Water ]
[ Photography ]
```

Then:

```text
Generate Checklist
```

No onboarding.
No registration.
No tutorial.

---

# Key UI Components

## Components Needed

- large checklist cards;
- category sections;
- progress indicator;
- swipe cards for buddy-check;
- offline indicator;
- emergency readability mode.

---

# Visual Direction

## Recommended Style

- dark neutral palette;
- high contrast;
- minimal gradients;
- low visual noise;
- readable in sunlight.

## Typography

- large font sizes;
- short labels;
- avoid long paragraphs.

---

# Empty States

## No Checklist Generated Yet

```text
Choose a dive type to generate your preparation checklist.
```

## No Preferences Saved

```text
You can optionally save your common dive setup later.
```

---

# Error / Edge States

## Offline Mode

```text
Offline mode active.
Your saved checklists are still available.
```

## Very Long Checklist

If too many conditions are selected:

- collapse categories;
- prioritize critical items first.

---

# Accessibility Notes

Important for diving context:

- readable in sunlight;
- large touch targets;
- support wet or shaky hands;
- avoid tiny controls;
- avoid color-only meaning;
- support low cognitive load.

---

# UX Risks

## Risk 1 — App Feels Like Generic Todo List

Mitigation:

- dive-specific context;
- adaptive checklist generation;
- buddy-check flow.

---

## Risk 2 — Checklist Too Long

Mitigation:

- progressive disclosure;
- category grouping;
- critical-first ordering.

---

## Risk 3 — Too Much Setup

Mitigation:

- no required account;
- no forced personalization;
- usable immediately.

---

# Prototype Requirements

The first prototype should include only:

- dive context selector;
- generated checklist;
- checklist completion;
- buddy-check swipe flow.

No backend required.

Recommended prototype format:

```text
mobile-first PWA
```

---

# UX Validation Plan

Observe:

- can users start within 10 seconds?;
- do users understand the first screen immediately?;
- do users finish checklist flow?;
- do users skip buddy-check?;
- do users reopen the app before another dive?

---

# Next UX Action

Create low-fidelity mobile wireframes for:

1. dive context screen;
2. checklist screen;
3. buddy-check screen;
4. ready summary screen.
