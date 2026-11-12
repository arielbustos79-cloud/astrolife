import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { getTransitosGenerales } from "@/lib/transitos-cache";

const client = new Anthropic();

const TONO = `Escribe en español chileno. Tono cercano, cálido, directo. Usa siempre tuteo (tú, tienes, puedes, vas). NUNCA uses voseo (vos, tenés, podés, hacés). Sin markdown, sin asteriscos, sin hashtags. Máximo 150 palabras por post. No uses emojis excesivos — máximo 1 o 2 por post.`;

export async function GET() {
  try {
    const transitos = await getTransitosGenerales();

    const transitoResumen = transitos
      .slice(0, 3)
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
      max_tokens: 1200,
      messages: [
        {
          role: "user",
          content: `Genera 3 posts para Facebook de AstroLife.cl para esta semana (${semana}).

Tránsitos planetarios activos esta semana:
${transitoResumen}

${TONO}

Responde SOLO con JSON válido, sin markdown:
{
  "lunes": "post sobre el tránsito planetario más relevante de la semana. Menciona qué planeta, qué signos afecta y cómo se siente. Termina con: Consulta a Astrid en astrolife.cl",
  "miercoles": "post sobre compatibilidad entre dos signos relevantes según los tránsitos actuales. 3 a 4 líneas + consejo breve. Termina con: Consulta a Astrid en astrolife.cl",
  "viernes": "predicción de fin de semana basada en los tránsitos activos. Qué energía trae el fin de semana. Termina con: Tu guía astral en astrolife.cl — Astrid te espera"
}`,
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Error generando contenido" }, { status: 500 });
    }

    const raw = content.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const data = JSON.parse(raw) as { lunes: string; miercoles: string; viernes: string };

    return NextResponse.json(data);
  } catch (err) {
    console.error("[content/facebook] Error:", err);
    return NextResponse.json({ error: "Error generando contenido" }, { status: 500 });
  }
}
