// Server-only

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function generarDescripcionTransito(transito: string): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 150,
    messages: [
      {
        role: "user",
        content: `Genera una descripción corta (máximo 2 oraciones) del tránsito astrológico: "${transito}".

Tono: cálido, directo, en español latinoamericano elegante. Sin jerga. Sin mencionar "tránsito" en el texto.
Solo el efecto energético y psicológico que produce.
Responde SOLO con el texto, sin comillas ni formato.`,
      },
    ],
  });

  const content = response.content[0];
  return content.type === "text" ? content.text.trim() : "";
}
