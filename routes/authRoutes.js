import express from 'express';
import { login, logout, callback } from '../controllers/authController';

const router = express.Router();

router.get('/login', login);
router.get('/logout', logout);
router.get('/callback', login, callback);

export default router;
