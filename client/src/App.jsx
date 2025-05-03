import './App.css'
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom'
import { MonitorPage } from './pages/MonitorPage'
import { TestPage } from './pages/TestPage'

function App() {
  return (
    <section>
      <BrowserRouter>
        <nav
          style={{
            display: 'flex',
            color: 'black',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px 20px',
            backgroundColor: '#ffffff',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/monitor">MONITOR</Link>
            </li>
            <li>
              <Link to="/test">TEST</Link>
            </li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<h1>Esta de algun modo es principal?</h1>} />
          <Route path="/monitor" element={<MonitorPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </section>
  )
}

export default App
