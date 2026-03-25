import { useEffect, useState } from "react";
import api from "../services/api";

function Productora() {
  const [productoras, setProductoras] = useState([]);
  const [nombre, setNombre] = useState("");
  const [slogan, setSlogan] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const obtenerProductoras = async () => {
    try {
      const response = await api.get("/productoras");
      setProductoras(response.data);
    } catch (error) {
      console.error("Error al obtener productoras:", error);
    }
  };

  const guardarProductora = async (e) => {
    e.preventDefault();

    try {
      if (idEditar) {
        await api.put(`/productoras/${idEditar}`, {
          nombre,
          slogan,
          descripcion,
        });
      } else {
        await api.post("/productoras", {
          nombre,
          slogan,
          descripcion,
        });
      }

      setNombre("");
      setSlogan("");
      setDescripcion("");
      setIdEditar(null);
      obtenerProductoras();
    } catch (error) {
      console.error("Error al guardar productora:", error);
    }
  };

  const eliminarProductora = async (id) => {
    try {
      await api.delete(`/productoras/${id}`);
      obtenerProductoras();
    } catch (error) {
      console.error("Error al eliminar productora:", error);
    }
  };

  const seleccionarProductora = (p) => {
    setNombre(p.nombre);
    setSlogan(p.slogan || "");
    setDescripcion(p.descripcion || "");
    setIdEditar(p.id);
  };

  useEffect(() => {
    obtenerProductoras();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Módulo Productora</h2>

      <form onSubmit={guardarProductora} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Slogan</label>
          <input
            type="text"
            className="form-control"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <input
            type="text"
            className="form-control"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {idEditar ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <ul className="list-group">
        {productoras.map((p) => (
          <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{p.nombre}</strong> - {p.estado}
              <br />
              <small>{p.slogan}</small>
              <br />
              <small>{p.descripcion}</small>
            </div>

            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => seleccionarProductora(p)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarProductora(p.id)}
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Productora;