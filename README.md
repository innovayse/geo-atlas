# @innovayse/geo-atlas

Offline countries, states and cities database with complete multilingual support.
Zero API calls — all data is bundled locally.

[![npm version](https://img.shields.io/npm/v/@innovayse/geo-atlas.svg)](https://www.npmjs.com/package/@innovayse/geo-atlas)
[![npm downloads](https://img.shields.io/npm/dm/@innovayse/geo-atlas.svg)](https://www.npmjs.com/package/@innovayse/geo-atlas)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **250 countries** with ISO2 codes, flags, phone codes, capitals, coordinates
- **147,000+ cities** across all countries with coordinates
- **Complete multilingual city names**: English, Russian (ru), Armenian (hy) + 15 more languages
- **Native script** support for each city/country
- **TypeScript** — full type declarations included
- **Zero dependencies** — fully offline, no API calls

## Installation

```bash
npm install @innovayse/geo-atlas
```

## Usage

### Get all countries

```ts
import { CountriesAtlas } from '@innovayse/geo-atlas'

const countries = CountriesAtlas.getCountries()
// [{ iso2: 'AM', name: 'Armenia', native: 'Հայաստան', emoji: '🇦🇲', phone: 374, ... }]
```

### Get states/regions of a country

```ts
const states = CountriesAtlas.getStates('AM')
// [{ name: 'Yerevan', cities: [...] }, ...]
```

### Get cities

```ts
const cities = states[0].cities
// [{ name: 'Yerevan', native: 'Երևան', translations: { ru: 'Ереван', hy: 'Երևան' }, ... }]
```

## City Translation Fields

Each city includes:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | English name | `"Yerevan"` |
| `native` | Native script | `"Երևան"` |
| `translations.ru` | Russian | `"Ереван"` |
| `translations.hy` | Armenian | `"Երևան"` |
| `translations.fr` | French | `"Erevan"` |
| `translations.de` | German | `"Eriwan"` |
| `translations.zh` | Chinese | `"埃里温"` |
| `translations.ar` | Arabic | `"يريفان"` |

**Supported translation keys:** `ru`, `hy`, `uk`, `ar`, `zh`, `es`, `fr`, `de`, `it`, `pt`, `pl`, `tr`, `ja`, `ko`, `nl`

## Country Fields

```ts
type Country = {
  iso2: string        // 'AM'
  name: string        // 'Armenia'
  native: string      // 'Հայաստան'
  emoji: string       // '🇦🇲'
  capital: string     // 'Yerevan'
  phone: number       // 374
  latitude: string    // '40.0'
  longitude: string   // '45.0'
  translations: Record<string, string>
  currency: string    // 'AMD'
  timezones: Timezone[]
}
```

## Multilingual Helper (Nuxt/Vue)

```ts
type GeoLocale = 'en' | 'ru' | 'hy'

/** Get localized city name with fallback */
function getCityName(city: CityItem, locale: GeoLocale): string {
  if (locale === 'en') return city.name
  return city.translations[locale] ?? city.native ?? city.name
}

/** Get localized country name with fallback */
function getCountryName(country: CountryItem, locale: GeoLocale): string {
  if (locale === 'en') return country.name
  return country.translations[locale] ?? country.native ?? country.name
}
```

## Nuxt 3 / SSR Setup

Add to `nuxt.config.ts`:

```ts
vite: {
  ssr: {
    noExternal: ['@innovayse/geo-atlas']
  }
}
```

## Validation

```ts
import { ValidatorAtlas } from '@innovayse/geo-atlas'

ValidatorAtlas.isValidCountry('AM')   // true
ValidatorAtlas.isValidState('AM', 'Yerevan')  // true
```

## License

MIT © [Innovayse](https://github.com/innovayse)
