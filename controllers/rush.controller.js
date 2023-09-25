import Rush from '../models/rush.model.js';
import mongoose from 'mongoose';

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
    const { page = 1, size = 50, search = '', konami_id = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const searchRegex = new RegExp(search, 'i');
    const konamiIdNumber = parseInt(konami_id, 10);

    const query = {
      $or: [
        { 'name.en': { $regex: searchRegex } },
        { 'name.es': { $regex: searchRegex } },
        { 'name.pt': { $regex: searchRegex } },
        { konami_id: konamiIdNumber ? konamiIdNumber : { $exists: true } }
      ]
    };

    const rushes = await Rush.paginate(query, options);
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
