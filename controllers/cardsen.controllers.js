import { truncateSync } from 'fs';
import Card from '../models/carden.model.js'
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'
import mongoose from 'mongoose';


//METODO GET 
export const getCardsen = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const query = {
      $or: [
        { nombre: { $regex: search, $options: 'i' } },
        { name_english: { $regex: search, $options: 'i' } }
      ]
    };

    const cards = await Card.paginate(query, options);
    res.send(cards);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO POST
export const createCardsen = async (req, res) => {
  try {
    const { nombre, name_english, tipo_de_carta, atributo, tipo, tipo_magica_trampa, nivel_rango_link, escala, rareza, limitacion, atk, def, materiales, descripcion, efecto_pendulo, link_deck, adicional } = req.body;

    const secure_url = `https://res.cloudinary.com/dqofcbeaq/image/upload/v1688597356/dlprocards/${encodeURIComponent(nombre)}.jpg`;

    const card = new Card({
      nombre,
      name_english,
      tipo_de_carta,
      atributo,
      tipo,
      tipo_magica_trampa,
      nivel_rango_link,
      escala,
      rareza,
      limitacion,
      atk,
      def,
      materiales,
      descripcion,
      efecto_pendulo,
      link_deck,
      adicional,
      image: {
        secure_url
      }
    });

    await card.save();
    res.json(card);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

//METODO DELETE
export const deleteCardsen = async (req, res) => {


  try {

    const cards = await
      Card.findByIdAndDelete(req.params.id)

    if (!cards) return res.status(404).json({
      message: 'La carta no existe'
    })

    if (cards.image?.public_id) {
      await deleteImage(product.image.public_id)
    }

    return res.json(cards)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}


  //METODO GET UNA CARTA
  export const getCarden = async (req, res) => {
    try {
      const { id } = req.params;

      let card;
      if (mongoose.Types.ObjectId.isValid(id)) {
        card = await Card.findById(id);
      } else {
        card = await Card.findOne({ 
          $or: [
            { nombre: id },
            { name_english: id }
          ] 
        });
      }

      if (!card) return res.status(404).json({ message: 'La carta no existe' });

      return res.json(card);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };




//METODO UPDATE
export const updateCardsen = async (req, res) => {

  try {

    const { id } = req.params;
    const cardsUpdate = await
      Card.findByIdAndUpdate(id, req.body, {
        new: true
      })

    return res.json(cardsUpdate)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}

