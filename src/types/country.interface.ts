import { Timezone } from "./timezone.type";
import { Translations } from "./translation.type";

/** Represents a country with all its metadata and multilingual translations. */
export interface Country {
    /** ISO 3166-1 alpha-2 country code (e.g. "AM"). */
    iso2?: string;
    /** ISO 3166-1 alpha-3 country code (e.g. "ARM"). */
    iso3?: string;
    /** English name of the country. */
    name?: string;
    /** Native name in the local script (e.g. "Հայաստան"). */
    native?: string;
    /** International dialing code (without leading +). */
    phone?: string | number;
    /** Continent name. */
    continent?: string;
    /** Capital city name. */
    capital?: string;
    /** ISO 4217 currency code (e.g. "AMD"). */
    currency?: string;
    /** Currency symbol (e.g. "֏"). */
    currency_symbol?: string;
    /** Full currency name (e.g. "Armenian Dram"). */
    currency_name?: string;
    /** ISO 639-1 language codes spoken in this country. */
    languages?: string[] | string;
    /** World region (e.g. "Asia"). */
    region?: string;
    /** World subregion (e.g. "Western Asia"). */
    subregion?: string;
    /** List of timezones used in this country. */
    timezones?: Timezone[];
    /** Multilingual name translations keyed by language code. */
    translations?: Translations;
    /** Decimal latitude of the country's geographic center. */
    latitude?: string;
    /** Decimal longitude of the country's geographic center. */
    longitude?: string;
    /** Country flag emoji character (e.g. "🇦🇲"). */
    emoji?: string;
    /** Unicode codepoint representation of the flag emoji. */
    emojiU?: string;
    /** Legacy code field (same as iso2 in some datasets). */
    code?: string;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
