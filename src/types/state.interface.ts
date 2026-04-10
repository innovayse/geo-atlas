import { City } from "./city.type";

/** Represents a state or administrative division within a country. */
export interface State {
    /** State or province name in English. */
    name: string;
    /** Short state code (e.g. "CA" for California). */
    state_code: string;
    /** Decimal latitude of the state's geographic center, or null if unavailable. */
    latitude: string | null;
    /** Decimal longitude of the state's geographic center, or null if unavailable. */
    longitude: string | null;
    /** Cities within this state. */
    cities?: City[];
}