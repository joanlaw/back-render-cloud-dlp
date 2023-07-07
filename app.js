import express from 'express'
import morgan from 'morgan'
//import cors from 'cors'


import indexRoutes from './routes/index.routes.js'
import cartasRoutes from './routes/cards.routes.js'
import decksRoutes from './routes/decks.routes.js'
import cartasRoutes from './routes/cardsen.routes.js'
//import fileUpload from 'express-fileupload'

const app = express()
const cors = require('cors')


// Configurar cabeceras y cors
//app.use((req, res, next) => {
//  res.header('Access-Control-Allow-Origin', '*');
//  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//  next();
//});

const whitelist =  ['http://localhost:3000', 'https://duellinks.pro'];

app.use(cors({
  origin: whitelist
}))
app.use(morgan('dev'))
//app.use(fileUpload({
 //   useTempFiles : true,
//    tempFileDir : './uploads'
//}))
//app.use(express.json())
//df
app.use(indexRoutes)
app.use(cartasRoutes)

app.use(decksRoutes)
app.use(cartasRoutes)


app.use((req, res) => {
    res.status(404).send("Not Found");
  });

export default app