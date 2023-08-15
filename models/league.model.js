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
  enlace_torneo: String,
  image_torneo: String,
  infoTorneo: [
    {
      format: String,
      banlist: String,
      deck_info: String,
      eliminacion: String
    }
  ]
});

// Aplicar el plugin de paginación al esquema
leagueSchema.plugin(mongoosePaginate);

const League = mongoose.model('League', leagueSchema);

export default League;
