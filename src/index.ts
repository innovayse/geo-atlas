/**
 * @packageDocumentation
 * @module touchestate/geo-atlas
 *
 * @description Offline countries, states and cities with multilingual support (EN/RU/HY + 15 languages).
 *
 * @license MIT
 *
 * @example
 * import { CountriesAtlas } from '@touchestate/geo-atlas';
 * import { ValidatorAtlas } from '@touchestate/geo-atlas';
 * const countries = CountriesAtlas.getCountries();
 * const country = CountriesAtlas.find('US');
 */

export { default as CountriesAtlas } from './helpers/CountriesAtlas';

export { default as ValidatorAtlas } from './helpers/ValidatorAtlas';

// Types
export type { Country } from './types/country.interface';
export type { State } from './types/state.interface';
export type { City } from './types/city.type';
export type { Timezone } from './types/timezone.type';
export type { Translations } from './types/translation.type';
export type { Currency } from './types/currency.type';
export type { PhoneCode } from './types/phone-code.interface';
export type { StateData } from './types/state-data.type';