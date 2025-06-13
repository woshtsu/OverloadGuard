import express, { json } from 'express'
import { DataJson } from '../utils/Data.js'
import { sharedState } from '../sharedState.js'
import fs from 'fs'
import { Parser } from 'json2csv'

export const routerServer = express.Router()

// Middleware para evitarnos los chunks
routerServer.use(json())
// Endpoints basicos
routerServer.get('/archivo1', (req, res) => {
  res.json(DataJson)
})

routerServer.get('/', (req, res) => {
  res.send('Hola desde el Servidor')
})

routerServer.get('/data', (req, res) => {
  res.json(sharedState.getaccumulatedData())
})

// Endpoint especial para el final de nuestro test
routerServer.get('/save-metrics', (req, res) => {
  try {
    const rpsData = sharedState.getRPS()
    const cpuData = sharedState.getCPUPercent()
    const responseTimes = sharedState.getaddaverageResponseTime()

    const registros = rpsData.map((d, i) => ({
      r: d,
      cpu: cpuData[i],
      T: responseTimes[i],
    }))

    const campos = ['r', 'cpu', 'T']
    const json2csv = new Parser({ fields: campos })
    const csv = json2csv.parse(registros)

    fs.writeFileSync('metrics.csv', csv)

    console.log('Datos guardados en metrics.csv')
    res.status(200).json({
      message: 'Datos guardados en metrics.csv',
      datos: csv,
    })
  } catch (error) {
    console.error('Error al guardar las métricas:', error)
    res.status(500).send('Error al guardar las métricas')
  }
})
