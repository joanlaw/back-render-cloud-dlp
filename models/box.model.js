import mongoose from "mongoose";

const boxSchema = mongoose.Schema(
  {
    nombre: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    tipo_de_box: {
      type: String,
      trim: true,
    },
    banner: {
      type: String,
      trim: true,
    },
    fecha_de_lanzamiento :{
        type: Date
    },
    cartas_ur: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    cartas_sr: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    cartas_r: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    cartas_n: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Box", boxSchema);
