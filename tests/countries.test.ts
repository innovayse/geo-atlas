import { describe, it, expect } from 'vitest'
import CountriesAtlas from '../src/helpers/CountriesAtlas'

describe('CountriesAtlas — country data', () => {
  it('returns all 250 countries', () => {
    const countries = CountriesAtlas.getCountries()
    expect(countries).toBeInstanceOf(Array)
    expect(countries).toHaveLength(250)
  })

  it('finds country by ISO2 (case-insensitive)', () => {
    expect(CountriesAtlas.find('AM')?.name).toBe('Armenia')
    expect(CountriesAtlas.find('am')?.name).toBe('Armenia')
    expect(CountriesAtlas.find('US')?.name).toBe('United States')
    expect(CountriesAtlas.find('XX')).toBeUndefined()
  })

  it('finds country by ISO3', () => {
    expect(CountriesAtlas.findByIso3('ARM')?.name).toBe('Armenia')
    expect(CountriesAtlas.findByIso3('USA')?.name).toBe('United States')
  })

  it('every country has required fields', () => {
    const countries = CountriesAtlas.getCountries()
    for (const c of countries) {
      expect(c.name, `${c.name} missing name`).toBeTruthy()
      expect(c.iso2, `${c.name} missing iso2`).toBeTruthy()
      expect(c.emoji, `${c.name} missing emoji`).toBeTruthy()
    }
  })
})

describe('CountriesAtlas — multilingual translations', () => {
  it('Armenia has hy and ru translations', () => {
    const am = CountriesAtlas.find('AM')
    expect(am?.translations?.hy).toBe('Հայաստան')
    expect(am?.translations?.ru).toBe('Армения')
  })

  it('UAE has hy translation', () => {
    const ae = CountriesAtlas.find('AE')
    expect(typeof ae?.translations?.hy).toBe('string')
    expect(ae!.translations!.hy!.length).toBeGreaterThan(0)
  })

  it('Russia has hy and ru translations', () => {
    const ru = CountriesAtlas.find('RU')
    expect(typeof ru?.translations?.hy).toBe('string')
    expect(ru?.translations?.ru).toBeTruthy()
  })

  it('all 250 countries have hy translation', () => {
    const missing = CountriesAtlas.getCountries().filter(
      c => !c.translations?.hy
    )
    expect(missing.map(c => c.name)).toEqual([])
  })

  it('all 250 countries have ru translation', () => {
    const missing = CountriesAtlas.getCountries().filter(
      c => !c.translations?.ru
    )
    expect(missing.map(c => c.name)).toEqual([])
  })
})
