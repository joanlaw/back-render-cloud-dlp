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

export const getRushByParams = async (req, res) => {
  try {
    const { id, konami_id, name_en, name_es, name_pt } = req.query;
    
    if (!id && !konami_id && !name_en && !name_es && !name_pt)
      return res.status(400).send('At least one query parameter is required');
      
    const query = {};
    if (id) query._id = id;
    if (konami_id) query.konami_id = konami_id;
    if (name_en) query['name.en'] = name_en;
    if (name_es) query['name.es'] = name_es;
    if (name_pt) query['name.pt'] = name_pt;

    const rush = await Rush.findOne(query);
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send(rush);
  } catch (err) {
    res.status(500).send(err);
  }
};


export const updateRush = async (req, res) => {
  try {
    const { id } = req.params;
    const rush = await Rush.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send(rush);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const deleteRush = async (req, res) => {
  try {
    const { id } = req.params;
    const rush = await Rush.findByIdAndDelete(id);
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send({ message: 'Rush deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
};

