import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const SIGNOS = [
  "aries", "tauro", "geminis", "cancer", "leo", "virgo",
  "libra", "escorpio", "sagitario", "capricornio", "acuario", "piscis",
];

export async function GET(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  for (const signo of SIGNOS) {
    revalidatePath(`/horoscopo/${signo}`);
  }

  return NextResponse.json({ revalidated: true, timestamp: new Date().toISOString() });
}
