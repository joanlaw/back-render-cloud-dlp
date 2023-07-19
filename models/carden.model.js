import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2';


const cardSchema = mongoose.Schema({
  nombre: {
    type: String,
    //unique: true,
    trim: true
  },
  name_english: {
    type: String,
   // unique: true,
    trim: true
  },
  tipo_de_carta: {
    type: String,
    trim: true
  },
  atributo: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    trim: true
  },
  tipo_magica_trampa: {
    type: String,
    trim: true
  },
  nivel_rango_link: {
    type: Number,
    trim: true
  },
  escala: {
    type: Number,
    trim: true
  },
  rareza: {
    type: String,
    trim: true
  },
  limitacion: {
    type: Number,
    trim: true
  },
  image: {
    pubic_id: String,
    secure_url: {
      type: String
    }
  },
  atk: {
    type: Number,
    trim: true
  },
  def: {
    type: Number,
    trim: true
  },
  materiales: {
    type: String,
    trim: true
  },
  descripcion: {
    type: String
  },
  efecto_pendulo: {
    type: String,
    trim: true
  },
  link_deck: {
    type: String,
    trim: true
  },
  adicional: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
})

// Aplicar el plugin de paginación al esquema
cardSchema.plugin(mongoosePaginate);

export default mongoose.model('Card', cardSchema)
