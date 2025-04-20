<<<<<<< HEAD
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
=======
Projet de Stock
Version : 1.0.0

Description : Application web pour la gestion de stock

Auteur : Votre Nom

Licence : MIT

Aperçu
"Projet de Stock" est une application web conçue pour faciliter la gestion des stocks. Elle utilise une interface moderne construite avec React et TailwindCSS, et peut être déployée comme une application desktop grâce à Electron. L'application inclut des fonctionnalités telles que la génération de codes-barres, de QR codes, de PDF, et bien plus encore.

Fonctionnalités
Gestion intuitive des stocks
Génération de codes-barres avec jsbarcode et react-barcode
Création de QR codes avec qrcode.react
Exportation de rapports en PDF avec jspdf et @react-pdf/renderer
Interface utilisateur réactive grâce à TailwindCSS, Material Tailwind, et DaisyUI
Animations fluides avec framer-motion
Notifications utilisateur via react-hot-toast, react-toastify, et sonner
Routing avec react-router-dom
Prérequis
Avant de commencer, assurez-vous d'avoir les outils suivants installés :

Node.js (version recommandée : >= 18.x)
npm ou yarn
Git (optionnel, pour cloner le projet)
Installation
Clonez le dépôt ou téléchargez les fichiers :
bash

Réduire

Envelopper

Copier
git clone https://github.com/votre-utilisateur/projet-de-stock.git
cd projet-de-stock
Installez les dépendances :
bash

Réduire

Envelopper

Copier
npm install
Scripts disponibles
Dans le répertoire du projet, vous pouvez exécuter les commandes suivantes :

Lancer en mode développement :
bash

Réduire

Envelopper

Copier
npm run dev
Démarre le serveur Vite pour le développement avec rechargement à chaud.
Lancer avec Electron en mode développement :
bash

Réduire

Envelopper

Copier
npm run electron:dev
Construit l'application avec Vite et la lance avec Electron.
Construire l'application web :
bash

Réduire

Envelopper

Copier
npm run build
Génère une version optimisée dans le dossier dist.
Construire l'application Electron :
bash

Réduire

Envelopper

Copier
npm run electron:build
Crée une version desktop pour Windows (fichier exécutable dans dist-electron).
Lancer Electron avec le build existant :
bash

Réduire

Envelopper

Copier
npm run electron
Dépendances principales
React (^18.2.0) : Bibliothèque principale pour l'interface utilisateur
Axios (^1.8.3) : Requêtes HTTP
TailwindCSS (^3.4.15) : Stylisation utilitaire
Electron (^33.2.1) : Framework pour application desktop
Vite (^6.0.5) : Outil de build rapide
Consultez le fichier package.json pour la liste complète des dépendances.

Structure du projet
text

Réduire

Envelopper

Copier
projet-de-stock/
├── dist/                # Fichiers générés pour le web
├── dist-electron/       # Fichiers générés pour Electron
├── src/                 # Code source (React, etc.)
├── main.js             # Point d'entrée pour Electron
├── build/              # Icônes et ressources pour Electron
├── package.json        # Configuration du projet
└── README.md           # Ce fichier
Contribution
Les contributions sont les bienvenues ! Voici comment contribuer :

Forkez le projet
Créez une branche pour votre fonctionnalité (git checkout -b feature/ma-fonctionnalite)
Commitez vos changements (git commit -m "Ajout de ma fonctionnalité")
Poussez votre branche (git push origin feature/ma-fonctionnalite)
Ouvrez une Pull Request
Licence
Ce projet est sous licence . Vous êtes libre de l'utiliser, le modifier et le distribuer selon les termes de cette licence.

Contact
Pour toute question ou suggestion, contactez [Votre Nom] à votre.email@example.com.

Ce README.md est adapté à votre projet et inclut des instructions claires pour l'installation, l'utilisation et la contribution. Si vous souhaitez ajouter des détails spécifiques (comme des captures d'écran, une démo, ou des fonctionnalités supplémentaires), faites-le-moi savoir !
>>>>>>> origin/main
