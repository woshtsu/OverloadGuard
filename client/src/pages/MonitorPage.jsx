import { Chart } from "../components/Chart";
import { ServerStatsChart } from "../components/ServerStatsChart";

export function MonitorPage() {
  return (
    <section>
      <h1>Estadísticas del servidor</h1>
      <ServerStatsChart title="Uso de CPU (%)" event="cpu-stats" />
      <ServerStatsChart title="Peticiones HTTP" event="request-stats" />
      <h2>El chart de prueba</h2>
      <Chart />
    </section>
  )
}