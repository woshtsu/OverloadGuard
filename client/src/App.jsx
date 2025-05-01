import './App.css'
import { ServerStatsChart } from './components/ServerStatsChart.jsx'
import { Chart } from './components/Chart.jsx'

function App() {

  return (
    <section>
      <h1>Estadísticas del servidor</h1>

      {/* Gráfico de CPU */}
      <ServerStatsChart title="Uso de CPU (%)" event="cpu-stats" />

      {/* Gráfico de peticiones HTTP */}
      <ServerStatsChart title="Peticiones HTTP" event="request-stats" />
      <h2>El chart de prueba</h2>
      <Chart />
    </section>
  )
}

export default App
