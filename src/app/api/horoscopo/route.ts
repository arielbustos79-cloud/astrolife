import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic();

export async function POST(request: NextRequest) {
  const { signo } = (await request.json()) as { signo: string };

  if (!signo) {
    return NextResponse.json({ error: "Signo requerido" }, { status: 400 });
  }

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
  if (content.type !== "text") {
    return NextResponse.json(
      { error: "Error generando horóscopo" },
      { status: 500 },
    );
  }

  try {
    const raw = content.text.trim().replace(/^```json\s*/i, "").replace(/```\s*$/i, "");
    const data = JSON.parse(raw) as {
      texto: string;
      aspectos: string[];
      planeta: string;
    };
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Error parseando respuesta" },
      { status: 500 },
    );
  }
}
