export type ZodiacSign = {
  id: string;
  name: string;
  symbol: string;
  dateRange: string;
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { id: "aries", name: "Aries", symbol: "♈", dateRange: "21 mar – 19 abr" },
  { id: "tauro", name: "Tauro", symbol: "♉", dateRange: "20 abr – 20 may" },
  { id: "geminis", name: "Géminis", symbol: "♊", dateRange: "21 may – 20 jun" },
  { id: "cancer", name: "Cáncer", symbol: "♋", dateRange: "21 jun – 22 jul" },
  { id: "leo", name: "Leo", symbol: "♌", dateRange: "23 jul – 22 ago" },
  { id: "virgo", name: "Virgo", symbol: "♍", dateRange: "23 ago – 22 sep" },
  { id: "libra", name: "Libra", symbol: "♎", dateRange: "23 sep – 22 oct" },
  { id: "escorpio", name: "Escorpio", symbol: "♏", dateRange: "23 oct – 21 nov" },
  { id: "sagitario", name: "Sagitario", symbol: "♐", dateRange: "22 nov – 21 dic" },
  { id: "capricornio", name: "Capricornio", symbol: "♑", dateRange: "22 dic – 19 ene" },
  { id: "acuario", name: "Acuario", symbol: "♒", dateRange: "20 ene – 18 feb" },
  { id: "piscis", name: "Piscis", symbol: "♓", dateRange: "19 feb – 20 mar" },
];

export function getZodiacSign(id: string): ZodiacSign {
  return ZODIAC_SIGNS.find((s) => s.id === id) ?? ZODIAC_SIGNS[6];
}
