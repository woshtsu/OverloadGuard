import { Server } from 'socket.io';
import osUtils from 'os-utils';

export function initWS({ server }) {

  const varTest = {
    "r": [],
    "cpu": [],
    "T": []
  }

  const io = new Server(server, {
    path: '/websocket/',
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
    },
  })

  const testNS = io.of('/test')
  const monitorNs = io.of('/monitor')

  function getCPUPercent() {
    return new Promise((resolve) => {
      osUtils.cpuUsage((cpuPercent) => {
        resolve(parseFloat((cpuPercent * 100).toFixed(2)))
      })
    })
  }

  monitorNs.on('connection', socket => {
    console.log(`cliente conectado a monitor con ID: ${socket.id}`)

    const intervalId = setInterval(async () => {
      const requestCount = 0
      const totalTime = 0

      const time = Math.floor(Date.now() / 1000)
      const cpuPercent = await getCPUPercent()

      socket.emit('cpu-stats', {
        time: time,
        value: cpuPercent
      })

      socket.emit('request-stats', {
        time: time,
        value: 1
      })

      console.log(`el tiempo: ${time} y cpu: ${cpuPercent}`)

    }, 1000)

    socket.on('disconnect', () => {
      clearInterval(intervalId)
      console.log('Cliente desconectado')
    })
  })

  testNS.on('connection', socket => {
    console.log(`cliente conectado a test con ID: ${socket.id}`)

  })


  /**/

  // io.on('connection', (socket) => {
  //   console.log('_Cliente conectado al WS')

  //   const intervalId = setInterval(() => {
  //     os.cpuUsage((cpu) => {
  //       const time = Math.floor(Date.now() / 1000) // Tiempo actual en segundos
  //       sharedState.cpuPercent = parseFloat((cpu * 100).toFixed(2)) // Actualizar el uso de CPU

  //       const averageResponseTime =
  //         sharedState.requestCount > 0
  //           ? sharedState.totalTime / sharedState.requestCount
  //           : 0

  //       socket.emit('cpu-stats', {
  //         time: time,
  //         value: sharedState.cpuPercent,
  //       })

  //       socket.emit('request-stats', {
  //         time: time,
  //         value: sharedState.requestCount,
  //       })

  //       socket.emit('response-stats', {
  //         time: time,
  //         value: averageResponseTime.toFixed(2),
  //       })

  //       // console.log(
  //       //   `CPU: ${sharedState.cpuPercent}%, Requests: ${sharedState.requestCount}, Avg Response Time: ${averageResponseTime.toFixed(2)} ms`
  //       // )

  //       sharedState.requestCount = 0
  //       sharedState.totalTime = 0
  //     });
  //   }, 1000)

  //   socket.on('disconnect', () => {
  //     clearInterval(intervalId)
  //     console.log('Cliente desconectado')
  //   })
  // })

  return 0
}