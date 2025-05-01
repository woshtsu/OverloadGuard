import express from 'express'
import { createServer } from 'node:http'

import { routerServer } from './routes/routes.js'
import { initWS } from './websocket.js'

const app = express()
const server = createServer(app)

const sharedState = {
  requestCount: 0,
  cpuPercent: 0,
  totalTime: 0,
}

const initValues = initWS({ server: server, sharedState })
let alpha = initValues.alpha
let beta = initValues.beta
let T0 = initValues.T0

// Middleware para contar solicitudes
app.use((req, res, next) => {
  sharedState.requestCount++

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start
    sharedState.totalTime += duration
  })

  next()
})

// Resto del código...

// app.use(statusMonitor()) 
// app.use(logger('dev'))
app.use('/server', routerServer)

app.get('/', (req, res) => {
  res.send('La ruta principal')
})


const desiredPort = process.env.PORT ?? 1234
server.listen(desiredPort, () => {
  console.log(`Servidor escuchando en http://localhost:${desiredPort}`)
})