import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';

import indexRoutes from './routes/index.routes.js';
import cartasRoutes from './routes/cards.routes.js';
import decksRoutes from './routes/decks.routes.js';
import cardsRouter from './routes/cardsen.routes.js';
import mazosRoutes from './routes/mazos.routes.js';
import boxesRoutes from './routes/boxes.routes.js';
import videosRouter from './routes/videos.routes.js';
import torneosRouter from './routes/torneos.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import arquetiposRoutes from './routes/arquetipos.routes.js';
import leaguesRouter from './routes/leagues.routes.js';
import authRoutes from './routes/authRoutes.js';

import User from './models/User.js'; // Asegúrate de que esta importación sea correcta

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

// Configuración de serialización y deserialización de usuario
passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user);
  } catch (error) {
      done(error, null);
  }
});

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: 'https://duellinks.pro/auth/discord/callback',
  scope: ['identify', 'guilds'],
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await User.findOne({ discordId: profile.id });

    if (user) {
      console.log('Usuario existente encontrado', user);
      return done(null, user);
    }

    const newUser = new User({
      discordId: profile.id,
      username: profile.username,
      avatar: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
    });

    const savedUser = await newUser.save();
    console.log('Usuario guardado', savedUser);
    done(null, savedUser);
  } catch (error) {
    console.error('Error en la autenticación de Discord', error);
    done(error, null); // Cambia esto para proporcionar null como segundo argumento
  }
}));

app.use(authRoutes); // Esto agregará las rutas de autenticación /
app.use(indexRoutes);
app.use(cartasRoutes);
app.use(decksRoutes);
app.use(cardsRouter);
app.use(mazosRoutes);
app.use(boxesRoutes);
app.use(videosRouter);
app.use(torneosRouter);
app.use(blogsRoutes);
app.use(arquetiposRoutes);
app.use(leaguesRouter);


app.use((req, res) => {
  res.status(404).send("Not Found");
});

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;