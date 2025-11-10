import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ListaSorteo from './pages/Sorteo/SorteoHome/ListaSorteo.jsx'
import SorteoDetalle from './pages/Sorteo/SorteoDetalle/SorteoDetalle.jsx'
import SorteoCreate from './pages/Sorteo/SorteoCreate/SorteoCreate.jsx'

import CreateParticipante from './pages/Participante/ParticipanteCreate/ParticipanteCreate.jsx'
import DetalleParticipante from './pages/Participante/ParticipanteDetalle/ParticipanteDetalle.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css'
import FormLogin from './pages/auth/Login/FormLogin.jsx'
import FormRegister from './pages/auth/Register/FormRegister.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListaSorteo />} />
        <Route path="/sorteo/:link" element={<SorteoDetalle />} />
        <Route path="/sorteo/create" element={<SorteoCreate />} />
        <Route path="/participantes/:token" element={<DetalleParticipante />} />
        <Route path="/sorteo/:link/inscribirse" element={<CreateParticipante />} />
        <Route path="/login" element={<FormLogin />} />
        <Route path="/register" element={<FormRegister />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
