import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CanchaDetail from "./pages/CanchaDetail";
import { CanchaList } from "./pages/CanchaList";
import DashboardAdmin from "./pages/DashboardAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/cancha/:id" element={<CanchaDetail />} />
        <Route path="/canchas" element={<CanchaList />} />
        <Route path="/dashboardadmin" element={<DashboardAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;