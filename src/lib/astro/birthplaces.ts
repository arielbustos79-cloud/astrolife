export type Birthplace = {
  id: string;
  label: string;
  latitude: number;
  longitude: number;
  /** Standard (non-DST) UTC offset in hours, used as an editable default. */
  utcOffsetHours: number;
};

export const BIRTHPLACES: Birthplace[] = [
  { id: "santiago", label: "Santiago, Chile", latitude: -33.4489, longitude: -70.6693, utcOffsetHours: -4 },
  { id: "valparaiso", label: "Valparaíso, Chile", latitude: -33.0472, longitude: -71.6127, utcOffsetHours: -4 },
  { id: "concepcion", label: "Concepción, Chile", latitude: -36.8201, longitude: -73.0444, utcOffsetHours: -4 },
  { id: "la-serena", label: "La Serena, Chile", latitude: -29.9027, longitude: -71.2519, utcOffsetHours: -4 },
  { id: "antofagasta", label: "Antofagasta, Chile", latitude: -23.6509, longitude: -70.3975, utcOffsetHours: -4 },
  { id: "iquique", label: "Iquique, Chile", latitude: -20.2141, longitude: -70.1522, utcOffsetHours: -4 },
  { id: "arica", label: "Arica, Chile", latitude: -18.4783, longitude: -70.3126, utcOffsetHours: -4 },
  { id: "temuco", label: "Temuco, Chile", latitude: -38.7359, longitude: -72.5904, utcOffsetHours: -4 },
  { id: "puerto-montt", label: "Puerto Montt, Chile", latitude: -41.4693, longitude: -72.9424, utcOffsetHours: -4 },
  { id: "rancagua", label: "Rancagua, Chile", latitude: -34.1708, longitude: -70.7444, utcOffsetHours: -4 },
  { id: "talca", label: "Talca, Chile", latitude: -35.4264, longitude: -71.6554, utcOffsetHours: -4 },
  { id: "chillan", label: "Chillán, Chile", latitude: -36.6063, longitude: -72.1034, utcOffsetHours: -4 },
  { id: "punta-arenas", label: "Punta Arenas, Chile", latitude: -53.1638, longitude: -70.9171, utcOffsetHours: -3 },
  { id: "isla-de-pascua", label: "Isla de Pascua, Chile", latitude: -27.1127, longitude: -109.3497, utcOffsetHours: -6 },
  { id: "buenos-aires", label: "Buenos Aires, Argentina", latitude: -34.6037, longitude: -58.3816, utcOffsetHours: -3 },
  { id: "lima", label: "Lima, Perú", latitude: -12.0464, longitude: -77.0428, utcOffsetHours: -5 },
  { id: "bogota", label: "Bogotá, Colombia", latitude: 4.711, longitude: -74.0721, utcOffsetHours: -5 },
  { id: "ciudad-de-mexico", label: "Ciudad de México, México", latitude: 19.4326, longitude: -99.1332, utcOffsetHours: -6 },
  { id: "montevideo", label: "Montevideo, Uruguay", latitude: -34.9011, longitude: -56.1645, utcOffsetHours: -3 },
  { id: "quito", label: "Quito, Ecuador", latitude: -0.1807, longitude: -78.4678, utcOffsetHours: -5 },
  { id: "asuncion", label: "Asunción, Paraguay", latitude: -25.2637, longitude: -57.5759, utcOffsetHours: -4 },
  { id: "caracas", label: "Caracas, Venezuela", latitude: 10.4806, longitude: -66.9036, utcOffsetHours: -4 },
  { id: "la-paz", label: "La Paz, Bolivia", latitude: -16.5, longitude: -68.15, utcOffsetHours: -4 },
  { id: "otra", label: "Otra ciudad (ingresar manualmente)", latitude: 0, longitude: 0, utcOffsetHours: 0 },
];
