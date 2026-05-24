const ru = {
  app: {
    loading: 'Загрузка…',
  },
  language: {
    label: 'Язык',
  },
  context: {
    title: 'К какому погружению вы готовитесь?',
    subtitle: 'Выберите тип погружения и модификаторы для чеклиста.',
    diveType: 'Тип погружения',
    modifiers: 'Модификаторы',
    boat: {
      label: 'С лодки',
      description: 'Вход с борта, декомпрессия на борту',
    },
    shore: {
      label: 'С берега',
      description: 'Вход с берега или пляжа',
    },
    nightDive: 'Ночное',
    coldWater: 'Холодная вода',
    photography: 'Фото / видео',
    travel: 'Поездка',
    training: 'Учебное',
    generate: 'Создать чеклист',
  },
  checklist: {
    title: 'Ваш чеклист',
    subtitle: 'Отмечайте пункты по мере сборки и проверки снаряжения.',
    changeContext: 'Сменить контекст',
    emptyTitle: 'Чеклиста пока нет.',
    emptySubtitle: 'Выберите контекст погружения, чтобы создать чеклист подготовки.',
    emptyAction: 'Выбрать контекст',
    progress: 'Прогресс',
    progressCount: '{{completed}} из {{total}} пунктов',
    critical: 'Важно',
    reset: 'Сбросить чеклист',
    startBuddyCheck: 'Начать buddy-check',
    continueBuddyCheck: 'Перейти к buddy-check',
    categories: {
      'core-gear': 'Основное снаряжение',
      safety: 'Безопасность',
      exposure: 'Термозащита',
      camera: 'Камера / аксессуары',
      travel: 'Поездка',
      documents: 'Документы / прочее',
    },
  },
  buddyCheck: {
    title: 'Buddy-check',
    subtitle: 'Проверьте каждый пункт физически вместе с напарником.',
    backToChecklist: '← К чеклисту',
    step: 'Шаг {{current}} из {{total}}',
    next: 'Далее',
    finish: 'Завершить',
    back: 'Назад',
  },
  summary: {
    title: 'Подготовка проверена',
    body: 'Помните: перед входом в воду проверьте всё снаряжение физически.',
    stats: 'Чеклист: {{completed}} из {{total}} пунктов отмечено',
    newDive: 'Подготовиться к другому погружению',
    reviewChecklist: 'Просмотреть чеклист',
  },
  disclaimer: {
    title: 'Перед началом',
    p1: 'DivePrep Buddy помогает организовать подготовку к погружению.',
    p2: 'Он не заменяет обучение дайвингу, инструктаж инструктора, сертифицированные процедуры безопасности или дайв-компьютер.',
    p3: 'Всегда проверяйте снаряжение физически и следуйте своей подготовке.',
    accept: 'Понятно',
  },
  safety: {
    footer: 'Только помощник подготовки — не источник решений по безопасности.',
  },
  offline: {
    banner: 'Офлайн-режим. Чеклисты работают на этом устройстве.',
  },
} as const

export default ru
