const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /media → listar con nombres
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        m.id, m.serial, m.titulo, m.sinopsis, m.url, m.imagen_portada, m.anio_estreno,
        g.nombre AS genero,
        d.nombres AS director,
        p.nombre AS productora,
        t.nombre AS tipo,
        m.created_at, m.updated_at
      FROM media m
      JOIN generos g ON g.id = m.genero_id
      JOIN directores d ON d.id = m.director_id
      JOIN productoras p ON p.id = m.productora_id
      JOIN tipos t ON t.id = m.tipo_id
      ORDER BY m.id DESC
    `);

    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener media" });
  }
});

// POST /media → crear (solo activos)
router.post("/", async (req, res) => {
  try {
    const {
      serial, titulo, sinopsis, url, imagen_portada,
      anio_estreno, genero_id, director_id, productora_id, tipo_id
    } = req.body;

    // Género ACTIVO
    const [gen] = await pool.query(
      "SELECT id FROM generos WHERE id = ? AND estado = 'ACTIVO'",
      [genero_id]
    );
    if (gen.length === 0) return res.status(400).json({ error: "Género inválido o INACTIVO" });

    // Director ACTIVO
    const [dir] = await pool.query(
      "SELECT id FROM directores WHERE id = ? AND estado = 'ACTIVO'",
      [director_id]
    );
    if (dir.length === 0) return res.status(400).json({ error: "Director inválido o INACTIVO" });

    // Productora ACTIVA
    const [prod] = await pool.query(
      "SELECT id FROM productoras WHERE id = ? AND estado = 'ACTIVO'",
      [productora_id]
    );
    if (prod.length === 0) return res.status(400).json({ error: "Productora inválida o INACTIVA" });

    // Tipo existe
    const [tipo] = await pool.query("SELECT id FROM tipos WHERE id = ?", [tipo_id]);
    if (tipo.length === 0) return res.status(400).json({ error: "Tipo inválido" });

    const [result] = await pool.query(
      `INSERT INTO media
      (serial, titulo, sinopsis, url, imagen_portada, created_at, updated_at,
       anio_estreno, genero_id, director_id, productora_id, tipo_id)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW(), ?, ?, ?, ?, ?)`,
      [serial, titulo, sinopsis, url, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id]
    );

    res.status(201).json({ mensaje: "Media creada", id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear media" });
  }
});

// PUT /media/:id → editar (solo activos)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      serial, titulo, sinopsis, url, imagen_portada,
      anio_estreno, genero_id, director_id, productora_id, tipo_id
    } = req.body;

    // Género ACTIVO
    const [gen] = await pool.query(
      "SELECT id FROM generos WHERE id = ? AND estado = 'ACTIVO'",
      [genero_id]
    );
    if (gen.length === 0) return res.status(400).json({ error: "Género inválido o INACTIVO" });

    // Director ACTIVO
    const [dir] = await pool.query(
      "SELECT id FROM directores WHERE id = ? AND estado = 'ACTIVO'",
      [director_id]
    );
    if (dir.length === 0) return res.status(400).json({ error: "Director inválido o INACTIVO" });

    // Productora ACTIVA
    const [prod] = await pool.query(
      "SELECT id FROM productoras WHERE id = ? AND estado = 'ACTIVO'",
      [productora_id]
    );
    if (prod.length === 0) return res.status(400).json({ error: "Productora inválida o INACTIVA" });

    // Tipo existe
    const [tipo] = await pool.query("SELECT id FROM tipos WHERE id = ?", [tipo_id]);
    if (tipo.length === 0) return res.status(400).json({ error: "Tipo inválido" });

    const [result] = await pool.query(
      `UPDATE media SET
        serial = ?, titulo = ?, sinopsis = ?, url = ?, imagen_portada = ?,
        anio_estreno = ?, genero_id = ?, director_id = ?, productora_id = ?, tipo_id = ?,
        updated_at = NOW()
       WHERE id = ?`,
      [serial, titulo, sinopsis, url, imagen_portada, anio_estreno, genero_id, director_id, productora_id, tipo_id, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Media no encontrada" });

    res.json({ mensaje: "Media actualizada" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar media" });
  }
});

// DELETE /media/:id → borrado físico
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM media WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Media no encontrada" });

    res.json({ mensaje: "Media eliminada" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar media" });
  }
});

module.exports = router;