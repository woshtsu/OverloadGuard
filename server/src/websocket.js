import { Server } from 'socket.io';
import os from 'os-utils';

export function initWS({ server, sharedState }) {
  const T0 = 0.001 // Tiempo base de respuesta (segundos)
  const alpha = 0.01 // Factor de impacto de la tasa de llegada de peticiones
  const beta = 0.02 // Factor de impacto del consumo de CPU

  const io = new Server(server, {
    path: '/websocket/',
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('_Cliente conectado al WS')

    const intervalId = setInterval(() => {
      os.cpuUsage((cpu) => {
        const time = Math.floor(Date.now() / 1000) // Tiempo actual en segundos
        sharedState.cpuPercent = parseFloat((cpu * 100).toFixed(2)) // Actualizar el uso de CPU

        const averageResponseTime =
          sharedState.requestCount > 0
            ? sharedState.totalTime / sharedState.requestCount
            : 0

        socket.emit('cpu-stats', {
          time: time,
          value: sharedState.cpuPercent,
        })

        socket.emit('request-stats', {
          time: time,
          value: sharedState.requestCount,
        })

        socket.emit('response-stats', {
          time: time,
          value: averageResponseTime.toFixed(2),
        })

        // console.log(
        //   `CPU: ${sharedState.cpuPercent}%, Requests: ${sharedState.requestCount}, Avg Response Time: ${averageResponseTime.toFixed(2)} ms`
        // )

        sharedState.requestCount = 0
        sharedState.totalTime = 0
      });
    }, 1000)

    socket.on('disconnect', () => {
      clearInterval(intervalId)
      console.log('Cliente desconectado')
    })
  })

  return { alpha, beta, T0 }
}