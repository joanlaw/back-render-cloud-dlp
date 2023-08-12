import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const leagueSchema = mongoose.Schema({
  league_name: {
    type: String,
    required: true,
    trim: true
  },
  league_format: {
    type: String,
    required: true,
    trim: true
  },
  start_date: {
    type: Date,
    required: true
  },
});

// Aplicar el plugin de paginación al esquema
leagueSchema.plugin(mongoosePaginate);

export default mongoose.model('League', leagueSchema);
