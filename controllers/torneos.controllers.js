import Torneo from '../models/torneos.model.js';

// METODO GET
export const getTorneos = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const query = {
      $or: [
        { nombre: { $regex: search, $options: 'i' } },
        { organizador: { $regex: search, $options: 'i' } }
      ]
    };

    const torneos = await Torneo.paginate(query, options);
    res.send(torneos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO POST
export const createTorneo = async (req, res) => {
  try {
    const { nombre, fecha, organizador, informacion_torneo, formato_torneo, banner, top1, top2, top3, top4 } = req.body;

    const torneo = new Torneo({
      nombre,
      fecha,
      organizador,
      informacion_torneo,
      formato_torneo,
      banner,
      top1,
      top2,
      top3,
      top4
    });

    await torneo.save();
    res.json(torneo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE
export const deleteTorneo = async (req, res) => {
  try {
    const torneo = await Torneo.findByIdAndDelete(req.params.id);

    if (!torneo) {
      return res.status(404).json({ message: 'El torneo no existe' });
    }

    return res.json(torneo);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
