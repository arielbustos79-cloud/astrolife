// Server-only — importar solo desde Server Components o Route Handlers

import * as solar from "astronomia/solar";
import { Planet } from "astronomia/planetposition";
import data from "astronomia/data";
import { CalendarGregorianToJD } from "astronomia/julian";
import { J2000Century } from "astronomia/base";

const SIGNOS = [
  "Aries", "Tauro", "Géminis", "Cáncer", "Leo", "Virgo",
  "Libra", "Escorpio", "Sagitario", "Capricornio", "Acuario", "Piscis",
];

export const COLORES_PLANETA: Record<string, string> = {
  Sol:      "#FFD080",
  Luna:     "#C4B8E8",
  Mercurio: "#A8D8A8",
  Venus:    "#F0D0E8",
  Marte:    "#E8785A",
  Júpiter:  "#F0C080",
  Saturno:  "#C8A96E",
  Urano:    "#80D8F0",
  Neptuno:  "#80C8F0",
};

export const SIMBOLOS_PLANETA: Record<string, string> = {
  Sol:      "☉",
  Luna:     "☽",
  Mercurio: "☿",
  Venus:    "♀",
  Marte:    "♂",
  Júpiter:  "♃",
  Saturno:  "♄",
  Urano:    "⛢",
  Neptuno:  "♆",
};

export type TransitoReal = {
  planeta: string;
  simbolo: string;
  color: string;
  signo: string;
  transito: string;
  grado: number;
  descripcion: string;
  estado: "Activo";
};

function longitudASigno(lonDeg: number): string {
  const n = ((lonDeg % 360) + 360) % 360;
  return SIGNOS[Math.floor(n / 30)];
}

function gradoEnSigno(lonDeg: number): number {
  const n = ((lonDeg % 360) + 360) % 360;
  return Math.floor(n % 30);
}

function makeTransito(nombre: string, lonDeg: number): TransitoReal {
  const signo = longitudASigno(lonDeg);
  return {
    planeta: nombre,
    simbolo: SIMBOLOS_PLANETA[nombre] ?? "★",
    color: COLORES_PLANETA[nombre] ?? "#C8A96E",
    signo,
    transito: `${nombre} en ${signo}`,
    grado: gradoEnSigno(lonDeg),
    descripcion: "",
    estado: "Activo",
  };
}

export function calcularTransitos(fecha: Date = new Date()): TransitoReal[] {
  const jd = CalendarGregorianToJD(
    fecha.getUTCFullYear(),
    fecha.getUTCMonth() + 1,
    fecha.getUTCDate()
  );
  const T = J2000Century(jd);

  const transitos: TransitoReal[] = [];

  // Sol — usa T (siglos desde J2000)
  try {
    const lonRad = solar.apparentLongitude(T);
    transitos.push(makeTransito("Sol", lonRad * 180 / Math.PI));
  } catch (e) {
    console.error("Error calculando Sol:", e);
  }

  // Planetas — usan JD directamente
  const planetasConfig: Array<{ nombre: string; vsop: unknown }> = [
    { nombre: "Mercurio", vsop: data.mercury },
    { nombre: "Venus",    vsop: data.venus },
    { nombre: "Marte",    vsop: data.mars },
    { nombre: "Júpiter",  vsop: data.jupiter },
    { nombre: "Saturno",  vsop: data.saturn },
    { nombre: "Urano",    vsop: data.uranus },
    { nombre: "Neptuno",  vsop: data.neptune },
  ];

  for (const { nombre, vsop } of planetasConfig) {
    try {
      const planet = new Planet(vsop);
      const pos = planet.position(jd);
      transitos.push(makeTransito(nombre, pos.lon * 180 / Math.PI));
    } catch (e) {
      console.error(`Error calculando ${nombre}:`, e);
    }
  }

  return transitos;
}
