// index.js — Entry point do Express
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const carsRouter = require('./routes/cars');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB antes de iniciar as rotas
connectDB();

// Rotas
app.use('/api/cars', carsRouter);

// Rota raiz — health check
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚗 Car Manager API está rodando!',
    endpoints: {
      listar: 'GET /api/cars',
      buscar: 'GET /api/cars/:id',
      criar: 'POST /api/cars',
      atualizar: 'PUT /api/cars/:id',
      deletar: 'DELETE /api/cars/:id',
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
