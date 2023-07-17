import mongoose from "mongoose";

const mazoSchema = mongoose.Schema(
  {
    jugador: {
      type: String,
      trim: true,
    },
    habilidad: {
      type: String,
      trim: true,
    },
    arquetipo: {
      type: String,
      trim: true,
    },
    arquetipo_image: {
      type: String,
      trim: true,
    },
    engine: {
      type: String,
      trim: true,
    },
    top: {
      type: String,
      trim: true,
    },
    puesto: {
      type: String,
      trim: true,
    },
    etiquetas: {
      type: String,
      trim: true,
    },
    mainDeck: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        nombre: {
          type: String,
          trim: true,
        },
        name_english: {
          type: String,
          trim: true,
        },
      },
    ],
    extraDeck: [
      {
        cardId: {
          type: String,
          trim: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
        nombre: {
          type: String,
          trim: true,
        },
        name_english: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Mazo", mazoSchema);
