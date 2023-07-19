import mongoose from "mongoose";

const blogSchema = mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cuerpo_blog: {
      type: String,
      required: true,
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
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Blog", blogSchema);
