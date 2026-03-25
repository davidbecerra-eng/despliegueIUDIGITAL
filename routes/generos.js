const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /generos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM generos ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener géneros" });
  }
});

// POST /generos
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    const [result] = await pool.query(
      `INSERT INTO generos (nombre, estado, created_at, updated_at, descripcion)
       VALUES (?, 'ACTIVO', NOW(), NOW(), ?)`,
      [nombre, descripcion]
    );

    res.status(201).json({ mensaje: "Género creado", id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear género" });
  }
});

// ✅ PUT /generos/activar/:id (poner ANTES de "/:id")
router.put("/activar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE generos
       SET estado = 'ACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    res.json({ mensaje: "Género reactivado (ACTIVO)" });
  } catch (error) {
    res.status(500).json({ error: "Error al reactivar género" });
  }
});

// PUT /generos/:id  (NO cambia estado)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const [result] = await pool.query(
      `UPDATE generos
       SET nombre = ?, descripcion = ?, updated_at = NOW()
       WHERE id = ?`,
      [nombre, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    res.json({ mensaje: "Género actualizado" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar género" });
  }
});

// DELETE /generos/:id  (borrado lógico)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE generos
       SET estado = 'INACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Género no encontrado" });
    }

    res.json({ mensaje: "Género desactivado (INACTIVO)" });
  } catch (e) {
    res.status(500).json({ error: "Error al desactivar género" });
  }
});

module.exports = router;