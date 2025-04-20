import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuration de Vite
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Assure-toi que Vite utilise le bon port
    open: true,  // Ouvre automatiquement le navigateur si nécessaire
    // Si vous utilisez Electron en mode développement, vous pouvez avoir besoin d'ajouter cette option
    // pour éviter les problèmes de CORS
    cors: true,
  },
  build: {
    outDir: 'dist', // Dossier de sortie pour les fichiers compilés
    rollupOptions: {
      input: 'index.html', // Assurez-vous que le fichier principal de Vite est 'index.html'
    },
  },
});
