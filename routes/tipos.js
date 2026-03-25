const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /tipos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tipos ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener tipos" });
  }
});

// POST /tipos
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tipos (nombre, created_at, updated_at, descripcion)
       VALUES (?, NOW(), NOW(), ?)`,
      [nombre, descripcion]
    );

    res.status(201).json({ mensaje: "Tipo creado", id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear tipo" });
  }
});

// PUT /tipos/:id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const [result] = await pool.query(
      `UPDATE tipos
       SET nombre = ?, descripcion = ?, updated_at = NOW()
       WHERE id = ?`,
      [nombre, descripcion, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo no encontrado" });

    res.json({ mensaje: "Tipo actualizado" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar tipo" });
  }
});

// DELETE /tipos/:id (borrado físico)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM tipos WHERE id = ?", [id]);

    if (result.affectedRows === 0) return res.status(404).json({ error: "Tipo no encontrado" });

    res.json({ mensaje: "Tipo eliminado" });
  } catch (e) {
    res.status(500).json({ error: "Error al eliminar tipo" });
  }
});

module.exports = router;