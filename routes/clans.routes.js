import {
    createClan,
    getClans,
    getClanById,
    updateClan,
    deleteClan,
    addMemberToClan,
    removeMemberFromClan,
    uploadClanLogo
  } from '../controllers/clan.controllers.js';
import { Router } from 'express';
import multer from 'multer';


const clansRouter = Router();

// Configuración de multer para la subida de imágenes
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // Nombre único para el archivo
  }
});
const upload = multer({ storage: storage });

// Definir rutas aquí
clansRouter.post('/clans', createClan);
clansRouter.get('/clans', getClans);
clansRouter.get('/clans/:id', getClanById);
clansRouter.put('/clans/:id', updateClan);
clansRouter.delete('/clans/:id', deleteClan);
clansRouter.post('/clans/:id/members', addMemberToClan);
clansRouter.delete('/clans/:id/members', removeMemberFromClan);
clansRouter.post('/clans/:clanId/logo', upload.single('logo'), uploadClanLogo);

export default clansRouter;

