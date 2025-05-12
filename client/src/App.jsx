import './App.css'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { MonitorPage } from './pages/MonitorPage'
import { TestPage } from './pages/TestPage'

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <header className="main-header">
          <nav className="main-nav">
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/" className="nav-link">Inicio</Link>
              </li>
              <li className="nav-item">
                <Link to="/monitor" className="nav-link">Monitor</Link>
              </li>
              <li className="nav-item">
                <Link to="/test" className="nav-link">Test</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={
              <section className="home-section">
                <h1 className="main-title">Sistema de Monitoreo OverloadGuard</h1>
                <p className="welcome-text">Bienvenido al sistema de monitoreo y predicción de carga de servidores</p>
              </section>
            } />
            <Route path="/monitor" element={<MonitorPage />} />
            <Route path="/test" element={<TestPage />} />
          </Routes>
        </main>

        <footer className="main-footer">
          <p>&copy; 2024 OverloadGuard - Sistema de Monitoreo Predictivo</p>
        </footer>
      </BrowserRouter>
    </div>
  )
}

export default App
