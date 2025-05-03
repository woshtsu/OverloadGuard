import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { ShowModel } from "../components/ShowModel.jsx";
import { TestChart } from "../components/TestChart.jsx";

export function TestPage() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Crear la conexión de WebSocket
    const testSocket = io('http://localhost:1234/test', { path: '/websocket/' });
    console.log('Conexión creada:', testSocket.id)
    // Guardar la conexión en el estado
    setSocket(testSocket);

    // Manejar la desconexión cuando el componente se desmonta
    return () => {
      testSocket.disconnect();
      console.log('Desconectado del namespace /test')
      console.log('Desconexión realizada:', testSocket.id)
    };
  }, []);

  if (!socket) {
    return <div>Cargando...</div>;
  }

  return (
    <section>
      <h1>Al cerrar el test termina el ajuste AJUSTANDO....</h1>
      <ShowModel />
      <TestChart title={'Peticiones por segundo'} event={'test-rps'} socket={socket} />
      <TestChart title={'Porcentaje de CPU'} event={'test-cpu'} socket={socket} />
      <TestChart title={'Tiempos de respuesta'} event={'test-response-time'} socket={socket} />
    </section>
  );
}