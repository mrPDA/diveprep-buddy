/** Forbidden UI phrases — docs/implementation/safety-copy.md */
export const FORBIDDEN_UI_PHRASES: RegExp[] = [
  /you are safe to dive/i,
  /guaranteed safe/i,
  /certified ready/i,
  /\bndl\b/i,
  /decompression (plan|table|stop|advice)/i,
  /gas mix/i,
  /medical clearance/i,
  /\bis safe\b/i,
]

export const REQUIRED_DISCLAIMER_MARKERS = {
  en: [
    'does not replace dive training',
    'dive computer',
    'verify',
  ],
  ru: [
    'не заменяет обучение',
    'дайв-компьютер',
    'провер',
  ],
} as const

export const REQUIRED_SAFETY_FOOTER_MARKERS = {
  en: ['not a safety authority', 'Preparation assistant'],
  ru: ['не источник решений', 'помощник подготовки'],
} as const

export function collectUserFacingStrings(value: unknown, path = ''): string[] {
  if (typeof value === 'string') {
    return [value]
  }
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      collectUserFacingStrings(item, `${path}[${index}]`),
    )
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, nested]) => collectUserFacingStrings(nested, path ? `${path}.${key}` : key),
    )
  }
  return []
}

export function findForbiddenPhrases(strings: string[]): string[] {
  const hits: string[] = []
  for (const text of strings) {
    for (const pattern of FORBIDDEN_UI_PHRASES) {
      if (pattern.test(text)) {
        hits.push(`"${text}" matches ${pattern}`)
      }
    }
  }
  return hits
}
