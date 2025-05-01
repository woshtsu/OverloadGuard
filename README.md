<!-- markdownlint-disable no-inline-html first-line-h1 -->

<div align="center">

  <h1>OverloadGuard™</h1>

  [![CircleCI][ci-img]][ci-link]
  [![npm version][npm-version-img]][npm-link]
  [![npm bundle size][bundle-size-img]][bundle-size-link]
  [![Dependencies count][deps-count-img]][bundle-size-link]
  [![Downloads][npm-downloads-img]][npm-link]
</div>

<!-- markdownlint-enable no-inline-html -->

MODELO DE TIEMPO DE RESPUESTA ESTIMADO: T(t)

Este modelo representa una estimación del tiempo de respuesta del servidor en función de dos variables dinámicas:
1. La tasa de llegada de peticiones en un intervalo (requestCount por segundo).
2. El porcentaje de uso de CPU del sistema (cpuPercent).

La fórmula utilizada es:

    T(t) = T0 + α ⋅ requestCount + β ⋅ cpuPercent

Donde:
- T(t): Tiempo de respuesta estimado en milisegundos.
- T0: Tiempo base de respuesta cuando no hay carga, típicamente una constante pequeña (por ejemplo, 1 ms).
- α (alpha): Coeficiente de sensibilidad al número de peticiones.
- β (beta): Coeficiente de sensibilidad al uso de CPU.

Valores usados:
  const alpha = 0.01; // Cada petición por segundo aumenta 0.01 ms al tiempo de respuesta.
  const beta  = 0.02; // Cada 1% de uso de CPU añade 0.02 ms al tiempo de respuesta.

Estos valores fueron elegidos de forma heurística para simular un sistema con carga moderada. Se pueden ajustar con base en pruebas empíricas o datos reales del sistema.

ENTRADA DEL MODELO:
- requestCount (número de peticiones por segundo, contado por el middleware de Express).
- cpuPercent (medido por el paquete os-utils cada segundo).

SALIDA DEL MODELO:
- T(t): Un valor numérico estimado que representa el tiempo de respuesta esperado en ese segundo.

DÓNDE SE VE LA SALIDA:
- Se puede emitir a través de WebSocket como un evento adicional (por ejemplo: 'response-model').
- También se puede almacenar o graficar desde el cliente que recibe los datos para analizar el rendimiento estimado del servidor en tiempo real.

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

