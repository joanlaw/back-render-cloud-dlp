import express from 'express';
import { login, logout, callback, getUserImage } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', login);
router.get('/logout', logout);
router.get('/callback', callback);
router.get("/get-user-image", getUserImage);


export default router;
