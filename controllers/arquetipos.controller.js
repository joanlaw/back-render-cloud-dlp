import Arquetipo from '../models/arquetipo.model.js';

// METODO GET con paginación y búsqueda por nombre
export const getArquetipos = async (req, res) => {
  const { page = 1, limit = 10, nombre_arquetipo = '' } = req.query;

  try {
    const query = nombre_arquetipo
      ? { nombre_arquetipo: { $regex: nombre_arquetipo, $options: 'i' } }
      : {};

    const arquetipos = await Arquetipo.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // obtener la cantidad total de documentos en la colección
    const count = await Arquetipo.countDocuments(query);

    res.json({
      arquetipos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO POST
export const createArquetipo = async (req, res) => {
  try {
    const { nombre_arquetipo, image_arquetipo } = req.body;

    const arquetipo = new Arquetipo({
      nombre_arquetipo,
      image_arquetipo
    });

    await arquetipo.save();
    res.json(arquetipo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE
export const deleteArquetipo = async (req, res) => {
  try {
    const arquetipo = await Arquetipo.findByIdAndDelete(req.params.id);

    if (!arquetipo) return res.status(404).json({ message: 'El arquetipo no existe' });

    return res.json(arquetipo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO GET UN ARQUETIPO
export const getArquetipo = async (req, res) => {
  try {
    const arquetipo = await Arquetipo.findById(req.params.id);

    if (!arquetipo) return res.status(404).json({ message: 'El arquetipo no existe' });

    return res.json(arquetipo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO UPDATE
export const updateArquetipo = async (req, res) => {
  try {
    const { id } = req.params;
    const arquetipoUpdate = await Arquetipo.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    return res.json(arquetipoUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
