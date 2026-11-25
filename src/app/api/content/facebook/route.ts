import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { getTransitosGenerales } from "@/lib/transitos-cache";

const client = new Anthropic();

const TONO = `Escribe en español chileno. Tono misterioso y directo, no explicativo. Usa siempre tuteo (tú, tienes, puedes, vas). NUNCA uses voseo (vos, tenés, podés, hacés). Sin markdown, sin asteriscos, sin hashtags. Máximo 3 oraciones por post. No uses más de un emoji por post.`;

export type DayPost = { texto: string; simbolo: string };
export type WeekPosts = {
  lunes: DayPost;
  martes: DayPost;
  miercoles: DayPost;
  jueves: DayPost;
  viernes: DayPost;
  sabado: DayPost;
  domingo: DayPost;
};

function getCurrentSolarSign(): string {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return "aries";
  if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return "tauro";
  if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return "geminis";
  if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return "cancer";
  if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return "leo";
  if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return "virgo";
  if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return "libra";
  if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return "escorpio";
  if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return "sagitario";
  if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return "capricornio";
  if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return "acuario";
  return "piscis";
}

export async function GET(request: NextRequest) {
  try {
    const signo = request.nextUrl.searchParams.get("signo") ?? getCurrentSolarSign();

    const links = {
      lunes:    `https://astrolife.cl/horoscopo/${signo}`,
      martes:   "https://astrolife.cl/carta-natal",
      miercoles:"https://astrolife.cl/transitos",
      jueves:   "https://astrolife.cl/astrid",
      viernes:  `https://astrolife.cl/horoscopo/${signo}`,
      sabado:   "https://astrolife.cl/carta-natal",
      domingo:  "https://astrolife.cl/carta-natal",
    };

    const transitos = await getTransitosGenerales();

    const transitoResumen = transitos
      .slice(0, 5)
      .map((t) => `${t.planeta} en ${t.signo}: ${t.descripcion}`)
      .join("\n");

    const fechaBase = new Date();
    const semana = fechaBase.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `Genera 7 posts para Facebook de AstroLife.cl para esta semana (${semana}).

Tránsitos planetarios activos esta semana:
${transitoResumen}

${TONO}

Cada post debe terminar con exactamente 1 línea de CTA que incluya el link correspondiente al día:
- Lunes: ${links.lunes}
- Martes: ${links.martes}
- Miércoles: ${links.miercoles}
- Jueves: ${links.jueves}
- Viernes: ${links.viernes}
- Sábado: ${links.sabado}
- Domingo: ${links.domingo}
El CTA debe ser natural, breve y en español chileno. No uses "Link:" ni corchetes.

Para cada post incluye un campo "texto" y un campo "simbolo" (el glifo Unicode del signo zodiacal protagonista, o ✦ si es general). Signos: ♈ Aries ♉ Tauro ♊ Géminis ♋ Cáncer ♌ Leo ♍ Virgo ♎ Libra ♏ Escorpio ♐ Sagitario ♑ Capricornio ♒ Acuario ♓ Piscis.

Responde SOLO con JSON válido, sin markdown:
{
  "lunes": { "texto": "post sobre el tránsito planetario más relevante. Menciona planeta y signos afectados.", "simbolo": "♈" },
  "martes": { "texto": "dato astral curioso o poco conocido relacionado a los tránsitos actuales.", "simbolo": "✦" },
  "miercoles": { "texto": "post sobre tránsito planetario específico y cómo se siente en la vida cotidiana.", "simbolo": "♌" },
  "jueves": { "texto": "pregunta interactiva para la audiencia relacionada a los astros actuales. Que invite a responder en comentarios.", "simbolo": "✦" },
  "viernes": { "texto": "predicción de fin de semana basada en los tránsitos activos. Energía del finde.", "simbolo": "♎" },
  "sabado": { "texto": "reflexión sobre carta natal: por qué conocer tu carta natal cambia cómo entiendes tu vida.", "simbolo": "✦" },
  "domingo": { "texto": "reflexión astral profunda para cerrar la semana. Introspección y preparación para la nueva semana.", "simbolo": "✦" }
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Error generando contenido" }, { status: 500 });
    }

    const raw = content.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const data = JSON.parse(raw) as WeekPosts;

    return NextResponse.json(data);
  } catch (err) {
    console.error("[content/facebook] Error:", err);
    return NextResponse.json({ error: "Error generando contenido" }, { status: 500 });
  }
}
