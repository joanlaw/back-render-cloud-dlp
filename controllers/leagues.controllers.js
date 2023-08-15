import League from '../models/league.model.js';

// METODO GET
export const getLeagues = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const query = {
      league_name: { $regex: search, $options: 'i' }
    };

    const leagues = await League.paginate(query, options);
    res.send(leagues);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO POST
export const createLeague = async (req, res) => {
  try {
    const { league_name, league_format, start_date, enlace_torneo, image_torneo, infoTorneo } = req.body;

    const league = new League({
      league_name,
      league_format,
      start_date: new Date(start_date),
      enlace_torneo,
      image_torneo,
      infoTorneo
    });

    await league.save();
    res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO PUT
export const updateLeague = async (req, res) => {
  try {
    const { league_name, league_format, start_date, enlace_torneo, image_torneo, infoTorneo } = req.body;

    let league = await League.findById(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'La liga no existe' });
    }

    if (league_name) league.league_name = league_name;
    if (league_format) league.league_format = league_format;
    if (start_date) league.start_date = start_date;
    if (enlace_torneo) league.enlace_torneo = enlace_torneo;
    if (image_torneo) league.image_torneo = image_torneo;
    if (infoTorneo) league.infoTorneo = infoTorneo;

    await league.save();

    res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// METODO DELETE
export const deleteLeague = async (req, res) => {
  try {
    const league = await League.findByIdAndDelete(req.params.id);

    if (!league) {
      return res.status(404).json({ message: 'La liga no existe' });
    }

    return res.json(league);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
