# Google Search Console — mise en place

Ce guide est à suivre **après** la mise en ligne sur le domaine définitif. Rien ne garantit
l'indexation ou un positionnement : seules les données de Search Console permettent de le constater.

## 1. Prérequis

- [ ] `NEXT_PUBLIC_SITE_URL` = URL définitive (`https://www.…`), déployée
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true` (sinon `robots.txt` bloque tout et les pages sont en `noindex`)
- [ ] Vérifier : `https://<domaine>/robots.txt` mentionne le sitemap ; `https://<domaine>/sitemap.xml` liste les pages

## 2. Ajouter la propriété

1. Ouvrir <https://search.google.com/search-console> avec le compte Google de l'entreprise.
2. Choisir **Propriété de domaine** (recommandé, vérification DNS via un enregistrement TXT chez le
   registraire) — ou **Préfixe d'URL** avec la méthode **balise HTML** :
   copier la valeur `content` de la balise proposée dans la variable `GOOGLE_SITE_VERIFICATION`, redéployer,
   puis cliquer sur « Valider ».

## 3. Soumettre le sitemap

Menu **Sitemaps** → saisir `sitemap.xml` → **Envoyer**. Le sitemap ne contient que des pages publiques et
les trajets vérifiés ; il se met à jour automatiquement à chaque déploiement.

## 4. Contrôles initiaux

- [ ] **Inspection d'URL** de la page d'accueil, puis « Demander une indexation »
- [ ] Même chose pour `/trajets`, `/agences`, `/reservation` et 2–3 pages trajets
- [ ] Rapport **Pages** : vérifier l'absence d'erreurs (404, redirections, `noindex` inattendu)
- [ ] Rapport **Améliorations** : fil d'Ariane, FAQ — corriger les éventuelles erreurs de données structurées
- [ ] Tester quelques URL avec le [test des résultats enrichis](https://search.google.com/test/rich-results)
- [ ] Rapport **Signaux Web essentiels** (après quelques semaines de trafic réel)

## 5. Fiche d'établissement Google (recommandé)

Créer ou revendiquer le **Google Business Profile** de l'entreprise (et des agences) avec les mêmes nom,
adresse et téléphone que sur le site. Renseigner l'URL du profil d'avis dans `company.reviewSource`.

## 6. Suivi régulier

- Mensuel : rapport **Performances** (requêtes, pages, CTR), nouvelles erreurs d'indexation.
- À chaque nouveau trajet vérifié : inspecter et demander l'indexation de sa page.
- Ne jamais ajouter de pages « ville » pour des destinations non desservies, de texte caché ou de
  mots-clés répétés : ces pratiques sont sanctionnées.

## 7. Bing Webmaster Tools (facultatif)

<https://www.bing.com/webmasters> → importer la propriété depuis Search Console.
