import { Router } from 'express';
import {
  getVideos,
  createVideo,
  updateVideo,
  deleteVideo,
  getVideo
} from '../controllers/videos.controllers.js';

const videosRouter = Router();

import fileUpload from 'express-fileupload';

videosRouter.get('/videos', getVideos);
videosRouter.post('/videos', fileUpload({
  useTempFiles: true,
  tempFileDir: './uploads'
}), createVideo);
videosRouter.put('/videos/:id', updateVideo);
videosRouter.delete('/videos/:id', deleteVideo);
videosRouter.get('/videos/:id', getVideo);

export default videosRouter;
