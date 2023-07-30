// models/arquetipo.model.js
import mongoose from 'mongoose';

const arquetipoSchema = mongoose.Schema(
  {
    nombre_arquetipo: {
      type: String,
      trim: true,
    },
    image_arquetipo: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Arquetipo', arquetipoSchema);
