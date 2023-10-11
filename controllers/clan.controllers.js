import Clan from '../models/Clan.js';
import User from '../models/User.js';
import uploadToImgbb from '../utils/imgbb.js';


// Crear un nuevo clan
export const createClan = async (req, res) => {
  console.log("Recibida solicitud para crear un clan");
  console.log("Cuerpo de la solicitud:", req.body);

  const { name, creator } = req.body;

  // Verifica que el _id exista en la base de datos de usuarios
  const user = await User.findById(creator);
  if (!user) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }
  if (user.hasCreatedClan) {
    return res.status(400).json({ message: "Este usuario ya ha creado un clan" });
  }

  let logoUrl;
  if (req.file) {
    // Validación del tipo de archivo
    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
      logoUrl = await uploadToImgbb(req.file.path);
    } else {
      return res.status(400).json({ message: 'Formato de imagen no soportado. Solo se aceptan JPEG y PNG.' });
    }
  }

  const newClan = new Clan({
    name,
    creator: user._id,
    logoUrl: logoUrl ? logoUrl.url : null
  });

  try {
    const savedClan = await newClan.save();
    user.hasCreatedClan = true;
    await user.save();
    res.status(201).json(savedClan);
  } catch (error) {
    console.error("Error al guardar el clan:", error.message);
    res.status(500).json({ message: error.message });
  }
};


// Obtener todos los clanes
// Obtener todos los clanes
export const getClans = async (req, res) => {
  try {
    console.log("Query params:", req.query); // Log para depuración

    let query = {};
    if (req.query.creator) {
      query.creator = req.query.creator;
    }
    const clans = await Clan.find(query);
    res.json(clans);
  } catch (error) {
    console.error("Error en getClans:", error.message); // Log para errores
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
    const clanToDelete = await Clan.findById(id);
    if (!clanToDelete) {
      return res.status(404).json({ message: 'Clan no encontrado' });
    }

    // Limpiamos la referencia de clanId para cada miembro del clan
    await User.updateMany({ _id: { $in: clanToDelete.members } }, { $set: { clanId: null } });

    // Revertir el flag hasCreatedClan del creador a false
    const creator = await User.findById(clanToDelete.creator);
    if (creator) {
      creator.hasCreatedClan = false;
      await creator.save();
    }

    // Finalmente, eliminamos el clan
    await Clan.findByIdAndDelete(id);

    res.json({ message: 'Clan eliminado' });
  } catch (error) {
    console.error('Error al eliminar el clan:', error);
    res.status(500).json({ message: error.message });
  }
};


// Añadir un miembro al clan
export const addMemberToClan = async (req, res) => {
  const { memberIds } = req.body;
  const { id: clanId } = req.params;

  if (!clanId || !memberIds || !Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ message: 'clanId y memberIds son requeridos' });
  }

  // Check if members already belong to a clan
  const membersToAdd = await User.find({ _id: { $in: memberIds }, clanId: null });
  if (membersToAdd.length !== memberIds.length) {
    return res.status(400).json({ message: "Algunos miembros ya pertenecen a un clan" });
  }

  try {
    const updatedClan = await Clan.findByIdAndUpdate(
      clanId,
      { $addToSet: { members: { $each: memberIds } } },
      { new: true }
    );
    
    if (!updatedClan) {
      return res.status(404).json({ message: 'Clan no encontrado' });
    }

    for (let user of membersToAdd) {
      user.clanId = clanId;
      await user.save();
    }

    return res.json(updatedClan);
  } catch (error) {
    console.error('Error adding members to clan:', error);
    return res.status(500).json({ message: error.message });
  }
};




// Eliminar un miembro del clan
export const removeMemberFromClan = async (req, res) => {
  const { id: clanId } = req.params;
  const { memberId } = req.body;

  if (!clanId || !memberId) {
    return res.status(400).json({ message: 'clanId y memberId son requeridos' });
  }

  try {
    const memberToRemove = await User.findById(memberId);
    if (!memberToRemove) {
      return res.status(404).json({ message: "Miembro no encontrado" });
    }
    memberToRemove.clanId = null;
    await memberToRemove.save();

    const updatedClan = await Clan.findByIdAndUpdate(
      clanId,
      { $pull: { members: memberId } },
      { new: true }
    );

    if (!updatedClan) {
      return res.status(404).json({ message: 'Clan no encontrado' });
    }

    res.json(updatedClan);
  } catch (error) {
    console.error('Error removing member from clan:', error);
    res.status(500).json({ message: error.message });
  }
};



// Obtener miembros de un clan por su ID de clan
export const getMembersByClanId = async (req, res) => {
  const { id } = req.params;
  try {
    const clan = await Clan.findById(id).populate('members'); // Populate para traer detalles de los miembros
    if (!clan) {
      return res.status(404).json({ message: 'Clan no encontrado' });
    }
    res.json(clan.members);  // Solo devolvemos la lista de miembros
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

