export const SITE_NAME = 'No Time Coffee';
export const SITE_DESCRIPTION = 'Great coffee for people who live at full speed.';

export const CITIES = ['Amsterdam', 'Arnhem', 'Den Haag'] as const;
export type City = (typeof CITIES)[number];
