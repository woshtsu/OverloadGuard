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
    const responseTimes = sharedState.getResponseTimes()

    const now = Date.now()

    const responseTimesPorSegundo = Array.from({ length: rpsData.length }, () => []) // creamos un array lleno de arrays de la longitud de rpsData

    for (const rt of responseTimes) {
      const segundosDesdeAhora = Math.floor((now - rt.time) / 1000) // obtenemos los segundos desde el momento de ejecutar el endpoint
      const index = rpsData.length - 1 - segundosDesdeAhora // obtenemos el indice del tiempo de respuesta respecto a cada rps (sincronizamos)

      if (index >= 0 && index < rpsData.length) { // Limitamos por rango de longitud de rspDATA
        responseTimesPorSegundo[index].push(rt.value) // llenamos nuestro Array con los valores filtrados
      }
    }

    const avgResponseTimesPorSegundo = responseTimesPorSegundo.map(group =>
      group.length > 0 ? group.reduce((a, b) => a + b, 0) / group.length : 0, // ternario para calcular promedios y evitar division entre 0
    )

    if (rpsData.length !== cpuData.length || rpsData.length !== avgResponseTimesPorSegundo.length) {
      throw new Error('Los arrays de datos no tienen la misma longitud después del procesamiento')
    }

    const datos = rpsData.map((r, i) => ({
      r,
      cpu: cpuData[i],
      T: avgResponseTimesPorSegundo[i],
    }))

    const campos = ['r', 'cpu', 'T']
    const json2csv = new Parser({ fields: campos })
    const csv = json2csv.parse(datos)

    fs.writeFileSync('metrics.csv', csv)

    console.log('Datos guardados en metrics.csv')
    res.status(200).send('Métricas guardadas exitosamente en metrics.csv')
  } catch (error) {
    console.error('Error al guardar las métricas:', error)
    res.status(500).send('Error al guardar las métricas')
  }
})
