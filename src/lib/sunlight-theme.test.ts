/**
 * @vitest-environment jsdom
 */
import { beforeEach, describe, expect, it } from 'vitest'
import { applySunlightMode } from '@/lib/sunlight-theme'

describe('applySunlightMode', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })

  it('enables sunlight theme on document root', () => {
    applySunlightMode(true)
    expect(document.documentElement.dataset.theme).toBe('sunlight')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })

  it('restores default theme', () => {
    applySunlightMode(true)
    applySunlightMode(false)
    expect(document.documentElement.dataset.theme).toBe('default')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })
})
