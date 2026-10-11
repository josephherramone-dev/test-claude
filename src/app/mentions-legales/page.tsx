import { LegalPage, Missing } from "@/components/layout/LegalPage";
import { company } from "@/config/company";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

const complete = Boolean(company.legalName && company.legal.registeredOffice && company.legal.rc);

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: `Mentions légales du site ${company.name}.`,
  path: "/mentions-legales",
  noindex: !complete,
});

export default function LegalNoticePage() {
  const { legal } = company;
  const field = (value: string | null, label: string) => value ?? <Missing label={label} />;
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales">
      <section>
        <h2>Éditeur du site</h2>
        <p>
          <strong>{company.legalName ?? company.name}</strong>
          <br />
          Siège social : {field(legal.registeredOffice, "adresse du siège")}
          <br />
          RC : {field(legal.rc, "numéro RC")} · ICE : {field(legal.ice, "ICE")} · IF : {field(legal.taxId, "identifiant fiscal")}
          <br />
          Contact : {field(company.contact.email, "e-mail")} · {field(company.contact.phoneDisplay, "téléphone")}
        </p>
        <p>Directeur de la publication : {field(legal.publicationDirector, "nom")}</p>
      </section>
      <section>
        <h2>Hébergement</h2>
        <p>{field(legal.host, "hébergeur, adresse")}</p>
      </section>
      <section>
        <h2>Réservation et paiement</h2>
        <p>
          La réservation et le paiement des billets en ligne sont assurés par la plateforme partenaire Markoub.ma, selon ses
          propres conditions générales de vente. Le site {siteConfig.url.replace(/^https?:\/\//, "")} ne vend pas de billets et
          ne collecte aucune donnée de paiement.
        </p>
      </section>
      <section>
        <h2>Propriété intellectuelle</h2>
        <p>
          Les contenus de ce site (textes, photographies, logo, marque « CARLA ») sont la propriété de {company.name} ou de leurs
          auteurs respectifs. Toute reproduction sans autorisation est interdite.
        </p>
      </section>
      <section>
        <h2>Exactitude des informations</h2>
        <p>
          Les trajets, horaires et coordonnées publiés sont fournis à titre indicatif et peuvent évoluer. Confirmez votre départ
          lors de la réservation ou auprès de nos agences.
        </p>
      </section>
    </LegalPage>
  );
}
