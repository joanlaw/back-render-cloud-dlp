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
    required: true
  },
  organizador: {
    type: String,
    required: true,
    trim: true
  },
  informacion_torneo: {
    type: String,
    required: true
  },
  formato_torneo: {
    type: String,
    required: true,
    trim: true
  },
  banner: {
    type: String,
    required: true
  },
  top1: {
    type: String,
    required: true,
    trim: true
  },
  top2: {
    type: String,
    required: true,
    trim: true
  },
  top4_1: {
    type: String,
    required: true,
    trim: true
  },
  top4_2: {
    type: String,
    required: true,
    trim: true
  },
  top8_1: {
    type: String,
    required: true,
    trim: true
  },
  top8_2: {
    type: String,
    required: true,
    trim: true
  },
  top8_3: {
    type: String,
    required: true,
    trim: true
  },
  top8_4: {
    type: String,
    required: true,
    trim: true
  },
  decks: [
    {
      nombre: {
        type: String,
        required: true
      },
      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
  
});

// Aplicar el plugin de paginación al esquema
torneoSchema.plugin(mongoosePaginate);

export default mongoose.model('Torneo', torneoSchema);
