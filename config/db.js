// config/db.js — Conexão com MongoDB Atlas via Mongoose
const mongoose = require('mongoose');

let isConnected = false;

/**
 * Conecta ao MongoDB Atlas usando a connection string da variável de ambiente.
 * Usa cache de conexão para evitar múltiplas conexões em ambiente serverless (Vercel).
 */
async function connectDB() {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ Variável MONGODB_URI não definida. O banco não conectará, mas o servidor continuará rodando para testes locais.');
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log('✅ MongoDB conectado com sucesso.');
  } catch (error) {
    console.error('❌ Erro ao conectar no MongoDB:', error.message);
    console.warn('⚠️ O servidor continuará rodando sem conexão com o banco.');
  }
}

module.exports = connectDB;
