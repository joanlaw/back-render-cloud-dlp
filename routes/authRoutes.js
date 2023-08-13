// authRoutes.js
import express from 'express';
import { login, logout, callback, getUserImage } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', (req, res, next) => {
  console.log('Iniciando la autenticación');
  login(req, res, next);
});

router.get('/logout', logout);
router.get('/callback', async (req, res, next) => {
  try {
    // Aquí debes manejar la lógica de autenticación y almacenamiento en la base de datos
    // Puedes acceder a los datos de autenticación desde req.query u otros objetos según la librería que uses

    // Ejemplo: guardar el usuario en la base de datos
    const newUser = new User({
      discordId: profile.id,
      username: profile.username,
      avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
    });

    const savedUser = await newUser.save();
    console.log('Usuario guardado', savedUser);

    res.redirect('/'); // Redirige al usuario después de la autenticación
  } catch (error) {
    console.error('Error en la autenticación de Discord', error);
    next(error); // Manejo de errores
  }
});

router.get("/get-user-image", getUserImage);

export default router; // Asegúrate de exportar el router