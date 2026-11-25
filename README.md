# LT GROUP

Site officiel de LT GROUP — aménagement foncier, BTP & VRD, construction immobilière, hydraulique, électrification et topographie & études.

## Développement

Prérequis : Node.js 22+ et Bun.

```sh
git clone <this-repository-url>
cd light-terra-group
bun install
bun run dev
```

## Production

Le site officiel est publié sur https://ltgroup-ci.com.

Mainteneur : Inocent KOFFI.

## Refonte architecture (novembre 2026) — suivi pour toute IA ou développeur

Objectif : chaque page traite un sujet unique, l'accueil n'est qu'une vitrine qui aiguille. Aucune information ne doit être recopiée d'une page à l'autre.

Règles validées par LT GROUP (Raïssa Amon valide les contenus) :
- 10 services, ordre officiel : 01 Études, 02 Aménagement foncier, 03 Promotion immobilière, 04 Adduction d'eau potable, 05 Électrification HTA/MT/BT/EP, 06 BTP, 07 VRD, 08 Réseau télécom, 09 Sécurité électronique, 10 Gestion immobilière (`src/content/services.ts`).
- Contacts : 07 49 22 47 22 / 07 07 74 14 84, fixe 27 22 42 26 27, contact@ltgroup-ci.com. Siège : Abidjan Cocody Akouédo extension sud-est, Lot 640, îlot 60.
- Aucun prix affiché pour les terrains (Dabou).

Répartition des contenus :
- Accueil : hero, chiffres clés, aperçu compact des 10 services (titre + icône), 1 projet phare, 4 engagements, newsletter, appel à l'action.
- Expertises (`/services`) : détail complet des 10 services + formulaire de devis.
- Projets & Terrains (`/projets`) : catalogue filtrable + fiches avec fil d'Ariane.
- Le Groupe (`/a-propos`) : identité, méthode de travail (4 étapes).
- Actualités, Témoignages, FAQ : pages dédiées, liées depuis le pied de page.
- Contact : coordonnées, carte, formulaire.

### Tâches (cocher quand c'est fait — ne pas refaire une tâche cochée)
- [x] Menu principal réduit à 5 entrées : Accueil, Expertises, Projets & Terrains, Le Groupe, Contact (+ bouton devis) ; Actualités/Témoignages/FAQ dans le pied de page.
- [x] Accueil : grille des services en version compacte (plus de longs textes).
- [x] Accueil : 1 seul projet phare au lieu de 3 ; galerie de terrains et 3 actualités retirées.
- [x] Accueil : les 4 étapes de travail déplacées vers « Le Groupe » ; l'accueil garde les 4 engagements.
- [x] Ancienne page `/activites` redirigée vers `/services` (retirée du plan du site).
- [ ] Témoignages réels (nom, fonction, entreprise, photo) — en attente des vrais témoignages du client.
- [ ] Photos HD et texte concret par chantier — en attente des éléments du client.
- [ ] Numéro RCCM dans les mentions légales — en attente du client.
