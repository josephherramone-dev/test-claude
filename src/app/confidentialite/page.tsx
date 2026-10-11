import Link from "next/link";
import { LegalPage, Missing } from "@/components/layout/LegalPage";
import { company } from "@/config/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: `Comment ${company.name} traite les données personnelles transmises via son site.`,
  path: "/confidentialite",
  noindex: !company.legalName,
});

export default function PrivacyPage() {
  return (
    <LegalPage title="Politique de confidentialité" path="/confidentialite">
      <section>
        <h2>Responsable du traitement</h2>
        <p>
          {company.legalName ?? <Missing label="raison sociale" />}, {company.legal.registeredOffice ?? <Missing label="adresse" />}.
          Conformément à la loi n° 09-08 relative à la protection des personnes physiques à l&apos;égard du traitement des données à
          caractère personnel. Déclaration / autorisation CNDP : <Missing label="numéro CNDP" />.
        </p>
      </section>
      <section>
        <h2>Données collectées</h2>
        <p>
          Via les formulaires de contact et de demande d&apos;information : nom, adresse e-mail, téléphone (facultatif), objet et
          contenu de votre message. Via l&apos;assistant virtuel : les questions saisies, traitées uniquement pour vous répondre.
        </p>
        <p>
          Le site ne collecte aucune donnée de paiement : la réservation et le paiement sont réalisés sur Markoub.ma, qui applique
          sa propre politique de confidentialité.
        </p>
      </section>
      <section>
        <h2>Finalités</h2>
        <p>Répondre à vos demandes (billets, trajets, agences, formation, partenariats). Vos données ne sont ni vendues ni cédées.</p>
      </section>
      <section>
        <h2>Durée de conservation</h2>
        <p>
          <Missing label="durée de conservation définie par l'entreprise" />
        </p>
      </section>
      <section>
        <h2>Mesure d&apos;audience</h2>
        <p>
          Si une mesure d&apos;audience est activée, elle ne fonctionne qu&apos;après votre accord et n&apos;enregistre aucune donnée
          personnelle (ni nom, ni e-mail, ni contenu de message). Vous pouvez retirer votre accord en effaçant les données de site
          de votre navigateur.
        </p>
      </section>
      <section>
        <h2>Vos droits</h2>
        <p>
          Vous disposez d&apos;un droit d&apos;accès, de rectification et d&apos;opposition. Pour l&apos;exercer, contactez-nous via
          la <Link href="/contact" className="text-ink-900 underline underline-offset-4">page contact</Link>
          {company.contact.email ? ` ou à ${company.contact.email}` : ""}.
        </p>
      </section>
    </LegalPage>
  );
}
