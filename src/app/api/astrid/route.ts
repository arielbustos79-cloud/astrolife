import Anthropic from "@anthropic-ai/sdk";
import {
  ASTRID_MODEL,
  ASTRID_SYSTEM_PROMPT,
  type AstridChatMessage,
} from "@/lib/anthropic/astrid";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    messages?: AstridChatMessage[];
    natalChart?: unknown;
    birthData?: { name?: string; date?: string; time?: string; utcOffsetHours?: number; latitude?: number; longitude?: number };
  };
  const messages = body.messages ?? [];

  if (messages.length === 0) {
    return Response.json({ error: "Falta el mensaje." }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "Falta configurar ANTHROPIC_API_KEY en .env.local." },
      { status: 500 },
    );
  }

  // DEBUG: verify system prompt and context are correct
  console.log("[astrid/route] system prompt (first 200 chars):", ASTRID_SYSTEM_PROMPT.slice(0, 200));
  console.log("[astrid/route] birthData received:", JSON.stringify(body.birthData ?? null));
  console.log("[astrid/route] natalChart received:", body.natalChart ? "yes (keys: " + Object.keys(body.natalChart as object).join(", ") + ")" : "none");

  // Build context message with name + birth details + planetary positions.
  // Injected as a user/assistant exchange so Astrid has structured data
  // (exact degrees, houses, user's name) to reason about specific aspects.
  let contextMessage: string | null = null;
  if (body.natalChart || body.birthData) {
    const bd = body.birthData ?? {};
    const nombre = bd.name?.trim() || "no proporcionado";
    const lines = [
      `- Nombre: ${nombre}`,
      bd.date ? `- Fecha de nacimiento: ${bd.date}` : null,
      bd.time ? `- Hora: ${bd.time}` : null,
      bd.utcOffsetHours != null ? `- Offset UTC: ${bd.utcOffsetHours}` : null,
      body.natalChart ? `- Posiciones planetarias: ${JSON.stringify(body.natalChart)}` : null,
    ].filter(Boolean);
    contextMessage = `Mis datos:\n${lines.join("\n")}`;
  }

  console.log("[astrid/route] contextMessage:", contextMessage?.slice(0, 300) ?? "none");

  const messagesWithContext: AstridChatMessage[] = contextMessage
    ? [
        { role: "user", content: contextMessage },
        { role: "assistant", content: "Entendido, tengo tus datos. ¿En qué te puedo ayudar hoy? ✨" },
        ...messages,
      ]
    : messages;

  const client = new Anthropic();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const claudeStream = client.messages.stream({
          model: ASTRID_MODEL,
          max_tokens: 1024,
          system: ASTRID_SYSTEM_PROMPT,
          messages: messagesWithContext,
        });

        claudeStream.on("text", (chunk) => {
          controller.enqueue(encoder.encode(chunk));
        });

        await claudeStream.finalMessage();
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
