import bundle from '@/content/content.bundle.json'
import type { ContentBundle } from '@/lib/content/types'

export function getDefaultContentBundle(): ContentBundle {
  return structuredClone(bundle) as ContentBundle
}

export const TEMPLATE_IDS = [
  'base',
  'boat',
  'shore',
  'night',
  'cold-water',
  'photo',
  'travel',
  'training',
  'rental',
] as const
