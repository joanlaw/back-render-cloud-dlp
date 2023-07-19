import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const videoSchema = mongoose.Schema({
  titulo: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String
  },
  link_video: {
    type: String,
    trim: true
  },
  banner_video: {
    type: String,
    trim: true
  },
  deck: {
    type: String,
    trim: true
  },
  deckv2: {
    type: String,
    trim: true
  },
  deckv3: {
    type: String,
    trim: true
  },
  deckv4: {
    type: String,
    trim: true
  },
  deckv5: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Aplicar el plugin de paginación al esquema
videoSchema.plugin(mongoosePaginate);

export default mongoose.model('Video', videoSchema);
