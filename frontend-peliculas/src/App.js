import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Genero from "./pages/Genero";
import Director from "./pages/Director";
import Productora from "./pages/Productora";
import Tipo from "./pages/Tipo";
import Media from "./pages/Media";

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">

        <div className="text-center mb-4">
          <h1 className="fw-bold text-primary mt-2">
            🎬 Proyecto Películas
          </h1>
        </div>

        <nav className="d-flex justify-content-center mb-4 flex-wrap gap-2">
          <Link to="/" className="btn btn-outline-primary">
            Género
          </Link>

          <Link to="/directores" className="btn btn-outline-primary">
            Director
          </Link>

          <Link to="/productoras" className="btn btn-outline-primary">
            Productora
          </Link>

          <Link to="/tipos" className="btn btn-outline-primary">
            Tipo
          </Link>

          <Link to="/media" className="btn btn-outline-primary">
            Media
          </Link>
        </nav>

        <div className="card shadow p-3">
          <Routes>
            <Route path="/" element={<Genero />} />
            <Route path="/directores" element={<Director />} />
            <Route path="/productoras" element={<Productora />} />
            <Route path="/tipos" element={<Tipo />} />
            <Route path="/media" element={<Media />} />
          </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;
