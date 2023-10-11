import express from 'express';
import passport from 'passport';
import { login, logout, callback, getUserImage, getUserInfo, updateUserPoints, getUserBasicInfo, updateUserIdDL  } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log('Iniciando la autenticación'); // Verificar inicio de autenticación
    login(req, res, next);
  });
router.get('/logout', logout);
router.get('/callback',
  passport.authenticate('discord', { failureRedirect: '/login' }), // Aquí usamos la estrategia 'discord'
  callback
);
router.get("/get-user-image", getUserImage);
// Ruta para obtener información del usuario autenticado

router.get('/users', getUserBasicInfo);


router.post('/update-points', updateUserPoints);

router.get('/get-user-info',
  passport.authenticate('jwt', { session: false }),
  getUserInfo
);

router.post('/update-id-dl', updateUserIdDL);

export const updateUserIdDL = (req, res) => {
  const { discordId, ID_DL } = req.body;

  // Puedes añadir una validación para asegurarte de que el ID_DL tenga el formato correcto

  User.findOneAndUpdate({ discordId: discordId }, { ID_DL: ID_DL }, { new: true })
    .then(updatedUser => {
      res.json({
        success: true,
        message: 'ID_DL actualizado exitosamente',
        updatedUser,
      });
    })
    .catch(err => {
      console.error('Error actualizando el ID_DL del usuario', err);
      res.status(500).json({
        success: false,
        message: 'Error actualizando el ID_DL del usuario',
      });
    });
};


export default router;
