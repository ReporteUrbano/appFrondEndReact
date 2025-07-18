// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Ajuste para __dirname e __filename em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor frontend rodando em http://localhost:${port}`);
});
