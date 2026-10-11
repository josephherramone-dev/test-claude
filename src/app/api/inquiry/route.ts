import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/inquiry-delivery";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { validateInquiry } from "@/lib/validation";

export const runtime = "nodejs";

/** Minimum time (ms) a human needs to fill the form. */
const MIN_FILL_TIME = 3000;

export async function POST(request: Request) {
  const limit = rateLimit(`inquiry:${clientKey(request)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { status: "rate_limited", message: "Trop de demandes envoyées. Merci de réessayer plus tard." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ status: "invalid", message: "Requête invalide." }, { status: 400 });
  }

  const parsed = validateInquiry(body);
  if (!parsed.ok) {
    const { website, startedAt, ...fieldErrors } = parsed.errors;
    // Honeypot filled or missing timing token: refuse without details, never deliver.
    if (website || startedAt) {
      return NextResponse.json({ status: "invalid", message: "Requête refusée." }, { status: 400 });
    }
    return NextResponse.json(
      { status: "invalid", message: "Certains champs sont à corriger.", fieldErrors },
      { status: 422 },
    );
  }

  if (Date.now() - parsed.data.startedAt < MIN_FILL_TIME) {
    return NextResponse.json({ status: "invalid", message: "Requête refusée." }, { status: 400 });
  }

  const result = await deliverInquiry(parsed.data);
  switch (result.status) {
    case "sent":
      return NextResponse.json({ status: "sent" });
    case "not_configured":
      return NextResponse.json(
        {
          status: "not_configured",
          message:
            "L'envoi en ligne n'est pas encore activé sur ce site. Votre message n'a pas été transmis : merci d'utiliser les coordonnées directes ci-dessous.",
        },
        { status: 503 },
      );
    default:
      return NextResponse.json(
        { status: "failed", message: "L'envoi a échoué. Merci de réessayer ou d'utiliser nos coordonnées directes." },
        { status: 502 },
      );
  }
}
