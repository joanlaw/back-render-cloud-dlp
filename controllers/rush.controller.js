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
    const { page = 1, size = 50, search = '' } = req.query;
    
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };
    
    let query = {};
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query = {
        $or: [
          { 'name.en': { $regex: searchRegex } },
          { 'name.es': { $regex: searchRegex } },
          { 'name.pt': { $regex: searchRegex } },
          { konami_id: isNaN(Number(search)) ? undefined : Number(search) }
        ].filter(Boolean)
      };
    }
    
    const rushes = await Rush.paginate(query, options);
    res.status(200).send(rushes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
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

export const getRushByValue = async (req, res) => {
  try {
    const { value } = req.params;
    
    // Comenzamos construyendo una consulta con una condición OR para cada campo por el que deseamos buscar
    const query = {
      $or: [
        { 'name.en': { $regex: new RegExp(value, 'i') } },
        { 'name.es': { $regex: new RegExp(value, 'i') } },
        { 'name.pt': { $regex: new RegExp(value, 'i') } },
      ]
    };
    
    // Intentamos convertir el valor a un número para buscar por konami_id
    const konamiIdNumber = parseInt(value, 10);
    if (!isNaN(konamiIdNumber)) query.$or.push({ konami_id: konamiIdNumber });
    
    // También añadimos el valor como un ObjectID para buscar por _id
    if (mongoose.Types.ObjectId.isValid(value)) query.$or.push({ _id: value });
    
    // Ejecutamos la consulta y enviamos la respuesta
    const rush = await Rush.findOne(query);
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send(rush);

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};
