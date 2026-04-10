import { State } from "./state.interface";

/** Raw shape of a per-country JSON file containing state/city data. */
export interface StateData {
    /** English country name. */
    name: string;
    /** List of states or administrative divisions. */
    states: State[];
}
