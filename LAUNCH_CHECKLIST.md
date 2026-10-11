# Checklist avant mise en ligne

Informations à fournir par **Carla Tamassint Transport** et réglages à effectuer.
Rien de ce qui suit n'a été inventé : tant qu'un élément manque, le site le masque ou affiche un état d'attente.

## 1. Identité et coordonnées — `src/config/company.ts`

- [ ] Raison sociale exacte
- [ ] Téléphone du service client (format international + format affiché)
- [ ] E-mail de contact
- [ ] Adresse du siège / bureau principal
- [ ] Horaires du service client
- [ ] Numéro WhatsApp vérifié (facultatif — le bouton est masqué sinon)
- [ ] Liens officiels des réseaux sociaux
- [ ] Lien public vers les avis clients (Google Business Profile, Facebook…)
- [ ] Année de création (facultatif, uniquement si l'entreprise souhaite la publier)

## 2. Marque et visuels

- [ ] Logo officiel en SVG (et version claire/sombre si elles existent) — voir README › Logo
- [ ] Codes couleur officiels de la charte (si différents de ceux extraits de la photo)
- [ ] Photos supplémentaires dont l'entreprise détient les droits : intérieur, conducteurs, agences/gares, formation
- [ ] Validation du cadrage du hero sur mobile et desktop

## 3. Trajets — `src/data/routes.ts`

- [ ] Liste des trajets réellement exploités (ville de départ / d'arrivée)
- [ ] Pour chaque trajet, si disponible : horaires, jours, durée indicative, arrêts, lieu de départ
- [ ] Date de dernière vérification
- [ ] Liens Markoub.ma propres à chaque trajet (facultatif)

## 4. Agences — `src/data/agencies.ts`

- [ ] Nom, ville et adresse complète de chaque agence / point de vente
- [ ] Téléphone, horaires d'ouverture
- [ ] Modalités d'achat au guichet (paiement accepté…)
- [ ] Coordonnées GPS (facultatif, pour la carte)

## 5. Réservation — Markoub.ma

- [ ] Confirmer le partenariat et l'URL de la page opérateur / de recherche à utiliser
- [ ] Vérifier si Markoub autorise l'intégration en iframe (ou fournit un widget) → `NEXT_PUBLIC_MARKOUB_EMBED_URL`
- [ ] Format vérifié d'un lien de recherche par trajet (facultatif) → `NEXT_PUBLIC_MARKOUB_SEARCH_URL_TEMPLATE`

## 6. Politiques voyageurs — `src/data/faq.ts`

- [ ] Règles bagages (nombre, poids, objets interdits)
- [ ] Conditions de modification / annulation / remboursement (billets en agence)
- [ ] Procédure en cas de retard
- [ ] Validation de l'ensemble des réponses de la FAQ (elles alimentent aussi le chatbot)

## 7. Engagements et pratiques — `company.verifiedPractices`, `src/data/pillars.ts`

- [ ] Pratiques de sécurité réelles (contrôles, entretien, équipements…) — uniquement si vérifiables
- [ ] Équipements à bord réellement disponibles (`company.amenities`)
- [ ] Validation des textes des quatre piliers et de la page À propos

## 8. Formation — `src/data/training.ts`

- [ ] Programmes proposés (intitulé, objectifs, public)
- [ ] Conditions d'accès (permis, expérience…) et documents à fournir
- [ ] Durée, coût, certification/agrément — **uniquement s'ils sont confirmés**

## 9. Avis clients — `src/data/testimonials.ts`

- [ ] Avis authentiques avec accord des auteurs, ou repris d'une source publique vérifiable (avec lien)

## 10. Mentions légales et données personnelles

- [ ] RC, ICE, IF, siège social, directeur de la publication, hébergeur (`company.legal`)
- [ ] Numéro de déclaration/autorisation CNDP (loi 09-08)
- [ ] Durée de conservation des demandes reçues via les formulaires
- [ ] Relecture de `/mentions-legales` et `/confidentialite`

## 11. Services techniques (variables d'environnement)

- [ ] `NEXT_PUBLIC_SITE_URL` = domaine définitif en `https://`
- [ ] Envoi des formulaires : Resend (`RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL`) **ou** webhook (`CONTACT_WEBHOOK_URL`)
- [ ] Test d'envoi réel depuis `/contact` et `/formation`
- [ ] (Facultatif) Chatbot IA : `NEXT_PUBLIC_CHAT_MODE=remote`, `CHAT_AI_ENABLED=true`, `ANTHROPIC_API_KEY`
- [ ] (Facultatif) Mesure d'audience : `NEXT_PUBLIC_GA_MEASUREMENT_ID` / `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Rate limiting partagé si hébergement multi-instances (voir README)
- [ ] `NEXT_PUBLIC_SHOW_DEMO_CONTENT` absent ou `false`
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` **en dernier**, une fois tout le reste validé

## 12. Après la mise en ligne

- [ ] Suivre [docs/SEARCH_CONSOLE.md](./docs/SEARCH_CONSOLE.md)
- [ ] Audit Lighthouse sur le domaine réel (mobile et desktop)
- [ ] Test sur appareils réels (iOS Safari, Android Chrome)
