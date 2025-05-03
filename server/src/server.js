import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

import { routerServer } from './routes/routes.js';
import { initWS } from './websocket.js';
import { sharedState } from './sharedState.js';
import morgan from 'morgan';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  path: '/websocket/',
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

initWS({ websocketserver: io });

// Crear un stream personalizado para capturar los logs de Morgan
const morganStream = {
  write: (message) => {
    console.log('LOG DE MORGAN:', message)
    const match = message.match(/- (\d+\.\d*) ms/);

    if (match) {
      const responseTime = parseFloat(match[1]);

      sharedState.addResponseTime(responseTime, Date.now())
    }
  },
};

// Configurar Morgan con el stream personalizado
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: morganStream,
  })
);

// Middleware para incrementar el contador de solicitudes
app.use((req, res, next) => {
  sharedState.incrementRequestCount();
  console.log("se incremento el requestCount");

  next();
});

// app.use(statusMonitor());
// app.use(logger('dev'))
app.use('/server', routerServer);

app.get('/', (req, res) => {
  res.send('La ruta principal');
});

const desiredPort = process.env.PORT ?? 1234;
server.listen(desiredPort, () => {
  console.log(`Servidor escuchando en http://localhost:${desiredPort}`);
});
