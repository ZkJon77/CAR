// models/Car.js — Schema Mongoose do Carro
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  marca: {
    type: String,
    required: [true, 'O campo "marca" é obrigatório.'],
    trim: true,
  },
  modelo: {
    type: String,
    required: [true, 'O campo "modelo" é obrigatório.'],
    trim: true,
  },
  preco: {
    type: Number,
    required: [true, 'O campo "preco" é obrigatório.'],
    min: [0, 'O preço não pode ser negativo.'],
  },
  foto: {
    type: String,
    default: '',
    trim: true,
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Car', carSchema);
