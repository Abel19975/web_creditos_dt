const express = require('express');
const path = require('path');

const app = express();

const PROJECT_NAME = 'web_creditos_dt';
const DIST_FOLDER = path.join(process.cwd(), 'dist', PROJECT_NAME, 'browser');

const PORT = process.env.PORT || 8080;

app.use(express.static(DIST_FOLDER));
app.use((req, res) => {
  res.sendFile(path.join(DIST_FOLDER, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});
