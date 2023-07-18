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
  top3: {
    type: String,
    required: true,
    trim: true
  },
  top4: {
    type: String,
    required: true,
    trim: true
  }
});

// Aplicar el plugin de paginación al esquema
torneoSchema.plugin(mongoosePaginate);

export default mongoose.model('Torneo', torneoSchema);
