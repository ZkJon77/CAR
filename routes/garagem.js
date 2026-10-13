// routes/garagem.js — Rotas CRUD da Garagem de Carros usando Supabase
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// GET /api/garagem — Lista todos os carros
router.get('/', async (req, res) => {
  try {
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('criadoEm', { ascending: false });

    if (error) {
      console.error('Erro ao listar carros do Supabase:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(cars || []);
  } catch (error) {
    console.error('Erro no servidor:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// GET /api/garagem/:id — Busca um carro por ID
router.get('/:id', async (req, res) => {
  try {
    const { data: car, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !car) {
      return res.status(404).json({ error: 'Carro não encontrado.' });
    }

    return res.status(200).json(car);
  } catch (error) {
    console.error('Erro ao buscar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// POST /api/garagem — Cria um novo carro
router.post('/', async (req, res) => {
  try {
    const { marca, modelo, preco, foto } = req.body;

    const camposFaltando = [];
    if (!marca) camposFaltando.push('marca');
    if (!modelo) camposFaltando.push('modelo');
    if (preco === undefined || preco === null || preco === '') camposFaltando.push('preco');

    if (camposFaltando.length > 0) {
      return res.status(400).json({
        error: `Campos obrigatórios ausentes: ${camposFaltando.join(', ')}.`,
      });
    }

    const { data: savedCar, error } = await supabase
      .from('cars')
      .insert([{
        marca: marca.trim(),
        modelo: modelo.trim(),
        preco: Number(preco),
        foto: foto ? foto.trim() : ''
      }])
      .select()
      .single();

    if (error) {
      console.error('Erro ao inserir carro:', error.message);
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json(savedCar);
  } catch (error) {
    console.error('Erro ao criar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// PUT /api/garagem/:id — Atualiza um carro existente
router.put('/:id', async (req, res) => {
  try {
    const { marca, modelo, preco, foto } = req.body;

    const { data: updatedCar, error } = await supabase
      .from('cars')
      .update({
        marca: marca ? marca.trim() : undefined,
        modelo: modelo ? modelo.trim() : undefined,
        preco: preco !== undefined ? Number(preco) : undefined,
        foto: foto !== undefined ? foto.trim() : undefined,
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !updatedCar) {
      return res.status(404).json({ error: 'Carro não encontrado ou erro na atualização.' });
    }

    return res.status(200).json(updatedCar);
  } catch (error) {
    console.error('Erro ao atualizar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// DELETE /api/garagem/:id — Remove um carro
router.delete('/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', req.params.id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar carro:', error.message);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

module.exports = router;
