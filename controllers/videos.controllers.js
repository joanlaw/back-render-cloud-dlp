import Video from '../models/videos.model.js';
import mongoose from 'mongoose';

//METODO GET
export const getVideos = async (req, res) => {
  try {
    const { page = 1, size = 50, search = '' } = req.query;

    const options = {
      page: parseInt(page, 10),
      limit: parseInt(size, 10)
    };

    const query = {
      $or: [
        { titulo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ]
    };

    const videos = await Video.paginate(query, options);
    res.send(videos);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO POST
export const createVideo = async (req, res) => {
  try {
    const { titulo, descripcion, link_video, banner_video, deck, deckv2, deckv3, deckv4, deckv5 } = req.body;

    const video = new Video({
      titulo,
      descripcion,
      link_video,
      banner_video,
      deck,
      deckv2,
      deckv3,
      deckv4,
      deckv5
    });

    await video.save();
    res.json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO DELETE
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
      return res.status(404).json({ message: 'El video no existe' });
    }

    return res.json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO GET UN VIDEO
export const getVideo = async (req, res) => {
  try {
    const { id } = req.params;

    let video;
    if (mongoose.Types.ObjectId.isValid(id)) {
      video = await Video.findById(id);
    } else {
      video = await Video.findOne({ 
        $or: [
          { titulo: id },
          { descripcion: id }
        ] 
      });
    }

    if (!video) {
      return res.status(404).json({ message: 'El video no existe' });
    }

    return res.json(video);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//METODO UPDATE
export const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const videoUpdate = await Video.findByIdAndUpdate(id, req.body, {
      new: true
    });

    return res.json(videoUpdate);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
