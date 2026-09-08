import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Atmosphere from './components/Atmosphere'
import Home from './routes/Home'
import Town from './routes/Town'
import Dive from './routes/Dive'

export default function App() {
  return (
    <BrowserRouter>
      <Atmosphere />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/town" element={<Town />} />
          <Route path="/dive" element={<Dive />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
