import "server-only";
import { inquiryTypes, type InquiryInput } from "@/lib/validation";

/**
 * Delivers a validated inquiry to the company.
 *
 * Supported transports (first configured wins):
 *  1. Resend e-mail API   — RESEND_API_KEY + CONTACT_TO_EMAIL + CONTACT_FROM_EMAIL
 *  2. Generic JSON webhook — CONTACT_WEBHOOK_URL (n8n, Make, Zapier, Formspree, CRM…)
 *     optional CONTACT_WEBHOOK_SECRET sent as `Authorization: Bearer …`
 *
 * When nothing is configured, `{ status: "not_configured" }` is returned and
 * the form tells the visitor so — never a fake success.
 */
export type DeliveryResult = { status: "sent" } | { status: "not_configured" } | { status: "failed" };

export function isDeliveryConfigured(): boolean {
  return Boolean(
    (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL) ||
      process.env.CONTACT_WEBHOOK_URL,
  );
}

function typeLabel(type: InquiryInput["type"]): string {
  return inquiryTypes.find((t) => t.value === type)?.label ?? type;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function deliverInquiry(input: InquiryInput): Promise<DeliveryResult> {
  const payload = {
    type: input.type,
    typeLabel: typeLabel(input.type),
    fullName: input.fullName,
    email: input.email,
    phone: input.phone || null,
    detail: input.detail || null,
    message: input.message,
    consent: true,
    receivedAt: new Date().toISOString(),
  };

  try {
    if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL && process.env.CONTACT_FROM_EMAIL) {
      const rows = [
        ["Objet", payload.typeLabel],
        ["Nom", payload.fullName],
        ["E-mail", payload.email],
        ["Téléphone", payload.phone ?? "—"],
        ["Précision", payload.detail ?? "—"],
      ]
        .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><strong>${k}</strong></td><td>${escapeHtml(v!)}</td></tr>`)
        .join("");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL,
          to: process.env.CONTACT_TO_EMAIL.split(",").map((s) => s.trim()),
          reply_to: payload.email,
          subject: `[Site web] ${payload.typeLabel} — ${payload.fullName}`,
          html: `<table>${rows}</table><p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>`,
          text: `${payload.typeLabel}\n${payload.fullName} <${payload.email}> ${payload.phone ?? ""}\n${payload.detail ?? ""}\n\n${payload.message}`,
        }),
        signal: AbortSignal.timeout(10000),
      });
      return res.ok ? { status: "sent" } : { status: "failed" };
    }

    if (process.env.CONTACT_WEBHOOK_URL) {
      const res = await fetch(process.env.CONTACT_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.CONTACT_WEBHOOK_SECRET
            ? { Authorization: `Bearer ${process.env.CONTACT_WEBHOOK_SECRET}` }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      });
      return res.ok ? { status: "sent" } : { status: "failed" };
    }
  } catch (error) {
    console.error("[inquiry] delivery error", error instanceof Error ? error.message : "unknown");
    return { status: "failed" };
  }

  return { status: "not_configured" };
}
