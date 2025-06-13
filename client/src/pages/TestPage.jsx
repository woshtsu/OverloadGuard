import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { TestChart } from "../components/TestChart.jsx";
import { useNavigate } from 'react-router-dom'

export function TestPage() {
  const [socket, setSocket] = useState(null)
  const navigate = useNavigate();

  const handleFinish = async () => {
    try {
      // Hacemos el GET al servidor
      await fetch('http://localhost:1234/server/save-metrics', {
        method: 'GET',
        // Si necesitas credenciales o headers especiales, agrégalos aquí
      });

      // Redirigimos al inicio
      navigate('/');
    } catch (error) {
      console.error('Error al guardar métricas:', error);
      // Opcional: mostrar mensaje de error al usuario
      navigate('/');
    }
  }

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
      <button
        style={{ width: '600px', height: '300px', cursor: 'grab', background: 'black', color: 'white' }}
        onClick={handleFinish}
      >
        Terminar test
      </button>
      <TestChart title={'Peticiones por segundo'} event={'test-rps'} socket={socket} />
      <TestChart title={'Porcentaje de CPU'} event={'test-cpu'} socket={socket} />
      <TestChart title={'Tiempos de respuesta'} event={'test-response-time'} socket={socket} />
    </section>
  );
}