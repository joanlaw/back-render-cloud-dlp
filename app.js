import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import passport from 'passport';
import session from 'express-session';
import { Strategy as DiscordStrategy } from 'passport-discord'; // Estrategia correcta para Discord
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
import authController from './controllers/authController.js'

dotenv.config();

const app = express();

app.use(cors()); // Permitir todos los orígenes

app.use(morgan('dev'));

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: 'http://tu-dominio.com/auth/discord/callback',
  scope: ['identify', 'guilds'],
}, authController.discordLogin)); // Utilizar tu función de inicio de sesión

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

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
app.use(authRoutes); // Agregar las rutas de autenticación

app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error); // Pasa el error al siguiente middleware
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Imprimir el error en la consola
  res.status(500).json({ error: 'Internal Server Error' }); // Responder con un mensaje de error genérico
});

export default app;
