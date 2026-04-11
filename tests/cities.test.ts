import { describe, it, expect } from 'vitest'
import CountriesAtlas from '../src/helpers/CountriesAtlas'

describe('CountriesAtlas.getStates — sync (CJS/Node)', () => {
  it('returns states for Armenia', () => {
    const states = CountriesAtlas.getStates('AM')
    expect(states).toBeInstanceOf(Array)
    expect(states!.length).toBeGreaterThan(0)
  })

  it('returns undefined for unknown iso2', () => {
    const result = CountriesAtlas.getStates('XX')
    expect(result).toBeUndefined()
  })

  it('Armenia has >100 cities', () => {
    const states = CountriesAtlas.getStates('AM')!
    const cities = states.flatMap(s => s.cities || [])
    expect(cities.length).toBeGreaterThan(100)
  })

  it('Yerevan has en/ru/hy names', () => {
    const states = CountriesAtlas.getStates('AM')!
    const cities = states.flatMap(s => s.cities || [])
    const yerevan = cities.find(c => c.name === 'Yerevan')

    expect(yerevan).toBeDefined()
    expect(yerevan!.name).toBe('Yerevan')
    expect(yerevan!.translations?.ru).toBe('Ереван')
    expect(yerevan!.translations?.hy).toBeTruthy()
    expect(yerevan!.native).toBeTruthy()
  })

  it('city has valid coordinates', () => {
    const states = CountriesAtlas.getStates('AM')!
    const yerevan = states.flatMap(s => s.cities || []).find(c => c.name === 'Yerevan')!
    expect(parseFloat(yerevan.latitude!)).toBeGreaterThan(0)
    expect(parseFloat(yerevan.longitude!)).toBeGreaterThan(0)
  })
})

describe('CountriesAtlas.getStatesAsync — async (ESM/browser)', () => {
  it('returns states for Armenia', async () => {
    const states = await CountriesAtlas.getStatesAsync('AM')
    expect(states).toBeInstanceOf(Array)
    expect(states.length).toBeGreaterThan(0)
  })

  it('returns empty array for unknown iso2', async () => {
    const result = await CountriesAtlas.getStatesAsync('XX')
    expect(result).toEqual([])
  })

  it('Armenia has >100 cities', async () => {
    const states = await CountriesAtlas.getStatesAsync('AM')
    const cities = states.flatMap(s => s.cities || [])
    expect(cities.length).toBeGreaterThan(100)
  })

  it('Yerevan has en/ru/hy names', async () => {
    const states = await CountriesAtlas.getStatesAsync('AM')
    const cities = states.flatMap(s => s.cities || [])
    const yerevan = cities.find(c => c.name === 'Yerevan')

    expect(yerevan).toBeDefined()
    expect(yerevan!.translations?.ru).toBe('Ереван')
    expect(yerevan!.translations?.hy).toBeTruthy()
  })

  it('US has 66 states', async () => {
    const states = await CountriesAtlas.getStatesAsync('US')
    expect(states).toBeInstanceOf(Array)
    expect(states.length).toBe(66)
  })

  it('results match sync getStates', async () => {
    const sync = CountriesAtlas.getStates('AM')!
    const async_ = await CountriesAtlas.getStatesAsync('AM')
    expect(async_.length).toBe(sync.length)
    expect(async_.map(s => s.name).sort()).toEqual(sync.map(s => s.name).sort())
  })
})
