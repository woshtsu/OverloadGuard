let requests = []; // Almacena marcas de tiempo de las solicitudes
const windowSize = 10; // Tamaño de la ventana en segundos

export const sharedState = {
  getRequestCount: () => requests.length,

  incrementRequestCount: () => {
    requests.push(Date.now()); // Registrar la marca de tiempo de la solicitud
  },

  calculateRPS: () => {
    const now = Date.now();
    const windowStart = now - windowSize * 1000; // Marca de tiempo del inicio de la ventana

    // Filtrar las solicitudes dentro de la ventana actual
    requests = requests.filter(timestamp => timestamp >= windowStart);

    // Calcular el RPS
    const elapsedSeconds = Math.max(windowSize, 0.0001);
    const rps = requests.length / elapsedSeconds;

    return parseFloat(rps.toFixed(2));
  },

  resetCount: () => {
    requests = []; // Reiniciar completamente el historial si es necesario
  },

  // Arrays para almacenar datos acumulados
  accumulatedData: {
    rps: [],
    cpuPercent: [],
    responseTimes: [],
  },

  // Métodos para añadir datos específicos
  addRPS: (rps) => {
    if (typeof rps === 'number' && !isNaN(rps)) {
      sharedState.accumulatedData.rps.push(parseFloat(rps.toFixed(2)));
    }
  },

  addCPUPercent: (cpuPercent) => {
    if (typeof cpuPercent === 'number' && !isNaN(cpuPercent)) {
      sharedState.accumulatedData.cpuPercent.push(parseFloat(cpuPercent.toFixed(2)));
    }
  },

  addResponseTime: (responseTime) => {
    if (typeof responseTime === 'number' && !isNaN(responseTime)) {
      sharedState.accumulatedData.responseTimes.push(parseFloat(responseTime.toFixed(2)));
    }
  },

  // Métodos para obtener datos específicos
  getRPS: () => sharedState.accumulatedData.rps,

  getCPUPercent: () => sharedState.accumulatedData.cpuPercent,

  getResponseTimes: () => sharedState.accumulatedData.responseTimes,
};
