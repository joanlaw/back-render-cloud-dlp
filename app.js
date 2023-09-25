import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import session from 'express-session';
import { Strategy as DiscordStrategy } from 'passport-discord';
import dotenv from 'dotenv';
import { authenticateJWT } from './middlewares/authMiddleware.js';


import User from './models/User.js';

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
import duelsRouter from './routes/duels.routes.js';
import clansRouter from './routes/clans.routes.js';  // Importa el nuevo router de clanes
import rushRouter from './routes/rush.route.js';


import { discordLogin } from './controllers/authController.js';  // Importa la función discordLogin

dotenv.config();

const app = express();

const allowedOrigins = [
  'https://duellinks.pro',
  'https://panel.duellinks.pro',
  'http://localhost:3000',
  // Agrega aquí más dominios permitidos
];

// Agrega el middleware de CORS
app.use(cors({
  origin: allowedOrigins,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));


app.use(morgan('dev'));

app.use(express.json({ limit: '3mb' })); // Establece el límite a 3MB

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  User.findOne({ discordId: jwtPayload.discordId })
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    })
    .catch(err => done(err, false));
}));
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: 'https://api.duellinks.pro/callback',
  scope: ['identify', 'guilds'],
}, (accessToken, refreshToken, profile, done) => {
  console.log('Estrategia de Discord llamada', profile);
  discordLogin(accessToken, refreshToken, profile, done);
}));


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
app.use(authRoutes); // Esto agregará las rutas de autenticación /
app.use(duelsRouter);
app.use(rushRouter);
app.use(authenticateJWT, clansRouter);


app.use((req, res) => {
  res.status(404).send("Not Found");
});

//Midleware 404 
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

//Midleware 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

export default app;