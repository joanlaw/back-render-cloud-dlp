import express from 'express'
import morgan from 'morgan'
import cors from 'cors' // Importación correcta de cors

import indexRoutes from './routes/index.routes.js'
import cartasRoutes from './routes/cards.routes.js'
import decksRoutes from './routes/decks.routes.js'
import cardsRouter from './routes/cardsen.routes.js'

const app = express()

const whitelist = ['http://localhost:3000', 'https://duellinks.pro']

app.use(cors({
  origin: whitelist
}))
app.use(morgan('dev'))

app.use(indexRoutes)
app.use(cartasRoutes)
app.use(decksRoutes)
app.use(cardsRouter)

app.use((req, res) => {
  res.status(404).send("Not Found");
});

export default app
