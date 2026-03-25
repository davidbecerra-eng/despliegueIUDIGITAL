import { useEffect, useState } from "react";
import api from "../services/api";

function Director() {
  const [directores, setDirectores] = useState([]);
  const [nombres, setNombres] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const obtenerDirectores = async () => {
    try {
      const response = await api.get("/directores");
      setDirectores(response.data);
    } catch (error) {
      console.error("Error al obtener directores:", error);
    }
  };

  const guardarDirector = async (e) => {
    e.preventDefault();

    try {
      if (idEditar) {
        await api.put(`/directores/${idEditar}`, {
          nombres,
        });
      } else {
        await api.post("/directores", {
          nombres,
        });
      }

      setNombres("");
      setIdEditar(null);
      obtenerDirectores();
    } catch (error) {
      console.error("Error al guardar director:", error);
    }
  };

  const eliminarDirector = async (id) => {
    try {
      await api.delete(`/directores/${id}`);
      obtenerDirectores();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const seleccionarDirector = (d) => {
    setNombres(d.nombres);
    setIdEditar(d.id);
  };

  useEffect(() => {
    obtenerDirectores();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Módulo Director</h2>

      <form onSubmit={guardarDirector} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Nombre del Director</label>
          <input
            type="text"
            className="form-control"
            value={nombres}
            onChange={(e) => setNombres(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {idEditar ? "Actualizar" : "Guardar"}
        </button>
      </form>

      <ul className="list-group">
        {directores.map((d) => (
          <li
            key={d.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <strong>{d.nombres}</strong> - {d.estado}
            </div>

            <div>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => seleccionarDirector(d)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarDirector(d.id)}
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

export default Director;