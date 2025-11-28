const express = require('express');
const path = require('path');

const app = express();


const PROJECT_NAME = 'web-creditos-dt';
const DIST_FOLDER = path.join(process.cwd(), 'dist', PROJECT_NAME, 'browser');

// Usar el puerto que proporciona Railway automáticamente (variable de entorno PORT)
const PORT = process.env.PORT || 8080;

// Servir la carpeta de archivos estáticos de Angular
app.use(express.static(DIST_FOLDER));

// Para el routing de Angular (todas las rutas no encontradas van a index.html)
app.get('*', (req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

// Iniciar el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
