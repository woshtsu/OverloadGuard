let requests = [] // Almacena marcas de tiempo de las solicitudes
const windowSize = 10 // Tamaño de la ventana en segundos

export const sharedState = {
  getRequestCount: () => requests.length,

  incrementRequestCount: () => {
    requests.push(Date.now()) // Registrar la marca de tiempo de la solicitud
  },

  calculateRPS: () => {
    const now = Date.now()
    const windowStart = now - windowSize * 1000 // Marca de tiempo del inicio de la ventana

    // Filtrar las solicitudes dentro de la ventana actual
    requests = requests.filter(timestamp => timestamp >= windowStart)

    // Calcular el RPS
    const elapsedSeconds = Math.max(windowSize, 0.0001)
    const rps = requests.length / elapsedSeconds

    return parseFloat(rps.toFixed(2))
  },

  resetCount: () => {
    requests = []
  },

  accumulatedData: {
    rps: [], // Array lleno de flotantes ajustados en 2 decimales
    cpuPercent: [], // lo mismo que rps
    responseTimes: [], // Los datos dentro son objetos de tpo {time,value} esto sirve para calcular el segundo
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
  addResponseTime: (responseTime, timestamp = Date.now()) => {
    if (typeof responseTime === 'number' && !isNaN(responseTime)) {
      sharedState.accumulatedData.responseTimes.push({
        time: timestamp,
        value: responseTime,
      })
    }
  },

  getRPS: () => sharedState.accumulatedData.rps,
  getCPUPercent: () => sharedState.accumulatedData.cpuPercent,
  getResponseTimes: () => sharedState.accumulatedData.responseTimes,
  getaccumulatedData: () => sharedState.accumulatedData,
}
