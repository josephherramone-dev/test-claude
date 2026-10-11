import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="grain relative flex min-h-[80svh] items-center bg-ink-950 pt-24 text-white">
      <div className="container-page relative z-[2]">
        <p className="eyebrow text-carla-300">Erreur 404</p>
        <h1 className="display-xl mt-6 max-w-3xl">Cette route ne mène nulle part.</h1>
        <p className="mt-6 max-w-xl text-lg text-ink-300">La page demandée n&apos;existe pas ou a été déplacée.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <ButtonLink href="/trajets" variant="outline-light">Voir les trajets</ButtonLink>
        </div>
      </div>
    </section>
  );
}
