import Mazo from '../models/mazo.model.js';
import { uploadImage, deleteImage } from '../utils/cloudinary.js';
import fs from 'fs-extra';

// METODO GET
export const getMazos = async (req, res) => {
  try {
    const mazos = await Mazo.find();
    res.json(mazos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO POST
export const createMazo = async (req, res) => {
  try {
    const {
      jugador,
      habilidad,
      arquetipo,
      arquetipo_image,
      engine,
      top,
      puesto,
      etiquetas,
      mainDeck,
      extraDeck,
      // ... otros campos
    } = req.body;

    const mazo = new Mazo({
      jugador,
      habilidad,
      arquetipo,
      arquetipo_image,
      engine,
      top,
      puesto,
      etiquetas,
      mainDeck,
      extraDeck,
      // ... otros campos
    });

    await mazo.save();
    res.json(mazo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE
export const deleteMazo = async (req, res) => {
  try {
    const mazo = await Mazo.findByIdAndDelete(req.params.id);

    if (!mazo) return res.status(404).json({ message: 'El mazo no existe' });

    //  if (mazo.image?.public_id) {
    //    await deleteImage(product.image.public_id)
    //  }

    return res.json(mazo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO GET UN MAZO
export const getMazo = async (req, res) => {
  try {
    const mazo = await Mazo.findById(req.params.id);

    if (!mazo) return res.status(404).json({ message: 'El mazo no existe' });

    return res.json(mazo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO UPDATE
export const updateMazo = async (req, res) => {
  try {
    const { id } = req.params;
    const mazoUpdate = await Mazo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(mazoUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

