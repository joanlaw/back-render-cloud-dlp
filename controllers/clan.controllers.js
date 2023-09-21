import Clan from '../models/Clan.js';
import User from '../models/User.js';
import uploadToImgbb from '../utils/imgbb.js';


// Crear un nuevo clan
export const createClan = async (req, res) => {
  console.log("Recibida solicitud para crear un clan");  // Log para saber si la función fue llamada
  console.log("Cuerpo de la solicitud:", req.body);  // Log para inspeccionar el cuerpo de la solicitud

  const { name, creator } = req.body;  // Aquí cambié "creatorId" a "creator" para coincidir con el cuerpo de la solicitud

  // Verifica que el _id exista en la base de datos de usuarios
  const user = await User.findById(creator);
  if (!user) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  let logoUrl;
  if (req.file) {
    // Validación del tipo de archivo
    if (req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/png') {
      logoUrl = await uploadToImgbb(req.file.path);  // uploadToImgbb devuelve una URL
    } else {
      return res.status(400).json({ message: 'Formato de imagen no soportado. Solo se aceptan JPEG y PNG.' });
    }
  }

  // Validaciones adicionales aquí
  const newClan = new Clan({
    name,
    creator: user._id,  // Asegurarse de que sea el _id
    logoUrl: logoUrl ? logoUrl.url : null  // Aquí se asigna la URL de la imagen
  });

  console.log("Nuevo objeto de clan:", newClan);  // Log para inspeccionar el nuevo objeto de clan
  console.log("Objeto newClan antes de guardar:", newClan); // Nuevo log para depuración

  try {
    const savedClan = await newClan.save();
    console.log("Clan guardado con éxito:", savedClan);  // Log para inspeccionar el clan guardado
    res.status(201).json(savedClan);
  } catch (error) {
    console.error("Error al guardar el clan:", error.message);  // Log para errores
    res.status(500).json({ message: error.message });
  }
};



// Obtener todos los clanes
export const getClans = async (req, res) => {
  try {
    let query = {};
    if (req.query.creator) {
      query.creator = req.query.creator;
    }
    const clans = await Clan.find(query);
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

