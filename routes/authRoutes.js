import express from 'express';
import passport from 'passport';
import { login, logout, callback, getUserImage, getUserInfo, updateUserPoints  } from '../controllers/authController.js';

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


router.post('/update-points', updateUserPoints);

router.get('/get-user-info',
  passport.authenticate('jwt', { session: false }),
  getUserInfo
);


export default router;
