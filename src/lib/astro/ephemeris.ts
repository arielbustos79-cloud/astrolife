import { planetposition, solar, moonposition, nutation, sidereal, julian, base } from "astronomia";
import earthData from "astronomia/data/vsop87Bearth";
import venusData from "astronomia/data/vsop87Bvenus";
import marsData from "astronomia/data/vsop87Bmars";
import saturnData from "astronomia/data/vsop87Bsaturn";
import { ZODIAC_SIGNS, type ZodiacSign } from "@/lib/zodiac";

// Real astronomical calculations (Meeus algorithms via the `astronomia`
// package): geocentric apparent tropical ecliptic longitudes for the Sun,
// Moon, Venus, Mars and Saturn, plus the Ascendant/Midheaven from the birth
// time and place. Houses use the whole-sign system (house 1 = the sign
// containing the Ascendant) rather than Placidus, since whole-sign houses
// need no iterative solving and are a legitimate, long-used house system.

export type BirthInput = {
  /** Local calendar date at the birth place, "YYYY-MM-DD". */
  date: string;
  /** Local clock time at the birth place, 24h "HH:MM". */
  time: string;
  /** Standard UTC offset in hours, e.g. -4 for Chile continental (negative = west of Greenwich). */
  utcOffsetHours: number;
  /** Degrees, north positive. */
  latitude: number;
  /** Degrees, east positive. */
  longitude: number;
};

export type ChartPoint = {
  longitude: number; // absolute ecliptic longitude, 0-360
  sign: ZodiacSign;
  degree: number; // 0-30, position within the sign
};

export type PlanetChartPoint = ChartPoint & { house: number };

export type NatalChart = {
  sun: PlanetChartPoint;
  moon: PlanetChartPoint;
  venus: PlanetChartPoint;
  mars: PlanetChartPoint;
  saturn: PlanetChartPoint;
  ascendant: ChartPoint;
  midheaven: ChartPoint;
};

const LIGHT_TIME_AU_DAYS = 0.0057755183;

function toChartPoint(lonDeg: number): ChartPoint {
  const normalized = ((lonDeg % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  return {
    longitude: normalized,
    sign: ZODIAC_SIGNS[signIndex],
    degree: normalized - signIndex * 30,
  };
}

function birthInputToUtcDate(input: BirthInput): Date {
  const [year, month, day] = input.date.split("-").map(Number);
  const [hour, minute] = input.time.split(":").map(Number);
  const naiveUtcMs = Date.UTC(year, month - 1, day, hour, minute, 0);
  return new Date(naiveUtcMs - input.utcOffsetHours * 3600 * 1000);
}

/** Heliocentric VSOP87 positions of `series` and Earth, converted to a
 * geocentric ecliptic longitude via rectangular vector subtraction, with one
 * light-time correction iteration (Meeus ch. 33). */
function geocentricLongitudeFromHeliocentric(series: unknown, jde: number): number {
  const planet = new planetposition.Planet(series);
  const earth = new planetposition.Planet(earthData);

  let tau = 0;
  let lonRad = 0;
  for (let i = 0; i < 2; i++) {
    const p = planet.position(jde - tau);
    const e = earth.position(jde);

    const px = p.range * Math.cos(p.lat) * Math.cos(p.lon);
    const py = p.range * Math.cos(p.lat) * Math.sin(p.lon);
    const pz = p.range * Math.sin(p.lat);
    const ex = e.range * Math.cos(e.lat) * Math.cos(e.lon);
    const ey = e.range * Math.cos(e.lat) * Math.sin(e.lon);
    const ez = e.range * Math.sin(e.lat);

    const x = px - ex;
    const y = py - ey;
    const z = pz - ez;
    const dist = Math.sqrt(x * x + y * y + z * z);
    lonRad = Math.atan2(y, x);
    tau = LIGHT_TIME_AU_DAYS * dist;
  }
  return base.toDeg(lonRad);
}

function wholeSignHouse(pointSignIndex: number, ascendantSignIndex: number): number {
  return ((pointSignIndex - ascendantSignIndex + 12) % 12) + 1;
}

export function calculateNatalChart(input: BirthInput): NatalChart {
  const utcDate = birthInputToUtcDate(input);
  const jde = julian.DateToJDE(utcDate);
  const jd = julian.DateToJD(utcDate);

  const [nutationLon, nutationObliquity] = nutation.nutation(jde);
  const meanObliquity = nutation.meanObliquity(jde);
  const trueObliquity = meanObliquity + nutationObliquity;

  // Sun: astronomia's solar module returns the apparent geocentric
  // longitude directly from Earth's heliocentric position.
  const earthPlanet = new planetposition.Planet(earthData);
  const sunLonDeg = base.toDeg(solar.apparentVSOP87(earthPlanet, jde).lon);

  // Moon: geocentric already; astronomia explicitly excludes nutation, add it.
  const moonRaw = moonposition.position(jde);
  const moonLonDeg = base.toDeg(moonRaw.lon + nutationLon);

  const venusLonDeg = geocentricLongitudeFromHeliocentric(venusData, jde) + base.toDeg(nutationLon);
  const marsLonDeg = geocentricLongitudeFromHeliocentric(marsData, jde) + base.toDeg(nutationLon);
  const saturnLonDeg = geocentricLongitudeFromHeliocentric(saturnData, jde) + base.toDeg(nutationLon);

  // Ascendant / Midheaven from local sidereal time at the birth place.
  const gstSeconds = sidereal.apparent(jd);
  const gstDeg = gstSeconds / 240; // 86400s = 360deg
  const ramcDeg = ((gstDeg + input.longitude) % 360 + 360) % 360;
  const ramc = base.toRad(ramcDeg);
  const latRad = base.toRad(input.latitude);

  const mcLonRad = Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(trueObliquity));
  const ascLonRad = Math.atan2(
    Math.cos(ramc),
    -(Math.sin(trueObliquity) * Math.tan(latRad) + Math.cos(trueObliquity) * Math.sin(ramc)),
  );

  const ascendant = toChartPoint(base.toDeg(ascLonRad));
  const midheaven = toChartPoint(base.toDeg(mcLonRad));
  const ascendantSignIndex = ZODIAC_SIGNS.findIndex((s) => s.id === ascendant.sign.id);

  function withHouse(lonDeg: number): PlanetChartPoint {
    const point = toChartPoint(lonDeg);
    const signIndex = ZODIAC_SIGNS.findIndex((s) => s.id === point.sign.id);
    return { ...point, house: wholeSignHouse(signIndex, ascendantSignIndex) };
  }

  return {
    sun: withHouse(sunLonDeg),
    moon: withHouse(moonLonDeg),
    venus: withHouse(venusLonDeg),
    mars: withHouse(marsLonDeg),
    saturn: withHouse(saturnLonDeg),
    ascendant,
    midheaven,
  };
}

/** Plain-text summary of a natal chart, meant to be fed to Astrid as
 * context so her answers reflect the user's real placements. */
export function summarizeNatalChart(chart: NatalChart): string {
  const planets: Array<[string, PlanetChartPoint]> = [
    ["Sol", chart.sun],
    ["Luna", chart.moon],
    ["Venus", chart.venus],
    ["Marte", chart.mars],
    ["Saturno", chart.saturn],
  ];
  const parts = planets.map(
    ([label, point]) => `${label} en ${point.sign.name} (Casa ${point.house})`,
  );
  parts.push(`Ascendente en ${chart.ascendant.sign.name}`);
  return parts.join(", ");
}
