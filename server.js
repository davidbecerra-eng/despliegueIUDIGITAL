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

// Ruta de prueba DB
app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS fecha");
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      error: "Error conectando a MySQL",
      detalle: error.message,
    });
  }
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});