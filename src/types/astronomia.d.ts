// `astronomia` ships no TypeScript types. These are loose ambient
// declarations covering only the exports src/lib/astro/ephemeris.ts uses.
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "astronomia" {
  export const base: any;
  export const julian: any;
  export const solar: any;
  export const moonposition: any;
  export const nutation: any;
  export const sidereal: any;
  export const planetposition: any;
}

declare module "astronomia/data/*" {
  const data: unknown;
  export default data;
}
