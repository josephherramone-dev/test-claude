# Carla Tamassint Transport — site web

Site officiel de **Carla Tamassint Transport**, transport de voyageurs en autocar au Maroc.
Next.js (App Router) · TypeScript · Tailwind CSS v4 · Motion · Lucide.

> Le site est construit pour **ne jamais publier d'information non vérifiée** : trajets, horaires,
> agences, coordonnées, avis, programmes de formation et pratiques de sécurité sont lus depuis des
> fichiers de configuration. Tant qu'ils sont vides, le site affiche des états d'attente honnêtes
> (et, en développement uniquement, des encadrés « Aperçu interne » qui indiquent quoi fournir).
> Voir **[LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md)** pour la liste des informations à fournir avant la mise en ligne.

---

## Sommaire

1. [Installation](#installation)
2. [Structure du projet](#structure-du-projet)
3. [Modifier le contenu](#modifier-le-contenu) — entreprise, trajets, agences, FAQ, avis, formation
4. [Images et logo](#images-et-logo)
5. [Réservation Markoub.ma](#réservation-markoubma)
6. [Formulaires de contact](#formulaires-de-contact)
7. [Assistant Carla (chatbot)](#assistant-carla-chatbot)
8. [Mesure d'audience](#mesure-daudience)
9. [SEO](#seo)
10. [Internationalisation (arabe, anglais)](#internationalisation)
11. [Déploiement](#déploiement)
12. [Qualité et tests](#qualité-et-tests)

---

## Installation

Prérequis : **Node.js ≥ 20.9** et npm.

```bash
npm install
cp .env.example .env.local   # puis compléter les valeurs utiles
npm run dev                  # http://localhost:3000
```

| Commande            | Rôle                                             |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Serveur de développement (contenu de démonstration visible) |
| `npm run build`     | Build de production                              |
| `npm run start`     | Sert le build de production                      |
| `npm run lint`      | ESLint (config Next.js core-web-vitals + TypeScript) |
| `npm run typecheck` | Vérification TypeScript                          |
| `npm run check`     | typecheck + lint                                 |

### Contenu de démonstration

En **développement**, des trajets/agences/programmes fictifs (« Ville A », « Ville B »…) marqués
**Démonstration** permettent de visualiser toutes les mises en page. Ils ne sont **jamais** rendus dans
un build de production, ni listés dans le sitemap, ni émis en données structurées. Pour une préproduction,
`NEXT_PUBLIC_SHOW_DEMO_CONTENT=true` les affiche en forçant `noindex`.

---

## Structure du projet

```
src/
├── app/                      # Pages (App Router), API, sitemap, robots
│   ├── page.tsx              # Accueil
│   ├── services/             # Les 4 piliers
│   ├── trajets/              # Liste + /trajets/[origine]-[destination]
│   ├── agences/              # Annuaire des agences
│   ├── formation/            # Formation des conducteurs + formulaire
│   ├── a-propos/ contact/ reservation/ faq/
│   ├── mentions-legales/ confidentialite/
│   ├── api/inquiry/route.ts  # Formulaires (validation, anti-spam, envoi)
│   ├── api/chat/route.ts     # Chatbot (FAQ + IA optionnelle côté serveur)
│   ├── sitemap.ts robots.ts icon.svg
├── components/               # Composants réutilisables par domaine
│   ├── layout/ (Header, Footer, PageHero…)  home/ (Hero)  booking/
│   ├── pillars/ routes/ agencies/ testimonials/ faq/ chat/ contact/
│   ├── seo/ (JsonLd, Breadcrumbs)  analytics/  ui/  brand/
├── config/                   # ⚙️  Données entreprise & réglages
│   ├── company.ts            # Nom, coordonnées, réseaux, pratiques vérifiées, mentions légales
│   ├── booking.ts            # Intégration Markoub.ma
│   ├── images.ts             # Emplacements photo
│   ├── navigation.ts  site.ts
├── data/                     # 📄  Contenus éditables
│   ├── routes.ts agencies.ts faq.ts testimonials.ts training.ts pillars.ts
├── i18n/                     # Locales, sens d'écriture, dictionnaire FR
├── lib/                      # SEO, validation, analytics, chat, rate limit, envoi
└── types/content.ts          # Modèles de données typés
```

---

## Modifier le contenu

Tous les contenus sont typés (`src/types/content.ts`) : une erreur de saisie est signalée par `npm run typecheck`.

### Informations de l'entreprise — `src/config/company.ts`

Coordonnées (téléphone au format E.164 `+212…` + format affiché), e-mail, adresse, horaires du service
client, **WhatsApp** (le bouton n'apparaît qu'avec un numéro renseigné), réseaux sociaux, source d'avis
publique, mentions légales (RC, ICE, IF, hébergeur…).

`verifiedPractices` alimente l'encadré « Nos pratiques » de chaque pilier (sécurité, temps, confort,
formation) : n'y inscrire que des pratiques **réelles et vérifiables**. `amenities` : équipements à bord
réellement disponibles.

### Trajets — `src/data/routes.ts`

Ajouter chaque trajet exploité dans `verifiedRoutes` :

```ts
{
  status: "verified",
  origin: { slug: "al-hoceima", name: "Al Hoceima" },
  destination: { slug: "tanger", name: "Tanger" },
  durationMinutes: 300,                       // facultatif — seulement si confirmé
  departures: [{ time: "07:30", arrival: "12:30", days: "Tous les jours", from: "Gare routière" }],
  stops: ["Chefchaouen"],                     // facultatif
  bookingUrl: "https://markoub.ma/…",         // facultatif — lien Markoub vérifié pour ce trajet
  lastVerified: "2026-10-01",                 // affiché aux voyageurs
}
```

Chaque trajet vérifié obtient automatiquement :
- une page indexable `/trajets/al-hoceima-tanger` (title, description, canonical, fil d'Ariane + JSON-LD),
- une entrée dans le sitemap, la recherche de trajets et le bloc « Horaires publiés »,
- des liens internes vers les agences des deux villes et les trajets liés.

Les **prix ne font pas partie du modèle** : ils sont affichés par Markoub.ma au moment de la recherche.

### Agences — `src/data/agencies.ts`

Ajouter les agences dans `verifiedAgencies` (adresse, téléphone, horaires, modalités de vente,
coordonnées GPS facultatives). Avec des coordonnées, une carte OpenStreetMap et un lien d'itinéraire
Google Maps s'affichent ; avec une adresse seule, seul le lien d'itinéraire est généré. Les agences
vérifiées avec adresse sont émises en `LocalBusiness` (JSON-LD). Recherche et filtres par ville sont automatiques.

### FAQ — `src/data/faq.ts`

Questions/réponses + mots-clés. **Ce fichier alimente aussi le chatbot** et le JSON-LD `FAQPage`.
Les réponses actuelles n'inventent aucune politique (bagages, annulation, remboursement) : elles
renvoient vers Markoub.ma ou le service client. Mettez-les à jour dès qu'une politique est confirmée.

### Avis clients — `src/data/testimonials.ts`

Uniquement des avis **authentiques** (fournis avec l'accord des auteurs, ou repris d'une source publique
vérifiable) avec `source` et si possible `sourceUrl`. Section masquée en production tant que la liste est vide.
Aucune note agrégée n'est émise en données structurées.

### Formation — `src/data/training.ts`

Publics, conditions d'accès, documents, programmes (`verifiedPrograms`). Ne renseigner durée, prix,
diplôme ou agrément que s'ils sont confirmés. Les intitulés des programmes vérifiés alimentent la liste
déroulante du formulaire d'inscription.

### Textes des piliers — `src/data/pillars.ts`

Titres, accroches et valeurs des quatre piliers (Sécurité, Temps, Confort, Formation). Ces textes sont
rédigés comme des **engagements**, sans affirmation factuelle : à faire valider par l'entreprise.

---

## Images et logo

### Photos — `src/config/images.ts`

Une seule photographie authentique a été fournie (`public/images/carla-autocar-route-kasbah.jpg`) ; chaque
emplacement (`hero`, `security`, `time`, `comfort`, `training`, `landscape`) en utilise un cadrage via
`position` (CSS `object-position`). Pour remplacer une photo :

1. déposer le fichier dans `public/images/` (JPEG/PNG haute qualité, ≥ 2000 px de large pour le hero) ;
2. mettre à jour `src`, `alt` (description factuelle en français), `width`, `height`, `position`.

Next.js génère automatiquement les versions AVIF/WebP redimensionnées. Prises de vue recommandées :
intérieur de l'autocar (sièges), conducteur en uniforme, gare routière / agence, embarquement des
passagers, routes et paysages marocains, session de formation. **N'utiliser que des photos dont
l'entreprise détient les droits** et qui montrent sa flotte réelle.

> Le hero est composé pour que le texte n'empiète pas sur le lettrage « C.ARLA » du car. En cas de
> changement de photo, vérifier le cadrage sur mobile et desktop (`images.hero.position` et
> `src/components/home/Hero.tsx`).

### Logo

Aucun fichier logo n'a été fourni : `src/components/brand/Wordmark.tsx` reproduit en texte le lettrage
« C.ARLA » peint sur les véhicules (police Jost, point rose). Dès réception du logo officiel (SVG de préférence) :

1. placer le fichier dans `public/brand/` ;
2. remplacer le contenu de `Wordmark.tsx` par un `<Image>`/`<svg>` du logo (conserver le texte accessible) ;
3. remplacer `src/app/icon.svg` (favicon) et, si souhaité, ajouter `src/app/apple-icon.png` (180×180).

### Couleurs et typographie

Définies dans `src/app/globals.css` (`@theme`) : noir/charbon (livrée des cars), rose Carla (plaque),
sable et crépuscule (paysage de la photo). Les teintes roses ont été choisies pour respecter les
contrastes WCAG AA (`carla-600` pour les boutons, `carla-300` pour le texte sur fond sombre).
À ajuster si la charte graphique officielle précise d'autres valeurs.

---

## Réservation Markoub.ma

Configuration : `src/config/booking.ts` et variables d'environnement.

- **Par défaut** : un panneau de réservation premium explique le parcours et ouvre **Markoub.ma dans un
  nouvel onglet** (`rel="noopener noreferrer"`). Le site ne collecte aucune donnée de paiement et
  n'affirme jamais que les billets s'achètent directement ici.
- **Intégration iframe** : renseigner `NEXT_PUBLIC_MARKOUB_EMBED_URL` **uniquement** avec une URL de
  recherche/réservation vérifiée dont l'intégration est autorisée :

  ```bash
  curl -sI "https://markoub.ma/<page>" | grep -iE "x-frame-options|content-security-policy"
  ```

  Aucune ligne `X-Frame-Options: DENY/SAMEORIGIN`, et `frame-ancestors` (si présent) doit inclure votre domaine.
  Idéalement, obtenir de Markoub une URL de widget partenaire. Le composant affiche un état de chargement,
  un lien externe permanent sous le cadre, et bascule sur le panneau de secours si le cadre ne charge pas
  en 10 s. Aucun contournement des protections du navigateur n'est utilisé.
- **Lien profond par trajet** : `bookingUrl` par trajet, ou un modèle global vérifié
  `NEXT_PUBLIC_MARKOUB_SEARCH_URL_TEMPLATE` (`{from}`, `{to}`, `{date}`).

> ⚠️ L'embarquabilité de markoub.ma n'a pas pu être vérifiée lors du développement (domaine inaccessible
> depuis l'environnement de build). L'iframe est donc désactivé par défaut.

Les boutons de réservation sont présents dans le hero, l'en-tête, le menu mobile, les pages trajets,
la page réservation, les bandeaux d'appel à l'action et le pied de page.

---

## Formulaires de contact

`/contact` (avec `?sujet=billets|trajets|agences|formation|partenariat|autre` pour présélectionner l'objet)
et `/formation#inscription`. Traitement : `src/app/api/inquiry/route.ts`.

- Validation partagée client/serveur (`src/lib/validation.ts`), messages d'erreur accessibles
  (résumé focalisé, `aria-invalid`, liens vers les champs).
- Anti-spam : champ piège (honeypot), délai minimal de saisie, limitation de débit par IP (5 / 10 min),
  validation stricte côté serveur.
- Case de consentement obligatoire (loi 09-08) liée à la politique de confidentialité.

**Envoi** (`src/lib/inquiry-delivery.ts`) — configurer l'une des options :

| Option | Variables |
| ------ | --------- |
| E-mail via [Resend](https://resend.com) | `RESEND_API_KEY`, `CONTACT_TO_EMAIL` (plusieurs séparés par des virgules), `CONTACT_FROM_EMAIL` (domaine vérifié chez Resend) |
| Webhook JSON (n8n, Make, Zapier, Formspree, CRM…) | `CONTACT_WEBHOOK_URL`, `CONTACT_WEBHOOK_SECRET` (envoyé en `Authorization: Bearer`) |

**Sans configuration**, le formulaire valide les saisies mais **n'affiche jamais de faux succès** :
un bandeau signale que l'envoi n'est pas activé et l'API répond `503 not_configured` avec les coordonnées
directes (si renseignées).

> La limitation de débit est en mémoire (une instance). Sur un hébergement serverless multi-instances,
> la remplacer par un stockage partagé (ex. Upstash Redis) dans `src/lib/rate-limit.ts`.

---

## Assistant Carla (chatbot)

Widget flottant chargé après l'hydratation (`src/components/chat/`), clairement présenté comme
**assistant virtuel**, accessible (dialogue étiqueté, Échap pour fermer, retour du focus, région `aria-live`).

- **Mode `local` (par défaut)** : moteur déterministe (`src/lib/chat/engine.ts`) basé sur la FAQ et
  quelques intentions (`src/lib/chat/knowledge.ts`). Fonctionne sans réseau. Questions hors périmètre
  (prix, sujets inconnus…) → renvoi vers le service client, sans rien inventer.
- **Mode `remote`** (`NEXT_PUBLIC_CHAT_MODE=remote`) : appelle `/api/chat` (validation, 20 messages/min/IP).
  - Sans IA configurée, l'API répond avec le moteur FAQ.
  - Avec `CHAT_AI_ENABLED=true` et `ANTHROPIC_API_KEY`, la réponse est générée par Claude
    (`CHAT_AI_MODEL`, par défaut `claude-opus-5-5`) avec un prompt système limité aux données vérifiées du site
    (FAQ, trajets vérifiés, coordonnées). La clé reste côté serveur. En cas d'erreur ou de refus, l'API retombe
    sur la réponse FAQ. Les réponses IA sont signalées « Réponse générée par IA » dans le widget.

---

## Mesure d'audience

Désactivée par défaut. Renseigner `NEXT_PUBLIC_GA_MEASUREMENT_ID` (GA4) et/ou `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`.
Un bandeau de consentement apparaît alors ; **aucun script n'est chargé avant acceptation**.

Événements suivis (`src/lib/analytics.ts`), sans aucune donnée personnelle :
`booking_cta_click`, `markoub_outbound_click`, `route_search` (villes, trouvé ou non), `agency_directions_click`,
`contact_form_submit` / `training_inquiry_submit` (type de demande uniquement), `chatbot_open`,
`chatbot_message`, `chatbot_quick_action` (sans le contenu des messages).

Si un domaine d'analytics est ajouté, mettre à jour la CSP dans `next.config.ts`.

---

## SEO

- Métadonnées uniques par page (`pageMetadata()` dans `src/lib/seo.ts`) : title, description, canonical,
  Open Graph, Twitter.
- `sitemap.xml` dynamique : pages publiques + **trajets vérifiés uniquement** ; mentions légales et
  confidentialité ajoutées une fois complétées.
- `robots.txt` : tout est bloqué tant que `NEXT_PUBLIC_ALLOW_INDEXING` ≠ `true` (préproduction protégée).
- JSON-LD : `Organization` (champs vérifiés seulement), `WebSite`, `BreadcrumbList` (pages trajets, agences…),
  `FAQPage` (/faq), `LocalBusiness` (agences vérifiées avec adresse). Aucun avis, note, prix ni horaire inventé.
- HTML sémantique, un seul `h1` par page, textes alternatifs descriptifs, liens internes trajets ↔ agences ↔ FAQ ↔ réservation.

Mots-clés ciblés sans sur-optimisation : marque, transport en autocar au Maroc, billets d'autocar,
horaires et trajets, agences, formation des conducteurs. **Ne cibler que les villes réellement desservies**
(elles le seront automatiquement via les pages trajets vérifiés).

Guide Search Console : **[docs/SEARCH_CONSOLE.md](./docs/SEARCH_CONSOLE.md)**.

---

## Internationalisation

Le français est la langue publiée (`lang="fr-MA"`). L'architecture prépare l'arabe (RTL) et l'anglais :

- `src/i18n/config.ts` : locales, sens d'écriture (`ar` → `rtl`), attribut `lang`.
- `src/i18n/dictionaries/fr.ts` : libellés d'interface (boutons, chatbot, formulaires…).
- Mise en page en **propriétés logiques** (`ms-/me-`, `ps-/pe-`, `start-/end-`, `text-start`) et icônes
  directionnelles marquées `flip-rtl`.

Pour ajouter une langue :
1. ajouter la locale dans `locales` et créer `dictionaries/ar.ts` (même forme que `fr.ts`) ;
2. déplacer les pages sous `src/app/[locale]/` avec `generateStaticParams` sur les locales, et passer
   `lang`/`dir` depuis `localeHtmlLang`/`localeDirection` dans le layout ;
3. traduire les contenus de `src/data/` (ex. dossiers `src/data/ar/…`) et ajouter `alternates.languages`
   (hreflang) dans `pageMetadata` ;
4. charger une police arabe (ex. `@fontsource-variable/noto-kufi-arabic`) pour la locale `ar`.

---

## Déploiement

### Vercel (recommandé)

1. Importer le dépôt dans Vercel (framework détecté automatiquement, Node 20+).
2. Renseigner les variables d'environnement de `.env.example` (au minimum `NEXT_PUBLIC_SITE_URL`).
3. Préproduction : laisser `NEXT_PUBLIC_ALLOW_INDEXING=false`. Production : `true` une fois la
   [checklist](./LAUNCH_CHECKLIST.md) complétée.
4. Associer le domaine ; HTTPS est automatique.

Les variables `NEXT_PUBLIC_*` étant intégrées au build, **redéployer** après les avoir modifiées.

### Autre hébergeur Node.js

```bash
npm ci && npm run build && npm run start   # PORT=3000 par défaut
```

Derrière un proxy (Nginx, Caddy) avec HTTPS. Les routes `/api/*` nécessitent un runtime Node.js :
un hébergement statique pur ne convient pas (formulaires et chatbot distant).

### Et WordPress ?

Cette application Next.js **n'est pas un thème WordPress** et ne s'installe pas dans WordPress. Si un site
WordPress existe déjà :
- **Option recommandée** : héberger ce site (Vercel ou serveur Node) sur le domaine principal, et conserver
  WordPress sur un sous-domaine si nécessaire (ex. `blog.domaine.ma`) ;
- **Headless** : utiliser WordPress comme back-office (API REST/WPGraphQL) et remplacer les fichiers de
  `src/data/` par des appels à cette API ;
- prévoir des **redirections 301** des anciennes URL WordPress vers les nouvelles pages (`next.config.ts › redirects`).

### En-têtes de sécurité

`next.config.ts` définit une CSP (iframes limités à Markoub.ma et OpenStreetMap), `X-Frame-Options`,
`Referrer-Policy`, `Permissions-Policy`, HSTS.

---

## Qualité et tests

Vérifications effectuées pendant le développement : typecheck, lint, build de production, rendu
mobile/desktop de toutes les pages (aucun débordement horizontal), navigation clavier (lien d'évitement,
menu mobile avec piège de focus, accordéon FAQ ↑ ↓ Home End, chatbot), validation et états des formulaires
(non configuré, webhook réel, erreurs), comportement iframe/secours Markoub, sitemap/robots/canonical,
`prefers-reduced-motion`, audits Lighthouse mobile. Détails dans l'historique du projet.

Accessibilité : contrastes AA, focus visibles, animations réduites si
l'utilisateur préfère réduire les mouvements.
