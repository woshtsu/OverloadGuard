import express, { json } from 'express';
import morgan from 'morgan';
import { DataJson } from '../utils/Data.js'

export const routerServer = express.Router();

routerServer.use(morgan('dev'))
routerServer.use(json())

routerServer.get('/archivo1', (req, res) => {
  res.json(DataJson)
})

routerServer.get('/', (req, res) => {
  res.send('Hola desde el Servidor');
});



