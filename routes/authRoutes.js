import express from 'express';
import passport from 'passport';
import { login, logout, callback, getUserImage } from '../controllers/authController.js';

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


export default router;
