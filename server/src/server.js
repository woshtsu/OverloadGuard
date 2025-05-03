import express from 'express'
import { createServer } from 'node:http'

import { routerServer } from './routes/routes.js'
import { initWS } from './websocket.js'

const app = express()
const server = createServer(app)

app.use((req, res, next) => {
  requestCount++

  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start
    totalTime += duration
  })

  next()
})

const initValues = initWS({ server: server })



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