import { afterEach, describe, expect, it, vi } from 'vitest'

describe('admin access (security)', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('disables admin in production-like env', async () => {
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_CONTENT_STUDIO', false)
    const { isAdminEnabled, isContentStudio } = await import('@/lib/env')
    expect(isAdminEnabled).toBe(false)
    expect(isContentStudio).toBe(false)
  })

  it('enables admin only in dev or content studio', async () => {
    vi.stubEnv('DEV', true)
    vi.stubEnv('VITE_CONTENT_STUDIO', false)
    const dev = await import('@/lib/env')
    expect(dev.isAdminEnabled).toBe(true)

    vi.resetModules()
    vi.stubEnv('DEV', false)
    vi.stubEnv('VITE_CONTENT_STUDIO', true)
    const studio = await import('@/lib/env')
    expect(studio.isAdminEnabled).toBe(true)
    expect(studio.isContentStudio).toBe(true)
  })
})
