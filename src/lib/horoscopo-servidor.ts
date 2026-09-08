// Server-only — only import from Server Components or Route Handlers

import Anthropic from "@anthropic-ai/sdk";

export type HoroscopeResult = {
  texto: string;
  aspectos: string[];
  planeta: string;
};

const client = new Anthropic();

export async function generarHoroscopo(signo: string): Promise<HoroscopeResult> {
  const fecha = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `Genera el horóscopo del día para ${signo}.

Fecha actual: ${fecha}

Responde SOLO con JSON, sin markdown ni explicaciones:
{
  "texto": "horóscopo en 2-3 oraciones, tono cálido y directo",
  "aspectos": ["aspecto 1", "aspecto 2", "aspecto 3"],
  "planeta": "planeta destacado del día"
}

El texto debe ser específico para hoy, no genérico. Máximo 3 oraciones.

Tono: español latinoamericano natural y elegante. Cercano pero con clase — como una persona culta hablando con un amigo. NUNCA uses modismos, contracciones informales como 'pa', 'po', 've', ni jerga. El tono es cálido, directo y sofisticado.`,
      },
    ],
  });

  const content = response.content[0];
  if (content.type !== "text") throw new Error("Respuesta no es texto");

  const raw = content.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
  return JSON.parse(raw) as HoroscopeResult;
}
