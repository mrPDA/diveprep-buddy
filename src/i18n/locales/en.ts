const en = {
  app: {
    loading: 'Loading…',
  },
  language: {
    label: 'Language',
  },
  context: {
    title: 'What kind of dive are you preparing for?',
    subtitle: 'Choose your dive type and any modifiers to build your checklist.',
    diveType: 'Dive type',
    modifiers: 'Modifiers',
    boat: {
      label: 'Boat Dive',
      description: 'Boat entry, surface interval on board',
    },
    shore: {
      label: 'Shore Dive',
      description: 'Entry from shore or beach',
    },
    nightDive: 'Night Dive',
    coldWater: 'Cold Water',
    photography: 'Photography',
    travel: 'Travel / Trip',
    training: 'Training Dive',
    generate: 'Generate Checklist',
  },
  checklist: {
    title: 'Your checklist',
    subtitle: 'Tap each item as you pack and verify gear.',
    changeContext: 'Change context',
    emptyTitle: 'No checklist yet.',
    emptySubtitle: 'Choose your dive context to generate a preparation checklist.',
    emptyAction: 'Choose dive context',
    progress: 'Progress',
    progressCount: '{{completed}} of {{total}} items',
    critical: 'Critical',
    reset: 'Reset checklist',
    startBuddyCheck: 'Start Buddy Check',
    continueBuddyCheck: 'Continue to Buddy Check',
    categories: {
      'core-gear': 'Core Gear',
      safety: 'Safety',
      exposure: 'Exposure Protection',
      camera: 'Camera / Accessories',
      travel: 'Travel',
      documents: 'Documents / Extras',
    },
  },
  buddyCheck: {
    title: 'Buddy Check',
    subtitle: 'Verify each item physically with your buddy.',
    backToChecklist: '← Back to checklist',
    step: 'Step {{current}} of {{total}}',
    next: 'Next step',
    finish: 'Finish',
    back: 'Back',
  },
  summary: {
    title: 'Preparation reviewed',
    body: 'Remember to verify all equipment physically before entering the water.',
    stats: 'Checklist: {{completed}} of {{total}} items marked complete',
    newDive: 'Prepare for another dive',
    reviewChecklist: 'Review checklist',
  },
  disclaimer: {
    title: 'Before you start',
    p1: 'DivePrep Buddy helps you organize pre-dive preparation.',
    p2: 'It does not replace dive training, professional instruction, certified dive safety procedures, or a dive computer.',
    p3: 'Always verify your equipment physically and follow your training.',
    accept: 'I understand',
  },
  safety: {
    footer: 'Preparation assistant only — not a safety authority.',
  },
  offline: {
    banner: 'Offline mode active. Your checklists still work on this device.',
  },
} as const

export type TranslationTree = typeof en
export default en
