import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import CanchaDetail from "./pages/CanchaDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/canchas" element={<Home2 />} />
        <Route path="/cancha/:id" element={<CanchaDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;