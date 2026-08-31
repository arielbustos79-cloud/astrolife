// Contenido de ejemplo mientras se conecta la generación diaria con Astrid (Claude).
// Ver src/app/api/horoscopo/route.ts (pendiente) para la integración real.

export type DailyHoroscope = {
  text: string;
  aspects: string[];
};

const HOROSCOPES: Record<string, DailyHoroscope> = {
  aries: {
    text: "Marte te empuja a tomar la iniciativa, pero hoy conviene elegir bien las batallas. Lo que inicies con calma rinde más que lo que fuerces.",
    aspects: ["♂ Marte activo", "Casa 1 destacada", "Cuadratura ◻"],
  },
  tauro: {
    text: "La Luna en tu signo te pide ir más lento y disfrutar lo simple. Un gasto o decisión financiera merece pensarse una vez más antes de cerrarla.",
    aspects: ["☽ Luna en Tauro", "Casa 2 activa", "Sextil ⚹"],
  },
  geminis: {
    text: "Mercurio favorece las conversaciones pendientes. Si algo no ha quedado claro con alguien cercano, hoy es un buen momento para decirlo sin rodeos.",
    aspects: ["☿ Mercurio directo", "Casa 3 destacada", "Trígono ▽"],
  },
  cancer: {
    text: "El terreno emocional pide atención antes que el productivo. Cuida tu energía hoy — no todo tiene que resolverse en un solo día.",
    aspects: ["☽ Luna sensible", "Casa 4 activa", "Oposición ☍"],
  },
  leo: {
    text: "El Sol ilumina tus vínculos creativos. Es un buen día para mostrar algo en lo que has estado trabajando, aunque no esté perfecto todavía.",
    aspects: ["☉ Sol activo", "Casa 5 destacada", "Trígono ▽"],
  },
  virgo: {
    text: "Tu ojo para el detalle hoy puede jugar en tu contra si se convierte en autoexigencia. Ordena lo urgente y deja el resto para mañana.",
    aspects: ["☿ Mercurio en Virgo", "Casa 6 activa", "Sextil ⚹"],
  },
  libra: {
    text: "Venus en trígono con tu ascendente trae claridad en vínculos cercanos. Si has postergado una conversación difícil, hoy el ambiente lo favorece. No fuerces — el tiempo habla por ti.",
    aspects: ["♀ Venus activa", "Casa 7 destacada", "Trígono ▽"],
  },
  escorpio: {
    text: "Plutón remueve algo que creías cerrado. No es una señal negativa — es la oportunidad de soltar algo que ya no te representa.",
    aspects: ["♇ Plutón activo", "Casa 8 destacada", "Cuadratura ◻"],
  },
  sagitario: {
    text: "Júpiter abre una puerta relacionada con estudios, viajes o planes a futuro. Vale la pena decir que sí, aunque no tengas todo resuelto todavía.",
    aspects: ["♃ Júpiter activo", "Casa 9 destacada", "Trígono ▽"],
  },
  capricornio: {
    text: "Saturno pide disciplina, pero también reconocimiento por lo ya construido. Date el crédito antes de ponerte la próxima meta.",
    aspects: ["♄ Saturno activo", "Casa 10 destacada", "Sextil ⚹"],
  },
  acuario: {
    text: "Urano trae un cambio de planes de último minuto. En vez de resistirlo, pregúntate qué te está mostrando esa interrupción.",
    aspects: ["♅ Urano activo", "Casa 11 destacada", "Oposición ☍"],
  },
  piscis: {
    text: "La intuición está más afinada de lo normal — confía en la primera lectura que tengas de una situación antes de racionalizarla de más.",
    aspects: ["☽ Luna intuitiva", "Casa 12 activa", "Trígono ▽"],
  },
};

export function getDailyHoroscope(signId: string): DailyHoroscope {
  return HOROSCOPES[signId] ?? HOROSCOPES.libra;
}

export const MOON_PHASE_TODAY = "Luna menguante en Tauro";

export type Transit = {
  planetSymbol: string;
  name: string;
  description: string;
  status: string;
};

export const MONTHLY_TRANSITS: Transit[] = [
  {
    planetSymbol: "♄",
    name: "Saturno en Casa 10",
    description: "Consolidación profesional, disciplina",
    status: "Activo",
  },
  {
    planetSymbol: "☿",
    name: "Mercurio directo",
    description: "Claridad en comunicaciones",
    status: "Sep 12",
  },
];
