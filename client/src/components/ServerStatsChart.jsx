import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';
import { io } from 'socket.io-client';

export const ServerStatsChart = ({ title, event }) => {
    const chartRef = useRef(null);
    const seriesRef = useRef(null);
    const dataRef = useRef([]);

    useEffect(() => {
        const chart = createChart(chartRef.current, {
            layout: { textColor: 'black', background: { type: 'solid', color: 'white' } },
            width: 600,
            height: 300,
            timeScale: { timeVisible: true, secondsVisible: true },
        });

        seriesRef.current = chart.addSeries(LineSeries, { color: '#2962FF' })

        chart.timeScale().fitContent();

        const monitorSocket = io('http://localhost:1234/monitor', { path: '/websocket/' })

        monitorSocket.on('connect', () => {
            console.log(`Conectado al namespace /monitor con ID: ${monitorSocket.id}`)
        })

        monitorSocket.on(event, (data) => {
            const { time, value } = data;

            const point = { time: time, value: value };

            dataRef.current.push(point);

            // if (dataRef.current.length > 60) {
            //     dataRef.current.shift();
            // }

            seriesRef.current.setData(dataRef.current);
        });

        return () => {
            monitorSocket.disconnect();
            chart.remove();
        };
    }, [event]);

    return (
        <div>
            <h3>{title}</h3>
            <div ref={chartRef} style={{ width: '600px', height: '300px' }} />
        </div>
    );
};