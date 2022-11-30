import mongoose from "mongoose";

const deckSchema = mongoose.Schema(
  {
    jugador: {
      type: String,
      //  unique: true,
      // required: true,
      trim: true,
    },
    habilidad: {
      type: String,
      //  required: true,
      trim: true,
    },
    arquetipo: {
      type: String,
      // required: true,
      trim: true,
    },
    arquetipo_image: {
      type: String,
      // required: true,
      trim: true,
    },
    engine: {
      type: String,
      trim: true,
    },
    top: {
      type: String,
      //  required: true,
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
    mainuno: {
      type: String,
      trim: true,
    },
    maindos: {
      type: String,
      trim: true,
    },
    maintres: {
      type: String,
      trim: true,
    },
    maincuatro: {
      type: String,
      trim: true,
    },
    maincinco: {
      type: String,
      trim: true,
    },
    mainseis: {
      type: String,
      trim: true,
    },
    mainsiete: {
      type: String,
      trim: true,
    },
    mainocho: {
      type: String,
      trim: true,
    },
    mainnueve: {
      type: String,
      trim: true,
    },
    maindiez: {
      type: String,
      trim: true,
    },
    mainonce: {
      type: String,
      trim: true,
    },
    maindoce: {
      type: String,
      trim: true,
    },
    maintrece: {
      type: String,
      trim: true,
    },
    maincatorce: {
      type: String,
      trim: true,
    },
    mainquince: {
      type: String,
      trim: true,
    },
    maindieciseis: {
      type: String,
      trim: true,
    },
    maindiecisiete: {
      type: String,
      trim: true,
    },
    maindieciocho: {
      type: String,
      trim: true,
    },
    maindiecinueve: {
      type: String,
      trim: true,
    },
    mainveinte: {
      type: String,
      trim: true,
    },
    mainveintiuno: {
      type: String,
      trim: true,
    },
    mainveintidos: {
      type: String,
      trim: true,
    },
    mainveintitres: {
      type: String,
      trim: true,
    },
    mainveinticuatro: {
      type: String,
      trim: true,

    },
    mainveinticinco: {
      type: String,
      trim: true,
    },
    mainveintiseis: {
      type: String,
      trim: true,
    },
    mainveintisiete: {
      type: String,
      trim: true,
    },
    mainveintiocho: {
      type: String,
      trim: true,
    },
    mainveintinueve: {
      type: String,
      trim: true,
    },
    maintreinta: {
      type: String,
      trim: true,
    },
    extrauno: {
      type: String,
      trim: true,
    },
    extrados: {
      type: String,
      trim: true,
    },
    extratres: {
      type: String,
      trim: true,
    },
    extracuatro: {
      type: String,
      trim: true,
    },
    extracinco: {
      type: String,
      trim: true,
    },
    extraseis: {
      type: String,
      trim: true,
    },
    extrasiete: {
      type: String,
      trim: true,
    },
    extraocho: {
      type: String,
      trim: true,
    },
    extranueve: {
      type: String,
      trim: true,
    },
    extradiez: {
      type: String,
      trim: true,
    },
    sideino: {
      type: String,
      trim: true,
    },
    sidedos: {
      type: String,
      trim: true,
    },
    sidetres: {
      type: String,
      trim: true,
    },
    sidecuatro: {
      type: String,
      trim: true,
    },
    sidecinco: {
      type: String,
      trim: true,
    },
    sideseis: {
      type: String,
      trim: true,
    },
    sidesiete: {
      type: String,
      trim: true,
    },
    sideocho: {
      type: String,
      trim: true,
    },
    sidenueve: {
      type: String,
      trim: true,
    },
    sidediez: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Deck", deckSchema);
