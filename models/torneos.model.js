import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const torneoSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: Date,
    required: false
  },
  organizador: {
    type: String,
    required: false,
    trim: true
  },
  informacion_torneo: {
    type: String,
    required: false
  },
  formato_torneo: {
    type: String,
    required: false,
    trim: true
  },
  banner: {
    type: String,
    required: false
  },
  top1: {
    type: String,
    required: false,
  },
  top2: {
    type: String,
    required: false,
  },
  top4_1: {
    type: String,
    required: false,
  },
  top4_2: {
    type: String,
    required: false,
  },
  top8_1: {
    type: String,
    required: false,
  },
  top8_2: {
    type: String,
    required: false,
  },
  top8_3: {
    type: String,
    required: false,
  },
  top8_4: {
    type: String,
    required: false,
  },
  decks: [
    {
      nombre: {
        type: String,
        required: false
      },
      cantidad: {
        type: Number,
        required: false
      }
    }
  ]
  
});

// Aplicar el plugin de paginación al esquema
torneoSchema.plugin(mongoosePaginate);

export default mongoose.model('Torneo', torneoSchema);
