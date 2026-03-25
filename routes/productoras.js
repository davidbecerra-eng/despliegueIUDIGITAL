const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /productoras
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productoras ORDER BY id DESC");
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: "Error al obtener productoras" });
  }
});

// POST /productoras
router.post("/", async (req, res) => {
  try {
    const { nombre, slogan, descripcion } = req.body;

    const [result] = await pool.query(
      `INSERT INTO productoras (nombre, estado, created_at, updated_at, slogan, descripcion)
       VALUES (?, 'ACTIVO', NOW(), NOW(), ?, ?)`,
      [nombre, slogan, descripcion]
    );

    res.status(201).json({ mensaje: "Productora creada", id: result.insertId });
  } catch (e) {
    res.status(500).json({ error: "Error al crear productora" });
  }
});

// ✅ PUT /productoras/activar/:id  (VA PRIMERO)
router.put("/activar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE productoras
       SET estado = 'ACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Productora no encontrada" });
    }

    res.json({ mensaje: "Productora reactivada (ACTIVO)" });
  } catch (error) {
    res.status(500).json({ error: "Error al reactivar productora" });
  }
});

// PUT /productoras/:id (SOLO EDITA, no toca estado)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, slogan, descripcion } = req.body;

    const [result] = await pool.query(
      `UPDATE productoras
       SET nombre = ?, slogan = ?, descripcion = ?, updated_at = NOW()
       WHERE id = ?`,
      [nombre, slogan, descripcion, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Productora no encontrada" });
    }

    res.json({ mensaje: "Productora actualizada" });
  } catch (e) {
    res.status(500).json({ error: "Error al actualizar productora" });
  }
});

// DELETE /productoras/:id (BORRADO LÓGICO)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE productoras
       SET estado = 'INACTIVO', updated_at = NOW()
       WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Productora no encontrada" });
    }

    res.json({ mensaje: "Productora desactivada (INACTIVO)" });
  } catch (e) {
    res.status(500).json({ error: "Error al desactivar productora" });
  }
});

module.exports = router;