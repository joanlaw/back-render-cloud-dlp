import express from 'express';
import { login, logout, callback, getUserImage } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', (req, res, next) => {
    console.log('Iniciando la autenticación'); // Verificar inicio de autenticación
    login(req, res, next);
  });
router.get('/logout', logout);
router.get('/callback', (req, res, next) => {
    console.log('Callback de autenticación', req.query); // Verificar datos del callback
    callback(req, res, next);
  });
router.get("/get-user-image", getUserImage);


export default router;
