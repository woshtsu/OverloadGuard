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

// Ruta para guardar métricas en un archivo CSV
routerServer.get('/save-metrics', (req, res) => {
  try {
    const rpsData = sharedState.getRPS();
    const cpuData = sharedState.getCPUPercent();
    const responseTimeData = sharedState.getResponseTimes();

    // Asegurarse de que los arrays tengan la misma longitud
    const maxLength = Math.min(rpsData.length, cpuData.length, responseTimeData.length);

    const datos = [];
    for (let i = 0; i < maxLength; i++) {
      datos.push({
        r: rpsData[i],
        cpu: cpuData[i],
        T: responseTimeData[i],
      });
    }

    // Configurar el parser para generar el CSV
    const campos = ['r', 'cpu', 'T'];
    const json2csv = new Parser({ fields: campos });
    const csv = json2csv.parse(datos);

    // Guardar el archivo CSV
    fs.writeFileSync('metrics.csv', csv);

    console.log('Datos guardados en metrics.csv');
    res.status(200).send('Métricas guardadas exitosamente en metrics.csv');
  } catch (error) {
    console.error('Error al guardar las métricas:', error);
    res.status(500).send('Error al guardar las métricas');
  }
});
