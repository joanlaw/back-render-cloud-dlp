// controllers/duels.controller.js
import Duel from '../models/duel.model.js';

// Crear un nuevo duelo
export const createDuel = async (req, res) => {
  try {
    const duel = new Duel(req.body);
    await duel.save();
    res.status(201).json(duel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener la lista de duelos
export const getDuels = async (req, res) => {
  try {
    const duels = await Duel.find().populate('player1 player2 winner');
    res.json(duels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar el resultado de un duelo
export const updateDuelResult = async (req, res) => {
  try {
    const duel = await Duel.findById(req.params.id);
    if (!duel) {
      return res.status(404).json({ message: 'Duelo no encontrado' });
    }

    duel.winner = req.body.winner;
    duel.isFinished = true;
    
    await duel.save();
    
    res.json(duel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ... otros métodos según sean necesarios
