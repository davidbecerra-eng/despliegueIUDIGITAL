const cors = require("cors");
const pool = require("./db");
const generosRoutes = require("./routes/generos");
const express = require("express");
const directoresRoutes = require("./routes/directores");
const productorasRoutes = require("./routes/productoras");
const tiposRoutes = require("./routes/tipos");
const mediaRoutes = require("./routes/media");
const app = express();
app.use(cors());

app.use(express.json());
app.use("/generos", generosRoutes);
app.use("/directores", directoresRoutes);
app.use("/productoras", productorasRoutes);
app.use("/tipos", tiposRoutes);
app.use("/media", mediaRoutes);
// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// Nueva ruta
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error conectando a MySQL", detalle: error.message });
  }
});

// Puerto del servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});