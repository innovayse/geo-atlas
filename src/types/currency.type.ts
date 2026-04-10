/** Currency information for a country. */
export interface Currency {
    /** English country name. */
    name: string;
    /** ISO 3166-1 alpha-2 country code. */
    iso2: string;
    /** ISO 4217 currency code (e.g. "USD"). */
    currency: string;
    /** Currency symbol (e.g. "$"). */
    currency_symbol?: string;
    /** CSS flag class string (e.g. "flag flag-us"). */
    flag?: string;
    /** Full currency name (e.g. "US Dollar"). */
    currency_name?: string;
}
