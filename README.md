<!-- markdownlint-disable no-inline-html first-line-h1 -->

<div align="center">

  <h1>OverloadGuard™</h1>

</div>

<!-- markdownlint-enable no-inline-html -->

MODELO DE TIEMPO DE RESPUESTA ESTIMADO: T(t)

Este modelo representa una estimación del tiempo de respuesta del servidor en función de dos variables dinámicas:
1. La tasa de llegada de peticiones en un intervalo (request por segundo).
2. El porcentaje de uso de CPU del sistema (cpuPercent).

La fórmula utilizada es:

    T(t) = T0 + α ⋅ rps + β ⋅ cpuPercent

Donde:
- T(t): Tiempo de respuesta estimado.
- T0: Tiempo base de respuesta cuando no hay carga (valor devuelto por python).
- α (alpha): Coeficiente de sensibilidad al número de peticiones (valor devuelto por python).
- β (beta): Coeficiente de sensibilidad al uso de CPU (valor devuelto por python).

ENTRADA DE PYTHON:
- Un csv de la siguiente forma (con arrays de rpsData, cpuData y responseTimeData):
r,cpu,T
300,65.3,12.5
280,66.7,11.8
320,68.2,13.1

SALIDA DE PYTHON (luego de la regresion lineal):
- valores de T0, alpha y beta

DÓNDE SE VE LA SALIDA:
- los valores de T0, alpha y beta se guardan en un json

Este modelo permite anticipar la degradación del servicio bajo carga creciente y es útil para análisis de rendimiento, simulación o autoescalado.



## Para Instalar tanto en server como en cliente

### npm

```bash
npm install
```

## Para Ejecutar tanto en server como en cliente

### npm

```bash
npm run dev
```

