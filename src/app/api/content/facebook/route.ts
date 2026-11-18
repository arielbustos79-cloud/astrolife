import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
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

export async function GET() {
  try {
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

Para cada post incluye un campo "texto" y un campo "simbolo" (el glifo Unicode del signo zodiacal protagonista, o ✦ si es general). Signos: ♈ Aries ♉ Tauro ♊ Géminis ♋ Cáncer ♌ Leo ♍ Virgo ♎ Libra ♏ Escorpio ♐ Sagitario ♑ Capricornio ♒ Acuario ♓ Piscis.

Responde SOLO con JSON válido, sin markdown:
{
  "lunes": { "texto": "post sobre el tránsito planetario más relevante. Menciona planeta y signos afectados. CTA: Consulta a Astrid en astrolife.cl", "simbolo": "♈" },
  "martes": { "texto": "dato astral curioso o poco conocido relacionado a los tránsitos actuales. CTA: Descúbrelo en astrolife.cl", "simbolo": "✦" },
  "miercoles": { "texto": "post sobre tránsito planetario específico y cómo se siente en la vida cotidiana. CTA: Consulta a Astrid en astrolife.cl", "simbolo": "♌" },
  "jueves": { "texto": "pregunta interactiva para la audiencia relacionada a los astros actuales. Que invite a responder en comentarios. CTA: Cuéntanos en astrolife.cl", "simbolo": "✦" },
  "viernes": { "texto": "predicción de fin de semana basada en los tránsitos activos. Energía del finde. CTA: Tu guía astral en astrolife.cl — Astrid te espera", "simbolo": "♎" },
  "sabado": { "texto": "reflexión sobre carta natal: por qué conocer tu carta natal cambia cómo entiendes tu vida. CTA: Calcula la tuya en astrolife.cl", "simbolo": "✦" },
  "domingo": { "texto": "reflexión astral profunda para cerrar la semana. Introspección y preparación para la nueva semana. CTA: Descúbrelo en astrolife.cl", "simbolo": "✦" }
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
