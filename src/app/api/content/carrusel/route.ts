import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getTransitosGenerales } from "@/lib/transitos-cache";

const client = new Anthropic();

export type CarruselData = {
  slide1: { titulo: string; subtitulo: string };
  slide2: { signo: string; simbolo: string; texto: string };
  slide3: { signo1: string; simbolo1: string; texto1: string; signo2: string; simbolo2: string; texto2: string };
  slide4: { cta: string };
};

export async function GET() {
  try {
    const transitos = await getTransitosGenerales();
    const main = transitos[0];
    const others = transitos.slice(1, 3);

    const transitoMain = `${main.planeta} en ${main.signo}: ${main.descripcion}`;
    const transitosOtros = others.map((t) => `${t.planeta} en ${t.signo}: ${t.descripcion}`).join("\n");

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `Genera contenido para un carrusel de Instagram de 4 slides para AstroLife.cl.

Tránsito principal: ${transitoMain}
Otros tránsitos activos:
${transitosOtros}

Reglas: español chileno, tuteo (tú/tienes/puedes/vas), tono misterioso y directo, sin voseo, sin markdown, sin hashtags.
Signos disponibles: ♈ Aries ♉ Tauro ♊ Géminis ♋ Cáncer ♌ Leo ♍ Virgo ♎ Libra ♏ Escorpio ♐ Sagitario ♑ Capricornio ♒ Acuario ♓ Piscis.

Responde SOLO con JSON válido, sin markdown:
{
  "slide1": {
    "titulo": "máximo 5 palabras sobre el tránsito, impactante",
    "subtitulo": "máximo 10 palabras explicando qué significa para todos"
  },
  "slide2": {
    "signo": "nombre del signo más afectado",
    "simbolo": "glifo Unicode del signo",
    "texto": "2 oraciones sobre cómo lo siente este signo, máximo 25 palabras total"
  },
  "slide3": {
    "signo1": "segundo signo más afectado",
    "simbolo1": "su glifo Unicode",
    "texto1": "2 oraciones, máximo 20 palabras",
    "signo2": "tercer signo afectado",
    "simbolo2": "su glifo Unicode",
    "texto2": "2 oraciones, máximo 20 palabras"
  },
  "slide4": {
    "cta": "frase poderosa máximo 8 palabras para cerrar el carrusel"
  }
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Error generando carrusel" }, { status: 500 });
    }

    const raw = content.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const data = JSON.parse(raw) as CarruselData;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[content/carrusel] Error:", err);
    return NextResponse.json({ error: "Error generando carrusel" }, { status: 500 });
  }
}
