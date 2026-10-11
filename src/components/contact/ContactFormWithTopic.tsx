"use client";

import { useSearchParams } from "next/navigation";
import { isInquiryType } from "@/lib/validation";
import { InquiryForm } from "./InquiryForm";

/** Pre-selects the inquiry type from `?sujet=` (e.g. /contact?sujet=partenariat). */
export function ContactFormWithTopic({ deliveryConfigured }: { deliveryConfigured: boolean }) {
  const topic = useSearchParams().get("sujet");
  const type = isInquiryType(topic) ? topic : "billets";
  return <InquiryForm key={type} defaultType={type} deliveryConfigured={deliveryConfigured} />;
}
