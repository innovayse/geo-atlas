# @innovayse/geo-atlas

Offline countries, states and cities database with multilingual support.
Zero API calls — all data is bundled locally.

## Features

- **250 countries** with ISO2 codes, flags, phone codes, capitals, coordinates
- **147,000+ cities** across all countries with coordinates
- **Multilingual names**: English, Russian (ru), Armenian (hy) + 15 more languages
- **Native script** support for each city/country
- **TypeScript** types included
- **Zero dependencies** — fully offline

## Installation

```bash
npm install @innovayse/geo-atlas
```

## Usage

```ts
import { CountriesAtlas } from '@innovayse/geo-atlas'

// Get all countries
const countries = CountriesAtlas.getCountries()
// => [{ iso2: 'AM', name: 'Armenia', native: 'Հայաստան', emoji: '🇦🇲', ... }]

// Get states/regions of a country
const states = CountriesAtlas.getStates('AM')
// => [{ name: 'Yerevan', cities: [...] }]

// Get cities within a state
const cities = states[0].cities
// => [{ name: 'Yerevan', native: 'Երևան', translations: { ru: 'Ереван', hy: 'Երևան' }, ... }]
```

## City Translation Fields

Each city has the following name fields:

| Field | Description | Example |
|-------|-------------|---------|
| `name` | English name | `"Yerevan"` |
| `native` | Native script name | `"Երևան"` |
| `translations.ru` | Russian | `"Ереван"` |
| `translations.hy` | Armenian | `"Երևան"` |
| `translations.fr` | French | `"Erevan"` |
| `translations.de` | German | `"Eriwan"` |

Supported translation keys: `ru`, `hy`, `uk`, `ar`, `zh`, `es`, `fr`, `de`, `it`, `pt`, `pl`, `tr`, `ja`, `ko`, `nl`

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
}
```

## Multilingual Helper (with Nuxt/Vue)

```ts
type GeoLocale = 'en' | 'ru' | 'hy'

function getCityName(city: CityItem, locale: GeoLocale): string {
  if (locale === 'en') return city.name
  return city.translations[locale] ?? city.native ?? city.name
}

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

## License

MIT © [Innovayse](https://github.com/innovayse)
