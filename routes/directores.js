const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /directores
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM directores ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener directores" });
  }
});

// POST /directores
router.post("/", async (req, res) => {
  try {
    const { nombres } = req.body;

    const [result] = await pool.query(
      `INSERT INTO directores (nombres, estado, created_at, updated_at)
       VALUES (?, 'ACTIVO', NOW(), NOW())`,
      [nombres]
    );

    res.status(201).json({ mensaje: "Director creado", id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear director" });
  }
});

// ✅ PUT /directores/activar/:id  (VA PRIMERO)
router.put("/activar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE directores
       SET estado = 'ACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    res.json({ mensaje: "Director reactivado (ACTIVO)" });
  } catch (error) {
    res.status(500).json({ error: "Error al reactivar director" });
  }
});

// PUT /directores/:id  (SOLO EDITA, no toca estado)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombres } = req.body;

    const [result] = await pool.query(
      `UPDATE directores
       SET nombres = ?, updated_at = NOW()
       WHERE id = ?`,
      [nombres, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    res.json({ mensaje: "Director actualizado" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar director" });
  }
});

// DELETE /directores/:id  (BORRADO LÓGICO)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE directores
       SET estado = 'INACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Director no encontrado" });
    }

    res.json({ mensaje: "Director desactivado (INACTIVO)" });
  } catch (e) {
    res.status(500).json({ error: "Error al desactivar director" });
  }
});

module.exports = router;