import { Router } from 'express';
import {
  getRushes,
  createRush,
  //updateRush,
  //deleteRush,
  getRushById
} from '../controllers/rush.controller.js';
//import fileUpload from 'express-fileupload';

const router = Router();

router.get('/rushes', getRushes);
router.post('/rushes', createRush);
/*router.post('/rushes', fileUpload({
  useTempFiles: true, tempFileDir: './uploads'
}), createRush); */
//router.put('/rushes/:id', updateRush);
//router.delete('/rushes/:id', deleteRush);
router.get('/rushes/:id', getRushById);

export default router;