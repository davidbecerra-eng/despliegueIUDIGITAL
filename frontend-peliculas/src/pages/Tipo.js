import { useEffect, useState } from "react";
import api from "../services/api";

function Tipo() {
  const [tipos, setTipos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const obtenerTipos = async () => {
    try {
      const response = await api.get("/tipos");
      setTipos(response.data);
    } catch (error) {
      console.error("Error al obtener tipos:", error);
    }
  };

  const guardarTipo = async (e) => {
    e.preventDefault();

    try {
      if (idEditar) {
        await api.put(`/tipos/${idEditar}`, {
          nombre,
          descripcion,
        });
      } else {
        await api.post("/tipos", {
          nombre,
          descripcion,
        });
      }

      setNombre("");
      setDescripcion("");
      setIdEditar(null);
      obtenerTipos();
    } catch (error) {
      console.error("Error al guardar tipo:", error);
    }
  };

  const eliminarTipo = async (id) => {
    try {
      await api.delete(`/tipos/${id}`);
      obtenerTipos();
    } catch (error) {
      console.error("Error al eliminar tipo:", error);
    }
  };

  const seleccionarTipo = (t) => {
    setNombre(t.nombre);
    setDescripcion(t.descripcion || "");
    setIdEditar(t.id);
  };

  useEffect(() => {
    obtenerTipos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Módulo Tipo</h2>

      <form onSubmit={guardarTipo} className="mb-4">
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
        {tipos.map((t) => (
          <li
            key={t.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{t.nombre}</strong>
              <br />
              <small>{t.descripcion}</small>
            </div>

            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => seleccionarTipo(t)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarTipo(t.id)}
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

export default Tipo;