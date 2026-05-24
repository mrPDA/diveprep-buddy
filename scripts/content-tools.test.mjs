import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const bundlePath = join(root, 'src/content/content.bundle.json')

function run(cmd) {
  execSync(cmd, { cwd: root, stdio: 'pipe' })
}

describe('content-tools.mjs', () => {
  it('assemble produces valid bundle with en and ru', () => {
    run('node scripts/content-tools.mjs assemble')
    const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'))
    expect(bundle.locales.en.ui.disclaimer.p1).toBeTruthy()
    expect(bundle.locales.ru.ui.disclaimer.p1).toBeTruthy()
    expect(Object.keys(bundle.locales.en.templates).length).toBeGreaterThan(0)
  })

  it('sync round-trips split files from bundle', () => {
    run('node scripts/content-tools.mjs sync')
    run('node scripts/content-tools.mjs assemble')
    const bundle = JSON.parse(readFileSync(bundlePath, 'utf8'))
    expect(bundle.version).toBe(1)
  })
})
