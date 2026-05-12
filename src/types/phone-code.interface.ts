/** International phone/calling code information for a country. */
export interface PhoneCode {
    /** English country name. */
    name: string;
    /** Numeric calling code without leading + (e.g. 374 for Armenia). */
    phone: string | number;
    /** ISO 3166-1 alpha-2 country code. */
    iso2: string;
    /** Formatted phone code with leading + (e.g. "+374"). */
    phone_code?: string;
    /** CSS flag class string (e.g. "flag flag-am"). */
    flag?: string;
    /** Full international phone number format placeholder (e.g. "+374 9X XXX XXX"). */
    phone_format?: string;
}
