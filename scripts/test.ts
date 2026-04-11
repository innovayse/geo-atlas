#!/usr/bin/env ts-node
/**
 * Smoke tests for @innovayse/geo-atlas package.
 * Verifies CJS (getStates) and ESM-compatible (getStatesAsync) entry points,
 * multilingual translations (en/ru/hy), and city data integrity.
 *
 * Run: npm test
 */

import CountriesAtlas from '../src/helpers/CountriesAtlas'

let passed = 0
let failed = 0

/** Assert helper — logs result and tracks pass/fail count. */
function assert(condition: boolean, message: string): void {
  if (condition) {
    console.log(`  ✓ ${message}`)
    passed++
  } else {
    console.error(`  ✗ ${message}`)
    failed++
  }
}

async function run(): Promise<void> {
  // ── Country data ───────────────────────────────────────────────────────
  console.log('\n[Countries]')

  const countries = CountriesAtlas.getCountries()
  assert(Array.isArray(countries), 'getCountries() returns array')
  assert(countries.length === 250, `getCountries() has 250 entries (got ${countries.length})`)

  const am = CountriesAtlas.find('AM')
  assert(am?.name === 'Armenia', `find('AM') returns Armenia (got ${am?.name})`)
  assert(am?.translations?.hy === 'Հայաստան', `Armenia hy: "${am?.translations?.hy}"`)
  assert(am?.translations?.ru === 'Армения', `Armenia ru: "${am?.translations?.ru}"`)

  const ae = CountriesAtlas.find('AE')
  assert(
    typeof ae?.translations?.hy === 'string' && ae.translations.hy.length > 0,
    `UAE hy: "${ae?.translations?.hy}"`
  )

  const us = CountriesAtlas.find('US')
  assert(
    typeof us?.translations?.ru === 'string' && us.translations.ru.length > 0,
    `USA ru: "${us?.translations?.ru}"`
  )

  // ── Sync getStates (CJS / Node.js) ────────────────────────────────────
  console.log('\n[getStates — sync/CJS]')

  const amStates = CountriesAtlas.getStates('AM')
  assert(Array.isArray(amStates) && amStates.length > 0, `getStates('AM') has states (got ${amStates?.length})`)

  const amCities = amStates!.flatMap(s => s.cities || [])
  assert(amCities.length > 100, `Armenia has >100 cities (got ${amCities.length})`)

  const yerevan = amCities.find(c => c.name === 'Yerevan')
  assert(yerevan !== undefined, 'Yerevan found in Armenia')
  assert(yerevan?.translations?.ru === 'Ереван', `Yerevan ru: "${yerevan?.translations?.ru}"`)
  assert(
    typeof yerevan?.translations?.hy === 'string' && yerevan.translations.hy.length > 0,
    `Yerevan hy: "${yerevan?.translations?.hy}"`
  )

  // ── Async getStatesAsync (ESM / browser-compatible) ───────────────────
  console.log('\n[getStatesAsync — async/ESM]')

  const amStatesAsync = await CountriesAtlas.getStatesAsync('AM')
  assert(Array.isArray(amStatesAsync) && amStatesAsync.length > 0,
    `getStatesAsync('AM') has states (got ${amStatesAsync.length})`)

  const amCitiesAsync = amStatesAsync.flatMap(s => s.cities || [])
  assert(amCitiesAsync.length > 100, `Armenia has >100 cities async (got ${amCitiesAsync.length})`)

  const yerevanAsync = amCitiesAsync.find(c => c.name === 'Yerevan')
  assert(yerevanAsync?.translations?.ru === 'Ереван', `Yerevan ru async: "${yerevanAsync?.translations?.ru}"`)
  assert(
    typeof yerevanAsync?.translations?.hy === 'string' && yerevanAsync.translations.hy.length > 0,
    `Yerevan hy async: "${yerevanAsync?.translations?.hy}"`
  )

  const usStates = await CountriesAtlas.getStatesAsync('US')
  assert(Array.isArray(usStates) && usStates.length > 0,
    `getStatesAsync('US') has states (got ${usStates.length})`)

  const unknown = await CountriesAtlas.getStatesAsync('XX')
  assert(Array.isArray(unknown) && unknown.length === 0,
    `getStatesAsync('XX') returns empty array for unknown iso2`)

  // ── Results ────────────────────────────────────────────────────────────
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`Results: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  } else {
    console.log('All tests passed ✓')
  }
}

run().catch(err => {
  console.error('Test error:', err)
  process.exit(1)
})
