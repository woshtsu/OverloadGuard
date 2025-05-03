import express, { json } from 'express';
import { DataJson } from '../utils/Data.js';
import { sharedState } from '../sharedState.js';
import fs from 'fs';
import { Parser } from 'json2csv';

export const routerServer = express.Router();

routerServer.use(json());

routerServer.get('/archivo1', (req, res) => {
  res.json(DataJson);
});

routerServer.get('/', (req, res) => {
  res.send('Hola desde el Servidor');
});

routerServer.get('/data', (req, res) => {
  res.json(sharedState.getaccumulatedData());
});

// Ruta para guardar métricas en un archivo CSV
routerServer.get('/save-metrics', (req, res) => {
  try {
    const rpsData = sharedState.getRPS();
    const cpuData = sharedState.getCPUPercent();
    const responseTimes = sharedState.getResponseTimes(); // Array de { time, value }

    // 1. Calcular el inicio de cada segundo relativo al primer RPS
    const now = Date.now();

    // 2. Crear array de arrays para agrupar responseTimes por segundo
    const responseTimesPorSegundo = Array.from({ length: rpsData.length }, () => []);

    // 3. Asignar cada responseTime al segundo correspondiente
    for (const rt of responseTimes) {
      const segundosDesdeAhora = Math.floor((now - rt.time) / 1000);
      const index = rpsData.length - 1 - segundosDesdeAhora;

      if (index >= 0 && index < rpsData.length) {
        responseTimesPorSegundo[index].push(rt.value);
      }
    }

    // 4. Calcular promedios por segundo
    const avgResponseTimesPorSegundo = responseTimesPorSegundo.map(group =>
      group.length > 0 ? group.reduce((a, b) => a + b, 0) / group.length : 0,
    );

    // 5. Validar longitudes
    if (rpsData.length !== cpuData.length || rpsData.length !== avgResponseTimesPorSegundo.length) {
      throw new Error('Los arrays de datos no tienen la misma longitud después del procesamiento');
    }

    // 6. Preparar datos para CSV
    const datos = rpsData.map((r, i) => ({
      r,
      cpu: cpuData[i],
      T: avgResponseTimesPorSegundo[i],
    }));

    // 7. Generar CSV
    const campos = ['r', 'cpu', 'T'];
    const json2csv = new Parser({ fields: campos });
    const csv = json2csv.parse(datos);

    fs.writeFileSync('metrics.csv', csv);

    console.log('Datos guardados en metrics.csv');
    res.status(200).send('Métricas guardadas exitosamente en metrics.csv');
  } catch (error) {
    console.error('Error al guardar las métricas:', error);
    res.status(500).send('Error al guardar las métricas');
  }
});
