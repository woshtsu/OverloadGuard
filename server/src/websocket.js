import osUtils from 'os-utils';
import { sharedState } from './sharedState.js';

export function initWS ({ websocketserver }) {
  const testNS = websocketserver.of('/test');
  const monitorNs = websocketserver.of('/monitor');

  function getCPUPercent () {
    return new Promise((resolve) => {
      osUtils.cpuUsage((cpuPercent) => {
        resolve(parseFloat((cpuPercent * 100).toFixed(2)));
      });
    });
  }

  monitorNs.on('connection', socket => {
    console.log(`Cliente conectado a monitor con ID: ${socket.id}`);

    const intervalId = setInterval(async () => {
      const rps = sharedState.calculateRPS(); // Calcular el RPS
      const time = Math.floor(Date.now() / 1000);
      const cpuPercent = await getCPUPercent();

      // Emitir datos al cliente conectado a /monitor
      socket.emit('cpu-stats', {
        time,
        value: cpuPercent,
      });

      socket.emit('request-stats', {
        time,
        value: rps,
      });

      // Almacenar los datos en sharedState
      sharedState.addAccumulatedData(rps, cpuPercent, null);
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Cliente desconectado de monitor');
    });
  });

  testNS.on('connection', socket => {
    console.log(`Cliente conectado a test con ID: ${socket.id}`);

    const intervalId = setInterval(async () => {
      const rps = sharedState.calculateRPS(); // Calcular el RPS
      const time = Math.floor(Date.now() / 1000);
      const cpuPercent = await getCPUPercent();

      // Almacenar los datos en sharedState
      sharedState.addRPS(rps);
      sharedState.addCPUPercent(cpuPercent);

      // Emitir datos al cliente
      socket.emit('test-rps', { time, value: rps });
      socket.emit('test-cpu', { time, value: cpuPercent });

      const responseTimes = sharedState.getResponseTimes();
      const lastResponseTime = responseTimes.length > 0 ? responseTimes[responseTimes.length - 1] : 0;

      socket.emit('test-response-time', { time, value: lastResponseTime });
    }, 1000);

    socket.on('disconnect', () => {
      clearInterval(intervalId);
      console.log('Cliente desconectado de test');

      // Obtener los datos acumulados
      const rpsData = sharedState.getRPS();
      const cpuData = sharedState.getCPUPercent();
      const responseTimeData = sharedState.getResponseTimes();

      console.log('Datos acumulados:', {
        rps: rpsData,
        cpuPercent: cpuData,
        responseTimes: responseTimeData,
      });
    });
  });
}
