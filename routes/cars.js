// routes/cars.js — Rotas CRUD de Carros
const express = require('express');
const router = express.Router();
const Car = require('../models/Car');

// GET /api/cars — Lista todos os carros
router.get('/', async (req, res) => {
  try {
    const cars = await Car.find().sort({ criadoEm: -1 });
    return res.status(200).json(cars);
  } catch (error) {
    console.error('Erro ao listar carros:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/cars/:id — Busca um carro por ID
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }
    return res.status(200).json(car);
  } catch (error) {
    // ID inválido do Mongoose
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }
    console.error('Erro ao buscar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/cars — Cria um novo carro
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, preco, foto } = req.body;

    // Validação manual dos campos obrigatórios
    const camposFaltando = [];
    if (!marca) camposFaltando.push('marca');
    if (!modelo) camposFaltando.push('modelo');
    if (preco === undefined || preco === null || preco === '') camposFaltando.push('preco');

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`,
      });
    }

    const newCar = new Car({ marca, modelo, preco, foto });
    const savedCar = await newCar.save();
    return res.status(201).json(savedCar);
  } catch (error) {
    // Erros de validação do Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    console.error('Erro ao criar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /api/cars/:id — Atualiza um carro existente
router.put('/:id', async (req, res) => {
  try {
    const { marca, modelo, preco, foto } = req.body;

    const updatedCar = await Car.findByIdAndUpdate(
      req.params.id,
      { marca, modelo, preco, foto },
      { new: true, runValidators: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }

    return res.status(200).json(updatedCar);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: messages.join(' ') });
    }
    console.error('Erro ao atualizar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// DELETE /api/cars/:id — Remove um carro
router.delete('/:id', async (req, res) => {
  try {
    const deletedCar = await Car.findByIdAndDelete(req.params.id);

    if (!deletedCar) {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }

    return res.status(204).send();
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }
    console.error('Erro ao deletar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
