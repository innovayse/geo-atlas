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