// Server-only — importar solo desde Server Components o Route Handlers

import { moonposition, solar, julian, base } from "astronomia";

const SIGNOS = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
];

// Cada fase cubre ±22.5° alrededor de su ángulo central (estándar astrológico).
// Esto hace que "Luna nueva" sea solo las 45° centradas en 0°,
// y "Luna creciente" empiece en 22.5° — coincide con la convención de calendarios lunares.
type Fase = { nombre: string; emoji: string };

function getFase(elongacion: number): Fase {
  if (elongacion >= 337.5 || elongacion < 22.5) return { nombre: "Luna nueva",       emoji: "🌑" };
  if (elongacion < 67.5)                         return { nombre: "Luna creciente",   emoji: "🌒" };
  if (elongacion < 112.5)                        return { nombre: "Cuarto creciente", emoji: "🌓" };
  if (elongacion < 157.5)                        return { nombre: "Gibosa creciente", emoji: "🌔" };
  if (elongacion < 202.5)                        return { nombre: "Luna llena",       emoji: "🌕" };
  if (elongacion < 247.5)                        return { nombre: "Gibosa menguante", emoji: "🌖" };
  if (elongacion < 292.5)                        return { nombre: "Cuarto menguante", emoji: "🌗" };
  return                                                { nombre: "Luna menguante",   emoji: "🌘" };
}

export type FaseLunar = {
  fase: string;
  emoji: string;
  signo: string;
  texto: string;
};

export function calcularFaseLunar(fecha: Date = new Date()): FaseLunar {
  const jde = julian.DateToJDE(fecha);
  const T = base.J2000Century(jde);

  // Longitud eclíptica del Sol — solar.apparentLongitude recibe T (siglos J2000), no JDE
  const solLon = ((solar.apparentLongitude(T) * 180 / Math.PI) % 360 + 360) % 360;

  // Longitud eclíptica de la Luna — moonposition usa JDE directamente
  const lunaPos = moonposition.position(jde);
  const lunaLon = ((lunaPos.lon * 180 / Math.PI) % 360 + 360) % 360;

  // Elongación: diferencia angular Luna - Sol normalizada 0-360
  let elongacion = lunaLon - solLon;
  if (elongacion < 0) elongacion += 360;

  const fase = getFase(elongacion);
  const signo = SIGNOS[Math.floor(lunaLon / 30)] ?? "Aries";

  return {
    fase: fase.nombre,
    emoji: fase.emoji,
    signo,
    texto: `${fase.nombre} en ${signo}`,
  };
}
