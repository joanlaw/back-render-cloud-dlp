import { truncateSync } from 'fs';
import Carta from '../models/card.model.js'
import { uploadImage, deleteImage } from '../utils/cloudinary.js'
import fs from 'fs-extra'


//METODO GET 
export const getCardsen = async (req, res) => {
  try {
    const cartas = await Carta.find();
    res.json(cartas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
}

//METODO POST
export const createCardsen = async (req, res) => {

  try {

    const { nombre, name, tipo_de_carta, atributo, tipo, tipo_magica_trampa, nivel_rango_link, escala, rareza, limitacion, atk, def, materiales, descripcion, efecto_pendulo, caja, estructura, selection_box, lote, adicional, fecha_lanzamiento } = req.body

    const cartas = new Carta({
      nombre,
      name,
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
      caja,
      estructura,
      selection_box,
      lote,
      adicional,
      fecha_lanzamiento
    })

    if (req.files?.image) {
      const result = await uploadImage(req.files.image.tempFilePath)
      cartas.image = {
        public_id: result.public_id,
        secure_url: result.secure_url
      }
      await fs.unlink(req.files.image.tempFilePath)

    }
    await cartas.save()
    res.json(cartas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }


}

//METODO DELETE
export const deleteCardsen = async (req, res) => {


  try {

    const cartas = await
      Carta.findByIdAndDelete(req.params.id)

    if (!cartas) return res.status(404).json({
      message: 'La carta no existe'
    })

    if (cartas.image?.public_id) {
      await deleteImage(product.image.public_id)
    }

    return res.json(cartas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}


//METODO GET UNA CARTA
export const getCarden = async (req, res) => {


  try {

    const cartas = await
      Carta.findById(req.params.id)
     // Carta.findById(req.params.nombre)

    if (!cartas) return res.status(404).json({
      message: 'La carta no existe'
    })

    return res.json(cartas)
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}



//METODO UPDATE
export const updateCardsen = async (req, res) => {

  try {

    const { id } = req.params;
    const cardsUpdate = await
      Carta.findByIdAndUpdate(id, req.body, {
        new: true
      })

    return res.json(cardsUpdate)

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }

}

