import Rush from '../models/rush.model.js';

export const createRush = async (req, res) => {
  try {
    const rush = new Rush(req.body);
    await rush.save();
    res.status(201).send(rush);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getRushes = async (req, res) => {
  try {
    const rushes = await Rush.find();
    res.status(200).send(rushes);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getRushById = async (req, res) => {
  try {
    const rush = await Rush.findById(req.params.id);
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send(rush);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Puedes añadir métodos para actualizar, borrar, etc.
