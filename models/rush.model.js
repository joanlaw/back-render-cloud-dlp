import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const RushSchema = new mongoose.Schema({
  konami_id: Number,
  name: {
    en: String,
    es: String,
    pt: String
  },
  requirement: {
    en: String,
    es: String,
    pt: String
  },
  effect: {
    en: String,
    es: String,
    pt: String
  },
  card_type: String,
  monster_type_line: String,
  attribute: String,
  level: Number,
  atk: Number,
  def: Number,
  property: String,
  series: [String],
  legend: Boolean,
  rareza: String,
  summoning_condition: {
    en: String,
    es: String,
    pt: String
  },
  effect_types: [String],
  maximum_atk: Number,
  image: {
    public_id: String,
    secure_url: String
  }
}, { timestamps: true, collection: 'rushes' });

RushSchema.plugin(mongoosePaginate);

export default mongoose.model('Rush', RushSchema);