import { Router } from 'express';
import {
  getRushes,
  createRush,
  updateRush,
  deleteRush,
  //getRushById,
  getRushByValue
  //getRushByParams
} from '../controllers/rush.controller.js';
//import fileUpload from 'express-fileupload';

const router = Router();

import fileUpload from 'express-fileupload'

router.get('/rushes', getRushes);
//router.get('/rushes', getRushByParams);
router.post('/rushes', createRush);
/*router.post('/rushes', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createRush); */
router.put('/rushes/:id', fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}), updateRush);
router.delete('/rushes/:id', deleteRush);
//router.get('/rushes/:id', getRushById);
router.get('/rushes/:value', getRushByValue);

export default router;