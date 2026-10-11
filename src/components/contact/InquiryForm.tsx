"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, Phone, Send } from "lucide-react";
import { company } from "@/config/company";
import { track } from "@/lib/analytics";
import { cn, telHref } from "@/lib/utils";
import { inquiryTypes, validateInquiry, type InquiryType } from "@/lib/validation";

type Status = "idle" | "submitting" | "sent" | "not_configured" | "failed" | "rate_limited";
type FieldErrors = Partial<Record<"fullName" | "email" | "phone" | "type" | "detail" | "message" | "consent", string>>;

interface InquiryFormProps {
  defaultType?: InquiryType;
  /** "training" adds a programme field and adapts wording. */
  variant?: "contact" | "training";
  programOptions?: string[];
  /** Whether a delivery service is configured on the server. */
  deliveryConfigured: boolean;
}

function DirectContact() {
  const { phone, phoneDisplay, email } = company.contact;
  if (!phone && !email) {
    return (
      <p>
        Nos coordonnées directes seront publiées prochainement. Vous pouvez aussi vous adresser à{" "}
        <Link href="/agences" className="underline underline-offset-4">
          l&apos;une de nos agences
        </Link>
        .
      </p>
    );
  }
  return (
    <ul className="space-y-2">
      {phone && (
        <li>
          <a href={telHref(phone)} className="inline-flex items-center gap-2 font-medium underline underline-offset-4">
            <Phone aria-hidden className="size-4" /> {phoneDisplay ?? phone}
          </a>
        </li>
      )}
      {email && (
        <li>
          <a href={`mailto:${email}`} className="inline-flex items-center gap-2 font-medium underline underline-offset-4">
            <Mail aria-hidden className="size-4" /> {email}
          </a>
        </li>
      )}
    </ul>
  );
}

export function InquiryForm({ defaultType = "billets", variant = "contact", programOptions = [], deliveryConfigured }: InquiryFormProps) {
  const [type, setType] = useState<InquiryType>(variant === "training" ? "formation" : defaultType);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [startedAt] = useState(() => Date.now());
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status !== "idle" && status !== "submitting") resultRef.current?.focus();
  }, [status]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      type,
      detail: String(form.get("detail") ?? ""),
      message: String(form.get("message") ?? ""),
      consent: form.get("consent") === "on",
      website: String(form.get("website") ?? ""),
      startedAt,
    };

    const parsed = validateInquiry(payload);
    if (!parsed.ok) {
      // Honeypot / timing errors are not shown to people.
      const next = Object.fromEntries(
        Object.entries(parsed.errors).filter(([key]) => key !== "website" && key !== "startedAt"),
      ) as FieldErrors;
      setErrors(next);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => ({}))) as { status?: Status | "invalid"; message?: string; fieldErrors?: FieldErrors };
      if (res.ok && data.status === "sent") {
        setStatus("sent");
        track(type === "formation" ? "training_inquiry_submit" : "contact_form_submit", { inquiry_type: type });
        return;
      }
      if (data.status === "invalid" && data.fieldErrors) {
        setErrors(data.fieldErrors);
        setStatus("idle");
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
      setServerMessage(data.message ?? "");
      setStatus(data.status === "not_configured" ? "not_configured" : data.status === "rate_limited" ? "rate_limited" : "failed");
    } catch {
      setServerMessage("");
      setStatus("failed");
    }
  };

  const fieldClass = (name: keyof FieldErrors) =>
    cn(
      "w-full rounded-2xl bg-white px-4 text-ink-900 ring-1 outline-none transition-shadow placeholder:text-ink-400 focus:ring-2",
      errors[name] ? "ring-carla-700 focus:ring-carla-700" : "ring-line focus:ring-carla-600",
    );
  const label = "mb-2 block text-sm font-medium text-ink-900";
  const errorText = (name: keyof FieldErrors) =>
    errors[name] ? (
      <p id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-sm text-carla-700">
        <AlertCircle aria-hidden className="size-4" /> {errors[name]}
      </p>
    ) : null;
  const describedBy = (name: keyof FieldErrors) => (errors[name] ? `${name}-error` : undefined);

  if (status === "sent") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="rounded-[1.75rem] bg-white p-10 text-center ring-1 ring-line outline-none">
        <CheckCircle2 aria-hidden className="mx-auto size-12 text-carla-600" />
        <p className="mt-5 font-[family-name:var(--font-display)] text-2xl">Merci, votre demande a bien été envoyée.</p>
        <p className="mt-3 text-muted">Notre équipe vous répondra dans les meilleurs délais.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-8 text-sm font-medium text-carla-700 underline underline-offset-4">
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  const errorCount = Object.keys(errors).length;

  return (
    <form onSubmit={onSubmit} noValidate className="on-light space-y-6" aria-describedby={!deliveryConfigured ? "form-dev-state" : undefined}>
      {!deliveryConfigured && (
        <div id="form-dev-state" className="rounded-2xl border border-dashed border-carla-700/40 bg-carla-50 p-4 text-sm text-carla-700">
          <strong>Envoi en ligne non activé.</strong> Le formulaire vérifie vos saisies, mais aucun service d&apos;envoi n&apos;est
          encore configuré : votre message ne serait pas transmis. Utilisez de préférence nos coordonnées directes.
        </div>
      )}

      {errorCount > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="rounded-2xl bg-carla-50 p-4 text-sm text-carla-700 outline-none">
          <p className="font-semibold">
            {errorCount === 1 ? "Un champ est à corriger :" : `${errorCount} champs sont à corriger :`}
          </p>
          <ul className="mt-2 list-disc ps-5">
            {Object.entries(errors).map(([key, message]) => (
              <li key={key}>
                <a href={`#field-${key}`} className="underline underline-offset-2">
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="field-fullName" className={label}>
            Nom complet <span aria-hidden className="text-carla-700">*</span>
          </label>
          <input id="field-fullName" name="fullName" autoComplete="name" required aria-invalid={Boolean(errors.fullName)} aria-describedby={describedBy("fullName")} className={cn(fieldClass("fullName"), "h-13")} />
          {errorText("fullName")}
        </div>
        <div>
          <label htmlFor="field-email" className={label}>
            Adresse e-mail <span aria-hidden className="text-carla-700">*</span>
          </label>
          <input id="field-email" name="email" type="email" autoComplete="email" required aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} className={cn(fieldClass("email"), "h-13")} />
          {errorText("email")}
        </div>
        <div>
          <label htmlFor="field-phone" className={label}>
            Téléphone <span className="font-normal text-muted">(facultatif)</span>
          </label>
          <input id="field-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="06 00 00 00 00" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} className={cn(fieldClass("phone"), "h-13")} />
          {errorText("phone")}
        </div>
        <div className={variant === "training" || type === "partenariat" ? "" : "sm:col-span-2"}>
          <label htmlFor="field-type" className={label}>
            Objet de la demande <span aria-hidden className="text-carla-700">*</span>
          </label>
          <select
            id="field-type"
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value as InquiryType)}
            aria-invalid={Boolean(errors.type)}
            aria-describedby={describedBy("type")}
            className={cn(fieldClass("type"), "h-13")}
          >
            {inquiryTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errorText("type")}
        </div>
        {(type === "formation" || type === "partenariat") && (
          <div>
            <label htmlFor="field-detail" className={label}>
              {type === "formation" ? "Programme qui vous intéresse" : "Entreprise / organisation"}{" "}
              <span className="font-normal text-muted">(facultatif)</span>
            </label>
            {type === "formation" && programOptions.length > 0 ? (
              <select id="field-detail" name="detail" className={cn(fieldClass("detail"), "h-13")} defaultValue="">
                <option value="">Je souhaite être orienté(e)</option>
                {programOptions.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            ) : (
              <input id="field-detail" name="detail" maxLength={160} className={cn(fieldClass("detail"), "h-13")} />
            )}
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="field-message" className={label}>
            Message <span aria-hidden className="text-carla-700">*</span>
          </label>
          <textarea
            id="field-message"
            name="message"
            rows={5}
            required
            maxLength={3000}
            placeholder={
              variant === "training"
                ? "Présentez-vous brièvement : expérience, permis, disponibilités…"
                : "Votre trajet, votre date de voyage, votre question…"
            }
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            className={cn(fieldClass("message"), "resize-y py-3.5")}
          />
          {errorText("message")}
        </div>
      </div>

      {/* Honeypot — hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="field-website">Ne pas remplir</label>
        <input id="field-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id="field-consent"
            name="consent"
            type="checkbox"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            className="mt-1 size-5 shrink-0 accent-carla-600"
          />
          <label htmlFor="field-consent" className="text-sm leading-relaxed text-muted">
            J&apos;accepte que mes données soient utilisées par Carla Tamassint Transport uniquement pour répondre à ma demande,
            conformément à la{" "}
            <Link href="/confidentialite" className="text-ink-900 underline underline-offset-4">
              politique de confidentialité
            </Link>{" "}
            (loi n° 09-08). <span aria-hidden className="text-carla-700">*</span>
          </label>
        </div>
        {errorText("consent")}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted">
          <span aria-hidden className="text-carla-700">*</span> Champs obligatoires
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-13 items-center justify-center gap-2 rounded-full bg-carla-600 px-8 font-medium text-white transition-colors hover:bg-carla-700 disabled:opacity-60"
        >
          {status === "submitting" ? <Loader2 aria-hidden className="size-5 animate-spin" /> : <Send aria-hidden className="flip-rtl size-4.5" />}
          {status === "submitting" ? "Envoi en cours…" : variant === "training" ? "Envoyer ma demande d'information" : "Envoyer ma demande"}
        </button>
      </div>

      {(status === "not_configured" || status === "failed" || status === "rate_limited") && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="rounded-2xl bg-ink-900 p-6 text-sm text-ink-200 outline-none">
          <p className="flex items-center gap-2 font-semibold text-white">
            <AlertCircle aria-hidden className="size-5 text-carla-300" />
            {status === "not_configured" ? "Message non transmis" : status === "rate_limited" ? "Trop de demandes" : "L'envoi a échoué"}
          </p>
          <p className="mt-2">
            {serverMessage ||
              "Votre message n'a pas pu être transmis. Merci de réessayer dans quelques instants ou d'utiliser nos coordonnées directes."}
          </p>
          <div className="mt-4 text-white">
            <DirectContact />
          </div>
        </div>
      )}
    </form>
  );
}
