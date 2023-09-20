import Clan from '../models/Clan.js';
import User from '../models/User.js';
import uploadToImgbb from '../utils/imgbb.js';

// Crear un nuevo clan
export const createClan = async (req, res) => {
  const { name, creatorId } = req.body;
  // Aquí deberías añadir validaciones adicionales, como comprobar si el usuario ya tiene un clan

  const newClan = new Clan({
    name,
    creator: creatorId,
  });

  try {
    const savedClan = await newClan.save();
    res.status(201).json(savedClan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todos los clanes
export const getClans = async (req, res) => {
  try {
    const clans = await Clan.find();
    res.json(clans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener un clan por su ID
export const getClanById = async (req, res) => {
  const { id } = req.params;
  try {
    const clan = await Clan.findById(id);
    if (!clan) {
      return res.status(404).json({ message: 'Clan no encontrado' });
    }
    res.json(clan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar un clan
export const updateClan = async (req, res) => {
  const { id } = req.params;
  const { name, logoUrl } = req.body;
  // Aquí deberías añadir validaciones adicionales

  try {
    const updatedClan = await Clan.findByIdAndUpdate(
      id,
      { name, logoUrl },
      { new: true }
    );
    res.json(updatedClan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un clan
export const deleteClan = async (req, res) => {
  const { id } = req.params;
  try {
    await Clan.findByIdAndDelete(id);
    res.json({ message: 'Clan eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Añadir un miembro al clan
export const addMemberToClan = async (req, res) => {
  const { clanId, memberId } = req.body;
  // Aquí deberías añadir validaciones adicionales

  try {
    const updatedClan = await Clan.findByIdAndUpdate(
      clanId,
      { $push: { members: memberId } },
      { new: true }
    );
    res.json(updatedClan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un miembro del clan
export const removeMemberFromClan = async (req, res) => {
  const { clanId, memberId } = req.body;
  try {
    const updatedClan = await Clan.findByIdAndUpdate(
      clanId,
      { $pull: { members: memberId } },
      { new: true }
    );
    res.json(updatedClan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Subir el logotipo del clan
export const uploadClanLogo = async (req, res) => {
    try {
      if (!req.files || !req.files.logo) {
        return res.status(400).json({ error: 'No se enviaron archivos' });
      }
  
      const { clanId } = req.params;
      const clan = await Clan.findById(clanId);
  
      if (!clan) {
        return res.status(404).json({ error: 'Clan no encontrado' });
      }
  
      const uploaded = await uploadToImgbb(req.files.logo[0].path);
  
      clan.logoUrl = uploaded.url;
      await clan.save();
  
      res.status(200).json({ message: 'Logotipo del clan actualizado con éxito', clan });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al subir el logotipo del clan.' });
    }
  };