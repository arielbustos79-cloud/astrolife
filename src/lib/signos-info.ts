export type SignoInfo = {
  elemento: "Fuego" | "Tierra" | "Aire" | "Agua";
  planeta: string;
  descripcion: string[];
  caracteristicas: string[];
  compatibilidades: string[];
};

export const SIGNOS_INFO: Record<string, SignoInfo> = {
  aries: {
    elemento: "Fuego",
    planeta: "Marte",
    descripcion: [
      "Aries es el primer signo del zodíaco, nacido entre el 21 de marzo y el 19 de abril bajo la influencia de Marte, el planeta de la acción y la valentía. Como signo cardinal de fuego, Aries inaugura el año astrológico con una energía pionera que impulsa a comenzar, liderar y conquistar nuevos territorios.",
      "Las personas nacidas bajo este signo se distinguen por su determinación y su capacidad de actuar con rapidez. No esperan que las oportunidades lleguen solas — las crean. Esta iniciativa los convierte en líderes naturales, aunque también puede derivar en impaciencia cuando los resultados no llegan al ritmo que esperan.",
      "En el amor, Aries es apasionado y directo. No guarda sus sentimientos — los expresa con la misma intensidad con que vive el resto de su vida. Busca una pareja que los desafíe intelectual y emocionalmente, alguien que pueda seguirles el paso sin apagar su llama.",
    ],
    caracteristicas: ["Valiente", "Apasionado", "Líder", "Impulsivo", "Honesto"],
    compatibilidades: ["Leo", "Sagitario", "Géminis"],
  },
  tauro: {
    elemento: "Tierra",
    planeta: "Venus",
    descripcion: [
      "Tauro es el segundo signo del zodíaco, nacido entre el 20 de abril y el 20 de mayo bajo la tutela de Venus, diosa del amor, la belleza y la abundancia. Como signo fijo de tierra, Tauro encarna la estabilidad, la constancia y el aprecio profundo por los placeres que la vida material puede ofrecer.",
      "Quienes nacen bajo este signo poseen una determinación extraordinaria. Una vez que Tauro decide algo, difícilmente cambia de rumbo — lo que otros interpretan como terquedad es, en realidad, una fidelidad inquebrantable a sus valores y decisiones. Esta firmeza los convierte en pilares en cualquier equipo o relación.",
      "En el amor, Tauro es leal y sensual. Construyen relaciones sólidas y duraderas, valoran la seguridad emocional y son de los amantes más devotos del zodíaco. Su lengua del amor suele ser el contacto físico y los gestos concretos de cuidado y presencia.",
    ],
    caracteristicas: ["Perseverante", "Leal", "Sensual", "Práctico", "Paciente"],
    compatibilidades: ["Virgo", "Capricornio", "Cáncer"],
  },
  geminis: {
    elemento: "Aire",
    planeta: "Mercurio",
    descripcion: [
      "Géminis es el tercer signo del zodíaco, nacido entre el 21 de mayo y el 20 de junio bajo la influencia de Mercurio, planeta de la comunicación, el intelecto y los viajes. Como signo mutable de aire, Géminis es el eterno explorador de ideas, conversaciones y conexiones humanas.",
      "La dualidad que simbolizan los gemelos no es una contradicción — es una capacidad única de ver el mundo desde múltiples ángulos al mismo tiempo. Géminis puede sostener conversaciones sobre temas completamente distintos en el mismo día y encontrar puntos de conexión donde otros no los ven.",
      "En el amor, Géminis necesita estimulación intelectual constante. Una pareja que los sorprenda con ideas, humor y perspectivas frescas captará su corazón mucho más que la rutina o la previsibilidad. Son compañeros brillantes, entretenidos y sorprendentemente leales cuando encuentran a alguien que puede seguirles el ritmo mental.",
    ],
    caracteristicas: ["Curioso", "Versátil", "Comunicativo", "Ingenioso", "Adaptable"],
    compatibilidades: ["Libra", "Acuario", "Aries"],
  },
  cancer: {
    elemento: "Agua",
    planeta: "Luna",
    descripcion: [
      "Cáncer es el cuarto signo del zodíaco, nacido entre el 21 de junio y el 22 de julio bajo la influencia de la Luna, el astro que rige las emociones, la memoria y los ciclos. Como signo cardinal de agua, Cáncer es el guardián del hogar, la familia y la intimidad emocional.",
      "Bajo esa apariencia reservada se esconde una de las personas más profundas y empáticas del zodíaco. Cáncer siente con una intensidad que pocos comprenden — capta el estado emocional de quienes los rodean antes de que esas personas sean conscientes de lo que sienten. Este don de empatía los convierte en amigos y confidentes excepcionales.",
      "En el amor, Cáncer entrega su corazón completamente cuando confía. Son de los signos más cariñosos y protectores del zodíaco. Necesitan sentirse seguros para abrirse, pero una vez que lo hacen, crean vínculos que perduran décadas.",
    ],
    caracteristicas: ["Empático", "Protector", "Intuitivo", "Leal", "Creativo"],
    compatibilidades: ["Piscis", "Escorpio", "Tauro"],
  },
  leo: {
    elemento: "Fuego",
    planeta: "Sol",
    descripcion: [
      "Leo es el quinto signo del zodíaco, nacido entre el 23 de julio y el 22 de agosto bajo la influencia del Sol, astro central de nuestro sistema y símbolo de la identidad, la vitalidad y la voluntad. Como signo fijo de fuego, Leo irradia carisma, generosidad y una presencia que ilumina cualquier espacio.",
      "Lejos del estereotipo superficial, Leo tiene una de las voluntades más fuertes del zodíaco y una generosidad que pocos signos pueden igualar. No buscan el centro de atención por vanidad — lo ocupan naturalmente porque tienen algo genuino que ofrecer. Cuando Leo brilla, arrastra a todos los que los rodean hacia una versión más luminosa de sí mismos.",
      "En el amor, Leo es apasionado, leal y dramáticamente romántico. Necesitan admiración genuina — no adulación vacía — y en reciprocidad ofrecen una devoción y generosidad difíciles de superar. Un Leo bien amado es una de las parejas más entregadas del zodíaco.",
    ],
    caracteristicas: ["Carismático", "Generoso", "Leal", "Creativo", "Decidido"],
    compatibilidades: ["Aries", "Sagitario", "Géminis"],
  },
  virgo: {
    elemento: "Tierra",
    planeta: "Mercurio",
    descripcion: [
      "Virgo es el sexto signo del zodíaco, nacido entre el 23 de agosto y el 22 de septiembre bajo la influencia de Mercurio, planeta de la mente y el análisis. Como signo mutable de tierra, Virgo combina la precisión intelectual con la capacidad de manifestar ideas en resultados concretos y funcionales.",
      "La atención al detalle de Virgo no es un defecto — es una superpotencia. Donde otros ven el panorama general, Virgo ve las grietas, los matices y las oportunidades de mejora que hacen la diferencia entre lo bueno y lo excelente. Esta capacidad analítica los convierte en indispensables en cualquier proyecto que requiera rigor y precisión.",
      "En el amor, Virgo expresa afecto a través del servicio y los cuidados prácticos. Son los que recuerdan lo que necesitas antes de que lo pidas, los que organizan los detalles para que todo fluya. Necesitan una pareja que aprecie estos gestos concretos como el lenguaje de amor que son.",
    ],
    caracteristicas: ["Analítico", "Meticuloso", "Confiable", "Servicial", "Inteligente"],
    compatibilidades: ["Tauro", "Capricornio", "Cáncer"],
  },
  libra: {
    elemento: "Aire",
    planeta: "Venus",
    descripcion: [
      "Libra es el séptimo signo del zodíaco, nacido entre el 23 de septiembre y el 22 de octubre bajo la influencia de Venus. Como signo cardinal de aire, Libra encarna la búsqueda del equilibrio, la justicia y la belleza en todas sus formas — desde las relaciones humanas hasta el arte y la arquitectura.",
      "El don de Libra es la diplomacia genuina. No es que eviten los conflictos por miedo — es que tienen la capacidad de ver el punto de vista de cada parte con una claridad poco común. Esta habilidad los convierte en mediadores naturales y consejeros de confianza para quienes los rodean.",
      "En el amor, Libra es romántico y refinado. Construyen relaciones con la misma atención que un artista construye una obra — cuidando los detalles, buscando la armonía y valorando la reciprocidad. Necesitan una pareja que comparta su amor por la estética, la conversación y los momentos bien vividos.",
    ],
    caracteristicas: ["Diplomático", "Justo", "Refinado", "Sociable", "Equilibrado"],
    compatibilidades: ["Géminis", "Acuario", "Sagitario"],
  },
  escorpio: {
    elemento: "Agua",
    planeta: "Plutón",
    descripcion: [
      "Escorpio es el octavo signo del zodíaco, nacido entre el 23 de octubre y el 21 de noviembre bajo la influencia de Plutón, planeta de la transformación, los misterios y la regeneración. Como signo fijo de agua, Escorpio posee una profundidad emocional y una intensidad que pocos signos pueden igualar.",
      "Escorpio ve lo que está debajo de la superficie — las motivaciones ocultas, las verdades no dichas, los patrones que se repiten. Esta perspicacia puede resultar incómoda para quienes prefieren la superficialidad, pero es un regalo invaluable en las relaciones y los proyectos que requieren honestidad radical.",
      "En el amor, Escorpio entrega todo o nada. No existe término medio. Cuando eligen a alguien, esa persona recibe una lealtad y una intensidad que pocos han experimentado. Necesitan confianza absoluta — y en reciprocidad ofrecen la clase de conexión transformadora que cambia a las personas para siempre.",
    ],
    caracteristicas: ["Intenso", "Perspicaz", "Leal", "Transformador", "Apasionado"],
    compatibilidades: ["Cáncer", "Piscis", "Virgo"],
  },
  sagitario: {
    elemento: "Fuego",
    planeta: "Júpiter",
    descripcion: [
      "Sagitario es el noveno signo del zodíaco, nacido entre el 22 de noviembre y el 21 de diciembre bajo la influencia de Júpiter, el planeta más grande del sistema solar y símbolo de la expansión, la sabiduría y la abundancia. Como signo mutable de fuego, Sagitario es el eterno buscador de verdad y horizonte.",
      "El optimismo de Sagitario no es ingenuidad — es una filosofía de vida construida sobre la convicción de que el mundo tiene más por ofrecer de lo que ya conocemos. Esta apertura mental los lleva a explorar ideas, culturas y perspectivas con una curiosidad genuina que los enriquece y enriquece a quienes los rodean.",
      "En el amor, Sagitario necesita libertad y un compañero de aventuras. No huyen del compromiso — huyen de la jaula. Con la pareja correcta, que comparta su sed de crecimiento y experiencia, Sagitario puede ser un compañero de vida extraordinariamente leal y estimulante.",
    ],
    caracteristicas: ["Optimista", "Aventurero", "Filosófico", "Honesto", "Generoso"],
    compatibilidades: ["Aries", "Leo", "Libra"],
  },
  capricornio: {
    elemento: "Tierra",
    planeta: "Saturno",
    descripcion: [
      "Capricornio es el décimo signo del zodíaco, nacido entre el 22 de diciembre y el 19 de enero bajo la influencia de Saturno, planeta de la disciplina, la responsabilidad y el tiempo. Como signo cardinal de tierra, Capricornio encarna la ambición estructurada y la capacidad de construir legados que perduran.",
      "La paciencia de Capricornio es estratégica. Saben que los objetivos más valiosos requieren tiempo, esfuerzo sostenido y la disposición a trabajar cuando otros descansaron. Esta disciplina los lleva, con frecuencia, a alcanzar posiciones de liderazgo y reconocimiento que parecían inalcanzables al inicio.",
      "En el amor, Capricornio es más romántico de lo que su exterior reservado sugiere. Expresan afecto a través de acciones concretas: estar presentes, ser confiables, construir juntos. Necesitan una pareja que valore la estabilidad y comparta su visión de futuro a largo plazo.",
    ],
    caracteristicas: ["Ambicioso", "Disciplinado", "Responsable", "Perseverante", "Práctico"],
    compatibilidades: ["Tauro", "Virgo", "Escorpio"],
  },
  acuario: {
    elemento: "Aire",
    planeta: "Urano",
    descripcion: [
      "Acuario es el undécimo signo del zodíaco, nacido entre el 20 de enero y el 18 de febrero bajo la influencia de Urano, planeta de la innovación, la revolución y lo inesperado. Como signo fijo de aire, Acuario combina la visión de futuro con la determinación de materializarla, frecuentemente adelantándose décadas a su tiempo.",
      "La originalidad de Acuario no es pose — es una perspectiva genuinamente distinta del mundo. Ven conexiones que otros no ven, cuestionan estructuras que otros dan por sentadas y proponen soluciones que inicialmente parecen extrañas y luego parecen obvias. Esta capacidad visionaria los convierte en agentes de cambio en cualquier campo.",
      "En el amor, Acuario necesita una pareja que sea también su mejor amigo. La conexión intelectual y el respeto mutuo por la individualidad son tan importantes para ellos como la atracción romántica. Con la persona correcta, pueden crear una relación tan única y estimulante como ellos mismos.",
    ],
    caracteristicas: ["Visionario", "Independiente", "Humanitario", "Original", "Inteligente"],
    compatibilidades: ["Géminis", "Libra", "Aries"],
  },
  piscis: {
    elemento: "Agua",
    planeta: "Neptuno",
    descripcion: [
      "Piscis es el duodécimo y último signo del zodíaco, nacido entre el 19 de febrero y el 20 de marzo bajo la influencia de Neptuno, planeta de los sueños, la espiritualidad y lo trascendente. Como signo mutable de agua, Piscis cierra el ciclo zodiacal portando la sabiduría acumulada de todos los signos anteriores.",
      "La sensibilidad de Piscis no es debilidad — es una antena extraordinariamente afinada para captar lo que está más allá de lo visible. Perciben emociones, atmósferas y necesidades con una precisión intuitiva que puede resultar casi sobrenatural. Este don los convierte en artistas, sanadores y empáticos excepcionales.",
      "En el amor, Piscis ama con una profundidad poética que pocos signos pueden igualar. Se entregan completamente, sueñan en grande y crean conexiones que trascienden lo cotidiano. Necesitan una pareja que les ofrezca la estabilidad que ellos a veces no pueden darse a sí mismos, y que aprecie la riqueza de su mundo interior.",
    ],
    caracteristicas: ["Intuitivo", "Compasivo", "Artístico", "Espiritual", "Empático"],
    compatibilidades: ["Cáncer", "Escorpio", "Tauro"],
  },
};

export function getSignoInfo(id: string): SignoInfo {
  return SIGNOS_INFO[id] ?? SIGNOS_INFO.libra;
}
