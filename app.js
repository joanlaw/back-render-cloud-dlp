import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/index.routes.js';
import cartasRoutes from './routes/cards.routes.js';
import decksRoutes from './routes/decks.routes.js';
import cardsRouter from './routes/cardsen.routes.js';

const app = express();

// Middleware para manejar CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  next();
});

app.use(morgan('dev'));

app.use(indexRoutes);
app.use(cartasRoutes);
app.use(decksRoutes);
app.use(cardsRouter);

app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Imprimir el error en la consola
  res.status(500).json({ error: 'Internal Server Error' }); // Responder con un mensaje de error genérico
});

export default app;
