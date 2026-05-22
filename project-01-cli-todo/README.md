# CLI Todo — Gestionnaire de tâches TypeScript

## Description

Un gestionnaire de tâches en ligne de commande construit avec TypeScript. Il offre deux modes d'utilisation : un mode direct avec des commandes et options en ligne, et un mode interactif avec des menus guidés. Les tâches sont persistées dans `~/.portfolio-todos.json` et affichées avec un tableau coloré dans le terminal.

## Technologies utilisées

- **TypeScript 5** — typage strict, interfaces, types union
- **Commander.js** — parsing des arguments CLI
- **Inquirer.js** — prompts interactifs (listes, confirmations, saisie)
- **Chalk** — coloration du terminal (priorités, statuts, alertes)
- **cli-table3** — tableau formaté en ASCII
- **Figlet** — header ASCII art affiché au démarrage
- **UUID** — identifiants uniques par tâche
- **Node.js** — environnement d'exécution

## Fonctionnalités

- ➕ **Ajouter** une tâche avec priorité, date d'échéance et tags
- 📋 **Lister** les tâches avec filtres : tout, terminées, en cours, par priorité, par tag
- ✅ **Marquer** une tâche comme terminée (message de félicitations)
- 🗑️ **Supprimer** une tâche avec confirmation
- 🧹 **Nettoyer** toutes les tâches terminées
- 📊 **Statistiques** : total, taux de complétion, durée moyenne, tâches urgentes
- 🎨 **Codes couleur** : rouge=urgente, jaune=moyenne, vert=basse, fond rouge=en retard
- ⌨️ **Mode interactif** : lancé sans arguments, avec menus Inquirer

## Installation

```bash
cd project-01-cli-todo
npm install
npm run build
npm link   # installe la commande `todo` globalement (optionnel)
```

## Lancer le projet

### Mode direct (commandes)

```bash
# Ajouter une tâche
npx ts-node src/index.ts add "Acheter des courses" --priority high --due 2026-05-30 --tags alimentaire,urgent

# Ajouter une tâche simple
npx ts-node src/index.ts add "Faire du sport" --priority low

# Lister les tâches en cours
npx ts-node src/index.ts list

# Lister toutes les tâches
npx ts-node src/index.ts list --all

# Lister les tâches terminées
npx ts-node src/index.ts list --done

# Filtrer par priorité
npx ts-node src/index.ts list --priority high

# Filtrer par tag
npx ts-node src/index.ts list --tag urgent

# Marquer une tâche comme terminée (premiers 8 chiffres de l'ID)
npx ts-node src/index.ts done a3f1b2c4

# Supprimer une tâche
npx ts-node src/index.ts delete a3f1b2c4

# Nettoyer les terminées
npx ts-node src/index.ts clear

# Voir les statistiques
npx ts-node src/index.ts stats
```

### Mode interactif

```bash
# Lancer sans arguments pour le mode interactif
npx ts-node src/index.ts
```

### Après build

```bash
npm run build
node dist/index.js add "Ma tâche" --priority medium
node dist/index.js list --all
node dist/index.js stats
```

## Aperçu

Au lancement, un header ASCII art "Todo CLI" s'affiche en cyan. Le tableau de tâches utilise des couleurs pour indiquer l'état : les titres barrés et grisés signalent les tâches terminées, les dates en rouge sur fond rouge indiquent les tâches en retard, et les priorités sont colorées en rouge (haute), jaune (moyenne) ou vert (basse). Le mode interactif propose un menu déroulant avec toutes les actions disponibles.
