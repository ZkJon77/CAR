// index.js — Entry point do Express
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const garagemRouter = require('./routes/garagem');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Conectar ao MongoDB se a URI estiver presente (senão usa Supabase)
if (process.env.MONGODB_URI) {
  connectDB();
}

// Rotas
app.use('/api/garagem', garagemRouter);

// Rota raiz — serve o frontend index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota status da API
app.get('/api/status', (req, res) => {
  res.status(200).json({
    message: '🚗 Garagem de Carros API está rodando!',
    endpoints: {
      listar: 'GET /api/garagem',
      buscar: 'GET /api/garagem/:id',
      criar: 'POST /api/garagem',
      atualizar: 'PUT /api/garagem/:id',
      deletar: 'DELETE /api/garagem/:id',
    },
  });
});

// Rota 404 genérica
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

// Iniciar servidor (apenas em ambiente local, não na Vercel)
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;
