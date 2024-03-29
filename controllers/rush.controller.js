import Rush from '../models/rush.model.js';
import mongoose from 'mongoose';
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'

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
    const { page = 1, size = 50, search = '', konami_id = '', id, name_en, name_es, name_pt } = req.query;
    
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
    
    if (id) query._id = id;
    if (name_en) query['name.en'] = name_en;
    if (name_es) query['name.es'] = name_es;
    if (name_pt) query['name.pt'] = name_pt;

    const rushes = await Rush.paginate(query, options);
    
    // Modificar la respuesta para excluir el campo public_id de la imagen
    const modifiedRushes = rushes.docs.map(rush => {
      const modifiedRush = rush.toObject(); // Convertir el documento de Mongoose a un objeto plano
      if(modifiedRush.image) {
        delete modifiedRush.image.public_id; // Eliminar el campo public_id del objeto de imagen
      }
      return modifiedRush;
    });
    
    res.status(200).send({...rushes, docs: modifiedRushes});
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getFilteredRushesByRarity = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    // Filtro para incluir solo "rushes" con valor en el campo 'rarity'
    const query = {
      $and: [
        {
          $or: [
            { 'name.en': { $regex: search, $options: 'i' } },
            { 'name.es': { $regex: search, $options: 'i' } }
          ]
        },
        { rarity: { $exists: true, $ne: null, $ne: '' } }
      ]
    };

    const rushes = await Rush.paginate(query, options);
    res.send(rushes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const getRushById = async (req, res) => {
  try {
    const rush = await Rush.findById(req.params.id);
    if (!rush) return res.status(404).send('Rush not found');
    
    const modifiedRush = rush.toObject();
    if(modifiedRush.image) {
      delete modifiedRush.image.public_id;
    }
    
    res.status(200).send(modifiedRush);
  } catch (err) {
    res.status(500).send(err);
  }
};



export const updateRush = async (req, res) => {
  try {
    const { id } = req.params;

    // Verifica si el Rush con el ID especificado existe
    const existingRush = await Rush.findById(id);
    if (!existingRush) return res.status(404).send('Rush not found');

    // Combinar los campos actualizados con los campos existentes del Rush
    let updatedFields = { ...existingRush.toObject(), ...req.body };

    // Parsea los campos que son objetos
    ['name', 'requirement', 'effect', 'summoning_condition'].forEach(field => {
      if (updatedFields[field] && typeof updatedFields[field] === 'string') {
        try {
          updatedFields[field] = JSON.parse(updatedFields[field]);
        } catch (err) {
          console.error(`Error parsing field ${field}:`, err);
        }
      }
    });

    // Actualiza la rareza si se proporciona en el cuerpo de la solicitud
    if (req.body.rarity) {
      updatedFields.rarity = req.body.rarity;
    }

    // Actualiza el campo limited si se proporciona en el cuerpo de la solicitud
    if (req.body.limited !== undefined) {
      updatedFields.limited = req.body.limited;
    }

    // Si hay una imagen para cargar y procesar
    if (req.files?.image) {
      // Si ya existe una imagen, elimínala
      if (existingRush.image?.public_id) {
        await deleteImage(existingRush.image.public_id);
      }

      const result = await uploadImage(req.files.image.tempFilePath);
      updatedFields.image = {
        public_id: result.public_id,
        secure_url: result.secure_url
      };
      await fs.unlink(req.files.image.tempFilePath);
    }

    const rush = await Rush.findByIdAndUpdate(id, updatedFields, { new: true, runValidators: true });

    // Elimina el campo public_id de la imagen antes de enviar la respuesta
    const modifiedRush = rush.toObject();
    if (modifiedRush.image) {
      delete modifiedRush.image.public_id;
    }

    res.status(200).send(modifiedRush);

  } catch (err) {
    console.error('Error:', err);
    res.status(400).send(err);
  }
};






export const deleteRush = async (req, res) => {
  try {
    const { id } = req.params;
    const rush = await Rush.findByIdAndDelete(id);
    if (!rush) return res.status(404).send('Rush not found');
    
    // If there is an associated image, delete it
    if(rush.image?.public_id) {
      await deleteImage(rush.image.public_id);
    }
    
    res.status(200).send({ message: 'Rush deleted successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
};


export const getRushByValue = async (req, res) => {
  try {
    console.log('getRushByValue called'); // Log when method is called
    const { value } = req.params;
    console.log('Value:', value); // Log the value parameter
    
    // Build a query with an OR condition for each field we want to search by
    const query = {
      $or: [
        { 'name.en': { $regex: new RegExp(value, 'i') } },
        { 'name.es': { $regex: new RegExp(value, 'i') } },
        { 'name.pt': { $regex: new RegExp(value, 'i') } },
      ]
    };
    
    // Try to convert the value to a number to search by konami_id
    const konamiIdNumber = parseInt(value, 10);
    if (!isNaN(konamiIdNumber)) query.$or.push({ konami_id: konamiIdNumber });

    // Also add the value as an ObjectID to search by _id
    if (mongoose.Types.ObjectId.isValid(value)) query.$or.push({ _id: value });
    
    console.log('Query:', query); // Log the constructed query
    
    // Execute the query and send the response
    // Exclude the public_id from the response
    const rush = await Rush.findOne(query).select('-image.public_id');
    console.log('Found Rush:', rush); // Log the found rush
    
    if (!rush) return res.status(404).send('Rush not found');
    res.status(200).send(rush);

  } catch (err) {
    console.error('Error in getRushByValue:', err); // Log any error that occurs
    res.status(500).send('Internal Server Error');
  }
};


