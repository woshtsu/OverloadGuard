let requests = [] // Almacena marcas de tiempo de las solicitudes
const responseTimes = [] // Almacena tiempos de respuesta de las solicitudes
let ginitTest = 0
let gfinalTest = 0
const windowSize = 10 // Tamaño de la ventana en segundos

export const sharedState = {
  inicioTest: () => {
    ginitTest = Date.now()
  },
  finalTest: () => {
    gfinalTest = Date.now()
  },
  getginitTest: () => ginitTest,
  getgfinalTest: () => gfinalTest,
  getRequestCount: () => requests.length,

  incrementRequestCount: () => {
    requests.push(Date.now()) // Registrar la marca de tiempo de la solicitud
  },

  calculateRPS: () => {
    // console.log('requests:', requests)
    const now = Date.now()
    const windowStart = now - windowSize * 1000 // Marca de tiempo del inicio de la ventana

    // Filtrar las solicitudes dentro de la ventana actual
    requests = requests.filter(timestamp => timestamp >= windowStart)
    // console.log('requests:', requests)
    // Calcular el RPS
    const elapsedSeconds = Math.max(windowSize, 0.0001)
    const rps = requests.length / elapsedSeconds
    // console.log('rps:', rps)
    return parseFloat(rps.toFixed(2))
  },
  calculateResponseTime: () => {
    // console.log(responseTimes)
    // Filter responses within window and group by second
    const groupedTimes = responseTimes.reduce((acc, time) => {
      const second = Math.floor(time / 1000) * 1000
      if (!acc[second]) {
        acc[second] = []
      }
      acc[second].push(time)
      return acc
    }, {})

    // Calculate average for each second
    const averagedTimes = Object.values(groupedTimes).map(times => {
      return times.reduce((sum, time) => sum + time, 0) / times.length
    })

    // Calculate total response time from the averaged values
    const totalResponseTime = averagedTimes.length > 0
      ? averagedTimes.reduce((sum, time) => sum + time, 0) / averagedTimes.length
      : 0

    return parseFloat(totalResponseTime.toFixed(2))
  },

  resetCount: () => {
    requests = []
  },

  accumulatedData: {
    rps: [], // Array lleno de flotantes ajustados en 2 decimales
    cpuPercent: [], // lo mismo que rps
    averageResponseTime: [],
  },

  addRPS: (rps) => {
    if (typeof rps === 'number' && !isNaN(rps)) {
      sharedState.accumulatedData.rps.push(parseFloat(rps.toFixed(2)))
    }
  },
  addCPUPercent: (cpuPercent) => {
    if (typeof cpuPercent === 'number' && !isNaN(cpuPercent)) {
      sharedState.accumulatedData.cpuPercent.push(parseFloat(cpuPercent.toFixed(2)))
    }
  },
  addResponseTime: (responseTime) => {
    if (typeof responseTime === 'number' && !isNaN(responseTime)) {
      responseTimes.push(responseTime)
    }
  },
  addaverageResponseTime: (averageResponseTime) => {
    if (typeof averageResponseTime === 'number' && !isNaN(averageResponseTime)) {
      sharedState.accumulatedData.averageResponseTime.push(parseFloat(averageResponseTime.toFixed(2)))
    }
  },

  getRPS: () => sharedState.accumulatedData.rps,
  getCPUPercent: () => sharedState.accumulatedData.cpuPercent,
  getaccumulatedData: () => sharedState.accumulatedData,
  getaddaverageResponseTime: () => sharedState.accumulatedData.averageResponseTime,
}
