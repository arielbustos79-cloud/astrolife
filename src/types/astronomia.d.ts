declare module "astronomia/solar" {
  export function apparentLongitude(T: number): number;
  export function trueLongitude(T: number): { lon: number; ano: number };
}

declare module "astronomia/planetposition" {
  export class Planet {
    constructor(data: unknown);
    position(jde: number): { lon: number; lat: number; range: number };
  }
}

declare module "astronomia/data" {
  const data: {
    mercury: unknown;
    venus: unknown;
    earth: unknown;
    mars: unknown;
    jupiter: unknown;
    saturn: unknown;
    uranus: unknown;
    neptune: unknown;
    [key: string]: unknown;
  };
  export default data;
}

declare module "astronomia/julian" {
  export function CalendarGregorianToJD(y: number, m: number, d: number): number;
  export function JDToCalendar(jd: number): { year: number; month: number; day: number };
}

declare module "astronomia/base" {
  export function J2000Century(jd: number): number;
}

// Catch-all for the main astronomia package (used in ephemeris.ts)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module "astronomia" {
  export const planetposition: any;
  export const solar: any;
  export const moonposition: any;
  export const nutation: any;
  export const sidereal: any;
  export const julian: any;
  export const base: any;
}

declare module "astronomia/data/vsop87Bearth" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bvenus" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bmars" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bsaturn" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bjupiter" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Buranus" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bneptune" { const d: unknown; export default d; }
declare module "astronomia/data/vsop87Bmercury" { const d: unknown; export default d; }
