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
        <h1 className="mb-4">Proyecto Películas</h1>

        <nav className="mb-4">
          <Link to="/" className="btn btn-dark me-2">
            Género
          </Link>

          <Link to="/directores" className="btn btn-dark me-2">
            Director
          </Link>

          <Link to="/productoras" className="btn btn-dark me-2">
            Productora
          </Link>

          <Link to="/tipos" className="btn btn-dark me-2">
            Tipo
          </Link>

          <Link to="/media" className="btn btn-dark">
            Media
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Genero />} />
          <Route path="/directores" element={<Director />} />
          <Route path="/productoras" element={<Productora />} />
          <Route path="/tipos" element={<Tipo />} />
          <Route path="/media" element={<Media />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;