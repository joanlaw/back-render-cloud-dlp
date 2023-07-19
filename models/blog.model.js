import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const blogSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      trim: true,
    },
    cuerpo_blog: {
      type: String,
      required: true,
      trim: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
    imagen_destacada: {
      type: String,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.plugin(mongoosePaginate);

export default mongoose.model('Blog', blogSchema);
