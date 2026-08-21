import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CanchaDetail from "./pages/CanchaDetail";
import { CanchaList } from "./pages/CanchaList";
import { ComplejoList } from "./pages/ComplejoList";
import ComplejoDetail from "./pages/ComplejoDetail";
import NotificacionesCliente from "./pages/NotificacionesCliente";
import DashboardAdmin from "./pages/DashboardAdmin";
import Dashboard from "./pages/Dashboard";
import Nosotros from "./pages/Nosotros";
import PoliticaDePrivacidad from "./pages/PoliticasDePrivacidad";
import TerminosDeServicio from "./pages/TerminosDeServicio";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/cancha/:id" element={<CanchaDetail />} />
        <Route path="/canchas" element={<CanchaList />} />
        <Route path="/complejos" element={<ComplejoList />} />
        <Route path="/complejos/:id" element={<ComplejoDetail />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route
          path="/notificaciones"
          element={
            <ProtectedRoute roles={["Cliente"]}>
              <NotificacionesCliente />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/politica-de-privacidad" element={<PoliticaDePrivacidad />} />
        <Route path="/terminos-de-servicio" element={<TerminosDeServicio />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;