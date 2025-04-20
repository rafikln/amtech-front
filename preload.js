const { contextBridge } = require('electron');

// Exposer des APIs sécurisées au renderer (facultatif pour le moment)
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemple : une fonction simple
  ping: () => 'pong',
});