import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx"; // <-- agregado
import ListaSorteo from "./pages/Sorteo/SorteoHome/ListaSorteo.jsx";
import SorteoDetalle from "./pages/Sorteo/SorteoDetalle/SorteoDetalle.jsx";
import SorteoCreate from "./pages/Sorteo/SorteoCreate/SorteoCreate.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Header /> {/* <-- menú aparece aquí */}
      <Routes>
        <Route path="/" element={<ListaSorteo />} />
        <Route path="/sorteos/:link" element={<SorteoDetalle />} />
        <Route path="/sorteo/:link" element={<SorteoDetalle />} />
        <Route path="/sorteos/:id/editar" element={<SorteoCreate />} />
        <Route path="/sorteo/:id/editar" element={<SorteoCreate />} />
        <Route path="/sorteos/create" element={<SorteoCreate />} />
        <Route path="/sorteo/create" element={<SorteoCreate />} />
        <Route path="/participantes/:token" element={<ParticipanteDetalle />} /> {/* opcional si falta */}
      </Routes>
    </BrowserRouter>
  );
}
