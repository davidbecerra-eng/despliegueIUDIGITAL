import axios from "axios";

const api = axios.create({
  baseURL: "https://peliculas-nhd1.onrender.com",
});

export default api;
