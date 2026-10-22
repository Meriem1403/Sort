# Sort

Présentation d'une application de **sorties intergénérationnelles** : les jeunes et les seniors se retrouvent autour d'événements, chacun dans son cercle.

Ce dépôt est la vitrine et le premier parcours (compte, événements, fiche, profil, administration). L'application complète, web et mobile, est [Sorttonvieux](https://github.com/Meriem1403/Sorttonvieux).

<p align="center">
  <img src="https://img.shields.io/badge/react-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/vite-646CFF?logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwind-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/docker-ready-2496ED?logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <strong>Dépôt :</strong> <a href="https://github.com/Meriem1403/Sort">github.com/Meriem1403/Sort</a>
</p>

---

## Sommaire

- [Présentation](#présentation)
- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Déploiement](#déploiement)
- [Sécurité](#sécurité)
- [Structure du projet](#structure-du-projet)
- [Scripts disponibles](#scripts-disponibles)

---

## Présentation

La page d'accueil explique le principe : un événement, deux cercles d'âge, un lieu. Les écrans suivants permettent de créer un compte, de parcourir les sorties, d'en publier une et de tenir un profil. Une page d'administration reprend la modération.

Sort ne porte pas la messagerie ni la base partagée : c'est le rôle de Sorttonvieux (Next.js, Expo, Supabase).

---

## Fonctionnalités

| Page | Rôle |
|------|------|
| **Accueil** | Promesse du produit |
| **Événements** | Liste des sorties |
| **Fiche** | Détail d'une sortie |
| **Création** | Publier un événement |
| **Profil** | Compte participant |
| **Connexion** | Authentification |
| **Administration** | Modération |

---

## Stack technique

| Couche | Technologies |
|--------|----------------|
| Interface | React, Vite, Tailwind CSS, Radix UI |
| Conteneurisation | Docker, Nginx |
| Hébergement statique | Netlify (`npm run build`, dossier `dist`) |

---

## Prérequis

- **Node.js** 20 et npm
- **Git**
- **Docker**, optionnel

---

## Installation

```bash
git clone https://github.com/Meriem1403/Sort.git
cd Sort
npm install
npm run dev
```

Avec Docker :

```bash
docker compose up --build
```

La variante de production est `docker-compose.prod.yml` (Nginx sert le build).

---

## Déploiement

`netlify.toml` publie le dossier `dist` après `npm run build`. Le compose de production sert le même build derrière Nginx (`nginx.conf`).

---

## Sécurité

Application de présentation : pas de secret dans le dépôt. Les comptes de démonstration, s'il y en a dans l'interface, ne sont pas des comptes de production.

---

## Structure du projet

```
Sort/
├── src/app/pages/        # Accueil, événements, profil, admin
├── docker-compose.yml
├── docker-compose.prod.yml
├── nginx.conf
└── netlify.toml
```

---

## Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Vite |
| `npm run build` | Build de production |
| `docker compose up --build` | Conteneur de développement |

---

<p align="center">
  <sub>Sort — vitrine des sorties intergénérationnelles. L'application complète est <a href="https://github.com/Meriem1403/Sorttonvieux">Sorttonvieux</a>.</sub>
</p>
