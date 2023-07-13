import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import indexRoutes from './routes/index.routes.js';
import cartasRoutes from './routes/cards.routes.js';
import decksRoutes from './routes/decks.routes.js';
import cardsRouter from './routes/cardsen.routes.js';
import mazosRoutes from './routes/mazos.routes.js';
import boxesRoutes from './routes/boxes.routes.js';

const app = express();

app.use(cors()); // Permitir todos los orígenes

app.use(morgan('dev'));

app.use(express.json()); // Middleware para analizar el cuerpo de la solicitud como JSON

app.use(indexRoutes);
app.use(cartasRoutes);
app.use(decksRoutes);
app.use(cardsRouter);
app.use(mazosRoutes);
app.use(boxesRoutes)

app.use((req, res) => {
  res.status(404).send("Not Found");
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err); // Imprimir el error en la consola
  res.status(500).json({ error: 'Internal Server Error' }); // Responder con un mensaje de error genérico
});

export default app;
