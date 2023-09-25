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

// Método GET para obtener múltiples "rushes"
export const getRushes = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const searchRegex = new RegExp(search, 'i');

    const query = {
      $or: [
        { 'name.en': { $regex: searchRegex } },
        { 'name.es': { $regex: searchRegex } },
        { 'name.pt': { $regex: searchRegex } },
        { konami_id: isNaN(parseInt(search, 10)) ? { $exists: true } : parseInt(search, 10) }
      ]
    };

    const rushes = await Rush.paginate(query, options);
    res.status(200).send(rushes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
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

// Método GET para obtener un "rush" específico
export const getRushByValue = async (req, res) => {
  try {
    const { value } = req.params;
    let rush;
    
    if (mongoose.Types.ObjectId.isValid(value)) {
      rush = await Rush.findById(value);
    } else {
      const searchRegex = new RegExp(value, 'i');
      const query = {
        $or: [
          { 'name.en': { $regex: searchRegex } },
          { 'name.es': { $regex: searchRegex } },
          { 'name.pt': { $regex: searchRegex } },
          { konami_id: isNaN(parseInt(value, 10)) ? { $exists: false } : parseInt(value, 10) }
        ]
      };
      rush = await Rush.findOne(query);
    }

    if (!rush) return res.status(404).json({ message: 'Rush not found' });
    return res.status(200).json(rush);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};