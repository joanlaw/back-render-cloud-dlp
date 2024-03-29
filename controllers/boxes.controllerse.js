import Box from '../models/box.model.js';

// METODO GET
export const getBoxes = async (req, res) => {
  try {
    const boxes = await Box.find();
    res.json(boxes);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO POST
export const createBox = async (req, res) => {
  try {
    console.log("req.body:", req.body); // Agregado para mostrar req.body
    const {
      nombre,
      tipo_de_box,
      banner,
      fecha_de_lanzamiento,
      cartas_ur,
      cartas_sr,
      cartas_r,
      cartas_n,
    } = req.body;

    const box = new Box({
      nombre,
      tipo_de_box,
      banner,
      fecha_de_lanzamiento,
      cartas_ur,
      cartas_sr,
      cartas_r,
      cartas_n,
    });

    await box.save();
    res.json(box);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// METODO DELETE
export const deleteBox = async (req, res) => {
  try {
    const box = await Box.findByIdAndDelete(req.params.id);

    if (!box) return res.status(404).json({ message: 'La caja no existe' });

    return res.json(box);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO GET UNA CAJA
export const getBox = async (req, res) => {
  try {
    const box = await Box.findById(req.params.id);

    if (!box) return res.status(404).json({ message: 'La caja no existe' });

    return res.json(box);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO UPDATE
export const updateBox = async (req, res) => {
  try {
    const { id } = req.params;
    const boxUpdate = await Box.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(boxUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO GET CAJAS POR ID DE CARTA
export const getCajasPorIdCarta = async (req, res) => {
  try {
    const cartaId = req.query._id;

    // Buscar cajas que contengan la carta con el ID especificado utilizando agregación
    const cajas = await Box.aggregate([
      {
        $match: {
          $or: [
            { 'cartas_ur._id': ObjectId(cartaId) },
            { 'cartas_sr._id': ObjectId(cartaId) },
            { 'cartas_r._id': ObjectId(cartaId) },
            { 'cartas_n._id': ObjectId(cartaId) }
          ]
        }
      }
    ]);

    if (!cajas || cajas.length === 0) {
      return res.status(404).json({ message: 'No se encontraron cajas con la carta especificada' });
    }

    return res.json(cajas);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
