#!/usr/bin/env node
/**
 * Test suite hygiene audit — run via npm run test:audit
 * Agents: fix actionable warnings; justify budget exceed in n4l decision.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { join, relative, basename, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(dirname(import.meta.url)), '..')
const BUDGET_SOFT = 60
const BUDGET_HARD = 80

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    const st = statSync(path)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue
      walk(path, acc)
    } else if (/\.(test|spec)\.(ts|tsx|mjs)$/.test(name)) {
      acc.push(path)
    }
  }
  return acc
}

function countTests(source) {
  const itBlocks = (source.match(/\bit(?:\.(?:only|skip|todo|each))?\s*\(/g) ?? []).length
  const testBlocks = (source.match(/\btest(?:\.(?:only|skip|todo|each))?\s*\(/g) ?? []).length
  return itBlocks + testBlocks
}

function sourceForTest(testPath) {
  const rel = relative(root, testPath)
  if (rel.startsWith('scripts/')) {
    return join(root, 'scripts', basename(testPath).replace(/\.test\.mjs$/, '.mjs'))
  }
  if (rel.includes('/test/')) return null
  return testPath.replace(/\.test\.(ts|tsx)$/, '.$1')
}

const testFiles = [
  ...walk(join(root, 'src')),
  ...walk(join(root, 'scripts')),
]

let totalTests = 0
const byFile = []
const warnings = []

for (const file of testFiles) {
  const source = readFileSync(file, 'utf8')
  const count = countTests(source)
  totalTests += count
  byFile.push({ file: relative(root, file), count })
}

byFile.sort((a, b) => b.count - a.count)

for (const { file, count } of byFile) {
  if (count > 15) {
    warnings.push(`Heavy file (${count} tests): ${file} — consider table-driven or split by concern`)
  }
}

const srcLib = join(root, 'src/lib')
if (existsSync(srcLib)) {
  for (const name of readdirSync(srcLib, { recursive: true })) {
    if (typeof name !== 'string' || !name.endsWith('.ts') || name.endsWith('.test.ts')) continue
    const tsPath = join(srcLib, name)
    if (!statSync(tsPath).isFile()) continue
    const testPath = tsPath.replace(/\.ts$/, '.test.ts')
    const hasLogic = !name.endsWith('.test.ts') && readFileSync(tsPath, 'utf8').match(/export (function|const|class)/)
    if (hasLogic && !existsSync(testPath) && !name.includes('paths')) {
      warnings.push(`Untested export module: ${relative(root, tsPath)} — add *.test.ts if logic changed recently`)
    }
  }
}

for (const testPath of testFiles) {
  const src = sourceForTest(testPath)
  if (src && !existsSync(src)) {
    warnings.push(`Orphan test (source missing): ${relative(root, testPath)}`)
  }
}

console.log('=== Test audit ===')
console.log(`Files: ${testFiles.length}`)
console.log(`Tests (it/test blocks): ${totalTests}`)
console.log(`Budget: soft ${BUDGET_SOFT}, hard ${BUDGET_HARD}`)
console.log('')

if (totalTests > BUDGET_HARD) {
  console.log(`❌ HARD BUDGET EXCEEDED (${totalTests} > ${BUDGET_HARD})`)
  console.log('   → notes_decision_save required before adding more tests')
} else if (totalTests > BUDGET_SOFT) {
  console.log(`⚠️  Soft budget exceeded (${totalTests} > ${BUDGET_SOFT}) — avoid new tests unless regression`)
} else {
  console.log('✅ Within budget')
}

console.log('\nTop files by test count:')
for (const row of byFile.slice(0, 8)) {
  console.log(`  ${row.count.toString().padStart(3)}  ${row.file}`)
}

if (warnings.length) {
  console.log('\nWarnings:')
  for (const w of warnings) console.log(`  ⚠️  ${w}`)
} else {
  console.log('\nNo hygiene warnings.')
}

process.exit(totalTests > BUDGET_HARD ? 1 : 0)
