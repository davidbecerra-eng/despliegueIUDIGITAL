import { useEffect, useState } from "react";
import api from "../services/api";

function Genero() {
  const [generos, setGeneros] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const obtenerGeneros = async () => {
    try {
      const response = await api.get("/generos");
      setGeneros(response.data);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  const guardarGenero = async (e) => {
    e.preventDefault();

    try {
      if (idEditar) {
        await api.put(`/generos/${idEditar}`, {
          nombre,
          descripcion,
        });
      } else {
        await api.post("/generos", {
          nombre,
          descripcion,
        });
      }

      setNombre("");
      setDescripcion("");
      setIdEditar(null);
      obtenerGeneros();
    } catch (error) {
      console.error("Error al guardar género:", error);
    }
  };

  const eliminarGenero = async (id) => {
    try {
      await api.delete(`/generos/${id}`);
      obtenerGeneros();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const seleccionarGenero = (g) => {
    setNombre(g.nombre);
    setDescripcion(g.descripcion || "");
    setIdEditar(g.id);
  };

  useEffect(() => {
    obtenerGeneros();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Módulo Género</h2>

      <form onSubmit={guardarGenero} className="mb-4">
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
        {generos.map((g) => (
          <li
            key={g.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{g.nombre}</strong> - {g.estado}
              <br />
              <small>{g.descripcion}</small>
            </div>

            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => seleccionarGenero(g)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarGenero(g.id)}
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

export default Genero;