import { Translations } from "./translation.type";

/** Represents a city within a state/country with optional multilingual data. */
export type City = {
    /** City name in English. */
    name: string;
    /** Decimal latitude, or null if unavailable. */
    latitude: string | null;
    /** Decimal longitude, or null if unavailable. */
    longitude: string | null;
    /** Native name in local script (e.g. "Երևան" for Yerevan) */
    native?: string | null;
    /** Multilingual translations keyed by language code */
    translations?: Translations;
};
