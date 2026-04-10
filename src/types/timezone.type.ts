/** IANA timezone information for a country. */
export type Timezone = {
    /** IANA timezone name (e.g. "Asia/Yerevan"). */
    zoneName: string;
    /** GMT offset in seconds. */
    gmtOffset: number;
    /** Human-readable GMT offset string (e.g. "UTC+04:00"). */
    gmtOffsetName: string;
    /** Timezone abbreviation (e.g. "AMT"). */
    abbreviation: string;
    /** Full timezone name (e.g. "Armenia Time"). */
    tzName: string;
};
