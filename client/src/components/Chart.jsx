import React, { useEffect, useRef } from 'react';
import { createChart, LineSeries } from 'lightweight-charts';

export const Chart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = createChart(chartRef.current, {
      layout: {
        textColor: 'black',
        background: { type: 'solid', color: 'white' },
      },
      width: 600,
      height: 400,
    });

    const line1 = chart.addSeries(LineSeries, { color: '#2962FF' });
    const line2 = chart.addSeries(LineSeries, { color: '#E1575A' });

    const generateLineData = (numberOfPoints = 100) => {
      let randomFactor = 25 + Math.random() * 25;
      const res = [];
      const date = new Date(Date.UTC(2023, 0, 1, 12, 0, 0, 0));
      for (let i = 0; i < numberOfPoints; ++i) {
        const time = Math.floor(date.getTime() / 1000);
        const value = i *
          (0.5 +
            Math.sin(i / 10) * 0.2 +
            Math.sin(i / 20) * 0.4 +
            Math.sin(i / randomFactor) * 0.8 +
            Math.sin(i / 500) * 0.5) +
          200;
        res.push({ time, value });
        date.setUTCDate(date.getUTCDate() + 1);
      }
      return res;
    };

    line1.setData(generateLineData());
    line2.setData(generateLineData());

    chart.timeScale().fitContent();

    return () => chart.remove();
  }, []);

  return <div ref={chartRef} />;
};