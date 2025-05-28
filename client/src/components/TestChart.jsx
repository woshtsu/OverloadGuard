import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

export const TestChart = ({ title, event, socket }) => {
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const dataRef = useRef([]);

  useEffect(() => {
    // Crear el gráfico
    const chart = createChart(chartRef.current, {
      layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
      width: 600,
      height: 300,
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    seriesRef.current = chart.addSeries(LineSeries, { color: '#54006e' });
    chart.timeScale().fitContent();

    // Escuchar el evento específico del WebSocket
    socket.on(event, (data) => {
      const { time, value } = data;
      if(event === 'test-response-time'){
        console.log("en test response time")
        console.log(data)
      }
      const point = { time: time, value: value };

      dataRef.current.push(point);

      // Limitar el número de puntos en el gráfico
      if (dataRef.current.length > 60) {
        dataRef.current.shift();
      }

      seriesRef.current.setData(dataRef.current);
    });

    // Limpiar el gráfico cuando el componente se desmonta
    return () => {
      chart.remove();
    };
  }, [event, socket]);

  return (
    <div>
      <h3>{title}</h3>
      <div ref={chartRef} style={{ width: '600px', height: '300px' }} />
    </div>
  );
};