#!/usr/bin/env node
/**
 * Content bundle tools — one file instead of many JSONs.
 *
 *   node scripts/content-tools.mjs assemble   → build content.bundle.json from split files
 *   node scripts/content-tools.mjs apply <file> → write bundle + sync split files
 *   node scripts/content-tools.mjs sync       → split files ← content.bundle.json
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(fileURLToPath(dirname(import.meta.url)), '..')
const contentDir = join(root, 'src/content')
const bundlePath = join(contentDir, 'content.bundle.json')
const appMetaPath = join(contentDir, 'app-meta.json')
const localesConfigPath = join(contentDir, 'locales.config.json')

const TEMPLATE_IDS = [
  'base',
  'boat',
  'shore',
  'night',
  'cold-water',
  'photo',
  'travel',
  'training',
]

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function writeJson(path, data) {
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function templatesForLocale(locale) {
  const out = {}
  for (const id of TEMPLATE_IDS) {
    const path = join(contentDir, 'locales', locale, 'templates', `${id}.json`)
    if (existsSync(path)) {
      out[id] = readJson(path)
    }
  }
  return out
}

function assembleBundle() {
  const bundle = {
    version: 1,
    updatedAt: new Date().toISOString(),
    appMeta: readJson(appMetaPath),
    localesConfig: readJson(localesConfigPath),
    locales: {
      en: {
        ui: readJson(join(contentDir, 'locales/en/ui.json')),
        buddyCheck: readJson(join(contentDir, 'locales/en/buddy-check.json')),
        templates: templatesForLocale('en'),
      },
      ru: {
        ui: readJson(join(contentDir, 'locales/ru/ui.json')),
        buddyCheck: readJson(join(contentDir, 'locales/ru/buddy-check.json')),
        templates: templatesForLocale('ru'),
      },
    },
  }
  validateBundle(bundle)
  writeJson(bundlePath, bundle)
  console.log(`Wrote ${bundlePath}`)
}

function validateBundle(bundle) {
  if (!bundle?.appMeta?.name) throw new Error('bundle.appMeta.name required')
  if (!bundle?.locales?.en || !bundle?.locales?.ru) {
    throw new Error('bundle.locales.en and bundle.locales.ru required')
  }
}

function syncSplitFiles(bundle) {
  validateBundle(bundle)
  writeJson(appMetaPath, bundle.appMeta)
  if (bundle.localesConfig) {
    writeJson(localesConfigPath, bundle.localesConfig)
  }

  for (const locale of ['en', 'ru']) {
    const data = bundle.locales[locale]
    writeJson(join(contentDir, 'locales', locale, 'ui.json'), data.ui)
    writeJson(join(contentDir, 'locales', locale, 'buddy-check.json'), data.buddyCheck)
    for (const [id, template] of Object.entries(data.templates)) {
      writeJson(
        join(contentDir, 'locales', locale, 'templates', `${id}.json`),
        template,
      )
    }
  }
  console.log('Synced split JSON files from bundle')
}

function applyFromFile(filePath) {
  const bundle = readJson(filePath)
  validateBundle(bundle)
  bundle.updatedAt = new Date().toISOString()
  writeJson(bundlePath, bundle)
  syncSplitFiles(bundle)
  console.log(`Applied ${filePath} → ${bundlePath}`)
}

const [command, arg] = process.argv.slice(2)

switch (command) {
  case 'assemble':
    assembleBundle()
    break
  case 'apply':
    if (!arg) {
      console.error('Usage: node scripts/content-tools.mjs apply <file.json>')
      process.exit(1)
    }
    applyFromFile(arg)
    break
  case 'sync':
    syncSplitFiles(readJson(bundlePath))
    break
  default:
    console.log(`Usage:
  npm run content:assemble
  npm run content:apply -- path/to/export.json
  npm run content:sync`)
    process.exit(command ? 1 : 0)
}
