import { useEffect, useState } from "react";
import api from "../services/api";

function Media() {
  const [media, setMedia] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [directores, setDirectores] = useState([]);
  const [productoras, setProductoras] = useState([]);
  const [tipos, setTipos] = useState([]);

  const [serial, setSerial] = useState("");
  const [titulo, setTitulo] = useState("");
  const [sinopsis, setSinopsis] = useState("");
  const [url, setUrl] = useState("");
  const [imagenPortada, setImagenPortada] = useState("");
  const [anioEstreno, setAnioEstreno] = useState("");
  const [generoId, setGeneroId] = useState("");
  const [directorId, setDirectorId] = useState("");
  const [productoraId, setProductoraId] = useState("");
  const [tipoId, setTipoId] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const obtenerMedia = async () => {
    try {
      const response = await api.get("/media");
      setMedia(response.data);
    } catch (error) {
      console.error("Error al obtener media:", error);
    }
  };

  const obtenerGeneros = async () => {
    try {
      const response = await api.get("/generos");
      const activos = response.data.filter((g) => g.estado === "ACTIVO");
      setGeneros(activos);
    } catch (error) {
      console.error("Error al obtener géneros:", error);
    }
  };

  const obtenerDirectores = async () => {
    try {
      const response = await api.get("/directores");
      const activos = response.data.filter((d) => d.estado === "ACTIVO");
      setDirectores(activos);
    } catch (error) {
      console.error("Error al obtener directores:", error);
    }
  };

  const obtenerProductoras = async () => {
    try {
      const response = await api.get("/productoras");
      const activos = response.data.filter((p) => p.estado === "ACTIVO");
      setProductoras(activos);
    } catch (error) {
      console.error("Error al obtener productoras:", error);
    }
  };

  const obtenerTipos = async () => {
    try {
      const response = await api.get("/tipos");
      setTipos(response.data);
    } catch (error) {
      console.error("Error al obtener tipos:", error);
    }
  };

  const limpiarFormulario = () => {
    setSerial("");
    setTitulo("");
    setSinopsis("");
    setUrl("");
    setImagenPortada("");
    setAnioEstreno("");
    setGeneroId("");
    setDirectorId("");
    setProductoraId("");
    setTipoId("");
    setIdEditar(null);
  };

  const guardarMedia = async (e) => {
    e.preventDefault();

    const datos = {
      serial,
      titulo,
      sinopsis,
      url,
      imagen_portada: imagenPortada,
      anio_estreno: anioEstreno,
      genero_id: generoId,
      director_id: directorId,
      productora_id: productoraId,
      tipo_id: tipoId,
    };

    try {
      if (idEditar) {
        await api.put(`/media/${idEditar}`, datos);
      } else {
        await api.post("/media", datos);
      }

      limpiarFormulario();
      obtenerMedia();
    } catch (error) {
      console.error("Error al guardar media:", error);
    }
  };

  const eliminarMedia = async (id) => {
    try {
      await api.delete(`/media/${id}`);
      obtenerMedia();
    } catch (error) {
      console.error("Error al eliminar media:", error);
    }
  };

  const seleccionarMedia = async (m) => {
    try {
      const response = await api.get("/media");
      const lista = response.data;
      const item = lista.find((x) => x.id === m.id);

      if (!item) return;

      setSerial(item.serial || "");
      setTitulo(item.titulo || "");
      setSinopsis(item.sinopsis || "");
      setUrl(item.url || "");
      setImagenPortada(item.imagen_portada || "");
      setAnioEstreno(item.anio_estreno || "");
      setIdEditar(item.id);

      const generoEncontrado = generos.find((g) => g.nombre === item.genero);
      const directorEncontrado = directores.find((d) => d.nombres === item.director);
      const productoraEncontrada = productoras.find((p) => p.nombre === item.productora);
      const tipoEncontrado = tipos.find((t) => t.nombre === item.tipo);

      setGeneroId(generoEncontrado ? generoEncontrado.id : "");
      setDirectorId(directorEncontrado ? directorEncontrado.id : "");
      setProductoraId(productoraEncontrada ? productoraEncontrada.id : "");
      setTipoId(tipoEncontrado ? tipoEncontrado.id : "");
    } catch (error) {
      console.error("Error al seleccionar media:", error);
    }
  };

  useEffect(() => {
    obtenerMedia();
    obtenerGeneros();
    obtenerDirectores();
    obtenerProductoras();
    obtenerTipos();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Módulo Media</h2>

      <form onSubmit={guardarMedia} className="mb-4">
        <div className="mb-3">
          <label className="form-label">Serial</label>
          <input
            type="text"
            className="form-control"
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Sinopsis</label>
          <input
            type="text"
            className="form-control"
            value={sinopsis}
            onChange={(e) => setSinopsis(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">URL</label>
          <input
            type="text"
            className="form-control"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen portada</label>
          <input
            type="text"
            className="form-control"
            value={imagenPortada}
            onChange={(e) => setImagenPortada(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Año de estreno</label>
          <input
            type="number"
            className="form-control"
            value={anioEstreno}
            onChange={(e) => setAnioEstreno(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Género</label>
          <select
            className="form-control"
            value={generoId}
            onChange={(e) => setGeneroId(e.target.value)}
          >
            <option value="">Seleccione un género</option>
            {generos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Director</label>
          <select
            className="form-control"
            value={directorId}
            onChange={(e) => setDirectorId(e.target.value)}
          >
            <option value="">Seleccione un director</option>
            {directores.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombres}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Productora</label>
          <select
            className="form-control"
            value={productoraId}
            onChange={(e) => setProductoraId(e.target.value)}
          >
            <option value="">Seleccione una productora</option>
            {productoras.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tipo</label>
          <select
            className="form-control"
            value={tipoId}
            onChange={(e) => setTipoId(e.target.value)}
          >
            <option value="">Seleccione un tipo</option>
            {tipos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {idEditar ? "Actualizar" : "Guardar"}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={limpiarFormulario}
        >
          Limpiar
        </button>
      </form>

      <ul className="list-group">
        {media.map((m) => (
          <li key={m.id} className="list-group-item">
            <strong>{m.titulo}</strong> - {m.tipo}
            <br />
            <small>Serial: {m.serial}</small>
            <br />
            <small>Género: {m.genero}</small>
            <br />
            <small>Director: {m.director}</small>
            <br />
            <small>Productora: {m.productora}</small>
            <br />
            <small>Año: {m.anio_estreno}</small>
            <br />
            <small>Sinopsis: {m.sinopsis}</small>
            <br />
            <small>URL: {m.url}</small>
            <br />
            <small>Imagen: {m.imagen_portada}</small>
            <div className="mt-2">
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => seleccionarMedia(m)}
              >
                Editar
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarMedia(m.id)}
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

export default Media;