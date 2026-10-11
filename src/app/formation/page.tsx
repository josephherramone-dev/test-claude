import { ClipboardList, FileText, GraduationCap, Users } from "lucide-react";
import { InquiryForm } from "@/components/contact/InquiryForm";
import { PageHero } from "@/components/layout/PageHero";
import { PillarSection } from "@/components/pillars/PillarSection";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { DemoBadge, PreviewNotice } from "@/components/ui/PreviewNotice";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pillars } from "@/data/pillars";
import { trainingContent } from "@/data/training";
import { getTrainingPrograms } from "@/lib/content";
import { isDeliveryConfigured } from "@/lib/inquiry-delivery";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Formation des conducteurs",
  description:
    "Formation et développement professionnel des conducteurs avec Carla Tamassint Transport : programmes, publics concernés, conditions d'accès et demande d'information.",
  path: "/formation",
});

function InfoList({ icon: Icon, title, items, empty }: { icon: typeof Users; title: string; items: string[]; empty: string }) {
  return (
    <div className="rounded-[1.5rem] bg-white p-7 ring-1 ring-line">
      <Icon aria-hidden className="size-7 text-carla-600" />
      <h3 className="mt-5 font-[family-name:var(--font-display)] text-xl">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-2 text-muted">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-carla-500" />
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-muted">{empty}</p>
      )}
    </div>
  );
}

export default function TrainingPage() {
  const pillar = pillars.find((p) => p.id === "formation")!;
  const programs = getTrainingPrograms();
  const verifiedTitles = programs.filter((p) => p.status === "verified").map((p) => p.title);

  return (
    <>
      <PageHero
        eyebrow="Formation"
        title="Former aujourd'hui les professionnels de la route de demain."
        lead="Transmettre l'exigence de sécurité et de service : découvrez notre démarche de formation et faites-nous part de votre projet."
        breadcrumbs={[{ name: "Formation", path: "/formation" }]}
        image="training"
      >
        <ButtonLink href="#inscription" size="lg">
          Demander des informations
        </ButtonLink>
      </PageHero>

      <PillarSection pillar={{ ...pillar, cta: { label: "Demander des informations", href: "#inscription" } }} tone="light" />

      <section aria-labelledby="programs-title" className="grain relative bg-ink-950 py-24 text-white sm:py-32">
        <div className="container-page relative z-[2]">
          <Reveal>
            <SectionHeading id="programs-title" tone="dark" eyebrow="Programmes" title="Nos programmes de formation" />
          </Reveal>
          {programs.length > 0 ? (
            <ul className="mt-12 grid gap-5 md:grid-cols-2">
              {programs.map((program, index) => (
                <Reveal as="li" key={program.id} delay={0.06 * index} className="flex flex-col rounded-[1.5rem] bg-white/[0.04] p-8 ring-1 ring-white/10">
                  <div className="flex items-center justify-between gap-3">
                    <GraduationCap aria-hidden className="size-7 text-carla-300" />
                    {program.status === "demo" && <DemoBadge />}
                  </div>
                  <h3 className="mt-6 font-[family-name:var(--font-display)] text-2xl font-light">{program.title}</h3>
                  <p className="mt-3 text-ink-300">{program.summary}</p>
                  <dl className="mt-6 grid gap-3 text-sm">
                    {program.audience && (
                      <div className="flex gap-2"><dt className="text-ink-400">Public :</dt><dd>{program.audience}</dd></div>
                    )}
                    {program.duration && (
                      <div className="flex gap-2"><dt className="text-ink-400">Durée :</dt><dd>{program.duration}</dd></div>
                    )}
                    {program.certification && (
                      <div className="flex gap-2"><dt className="text-ink-400">Validation :</dt><dd>{program.certification}</dd></div>
                    )}
                    {program.prerequisites?.length ? (
                      <div className="flex gap-2"><dt className="text-ink-400">Prérequis :</dt><dd>{program.prerequisites.join(", ")}</dd></div>
                    ) : null}
                  </dl>
                </Reveal>
              ))}
            </ul>
          ) : (
            <p className="mt-10 max-w-2xl text-lg text-ink-300">
              Le détail de nos programmes (contenu, durée, conditions d&apos;accès) sera publié prochainement. Envoyez-nous une demande
              d&apos;information pour être informé(e) des prochaines sessions.
            </p>
          )}
          <PreviewNotice tone="dark" className="mt-10">
            Renseignez les programmes réels dans <code>src/data/training.ts</code>. N&apos;indiquez durée, prix, diplôme ou
            agrément que s&apos;ils sont confirmés.
          </PreviewNotice>
        </div>
      </section>

      <section aria-labelledby="eligibility-title" className="bg-paper py-24 sm:py-32">
        <div className="container-page">
          <Reveal>
            <SectionHeading id="eligibility-title" eyebrow="Conditions" title="À qui s'adresse la formation ?" />
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            <InfoList
              icon={Users}
              title="Publics concernés"
              items={trainingContent.audiences}
              empty="Les publics concernés seront précisés pour chaque programme. Présentez-nous votre profil via le formulaire."
            />
            <InfoList
              icon={ClipboardList}
              title="Conditions d'accès"
              items={trainingContent.eligibility}
              empty="Les conditions d'accès (permis, expérience…) vous seront communiquées sur demande."
            />
            <InfoList
              icon={FileText}
              title="Documents à prévoir"
              items={trainingContent.documents}
              empty="La liste des pièces à fournir vous sera transmise lors de votre demande d'inscription."
            />
          </div>
        </div>
      </section>

      <section id="inscription" aria-labelledby="training-form-title" className="scroll-mt-20 bg-paper-2 py-24 sm:py-32">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SectionHeading
              id="training-form-title"
              eyebrow="Demande d'information"
              title="Parlons de votre projet."
              lead="Indiquez votre profil et le programme qui vous intéresse : notre équipe vous recontactera avec les informations disponibles."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <InquiryForm variant="training" deliveryConfigured={isDeliveryConfigured()} programOptions={verifiedTitles} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
