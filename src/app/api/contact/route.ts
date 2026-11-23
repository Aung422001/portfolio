import { NextResponse } from "next/server";
import { parseContact } from "@/lib/contact";
import { profile } from "@/data/profile";

export const runtime = "nodejs";
// Best-effort instance-local cooldown. Configure a durable edge rate limit before public activation.
const cooldown = new Map<string, number>();

export async function POST(request: Request) {
  if (process.env.CONTACT_SEND_ENABLED !== "true" || !process.env.RESEND_API_KEY || !process.env.CONTACT_FROM) {
    return NextResponse.json({ sent: false, error: "Email delivery is not configured. Use your email app instead." }, { status: 503 });
  }
  if (request.headers.get("origin") !== new URL(request.url).origin || !request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json({ sent: false, error: "Invalid request." }, { status: 400 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 16000) return NextResponse.json({ sent: false, error: "Message too large." }, { status: 413 });
  let fields;
  try {
    const raw = await request.text();
    if (raw.length > 16000) return NextResponse.json({ sent: false, error: "Message too large." }, { status: 413 });
    fields = parseContact(JSON.parse(raw));
  } catch { fields = null; }
  if (!fields) return NextResponse.json({ sent: false, error: "Check the message fields." }, { status: 400 });

  const now = Date.now();
  for (const [key, expiry] of cooldown) if (expiry <= now) cooldown.delete(key);
  const client = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (cooldown.has(client) || cooldown.size >= 1000) return NextResponse.json({ sent: false, error: "Please wait before sending another message." }, { status: 429 });
  cooldown.set(client, now + 60_000);
  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.CONTACT_FROM, to: [profile.email], reply_to: fields.email, subject: "Portfolio enquiry", text: `From: ${fields.name} (${fields.email})\n\n${fields.message}` }),
      signal: AbortSignal.timeout(8000),
    });
    if (!sent.ok) throw new Error("Provider unavailable");
    return NextResponse.json({ sent: true });
  } catch {
    return NextResponse.json({ sent: false, error: "Delivery could not be confirmed. Please use your email app." }, { status: 502 });
  }
}
