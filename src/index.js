const fs = require("node:fs/promises");
const path = require("node:path");
const { cargarConfiguracion } = require("./config/entorno");
const { crearServicioReservas } = require("./servicios/reservas");
const { crearApp } = require("./app");

async function main() {
  const config = cargarConfiguracion();

  const rutaDatos = path.join(__dirname, "..", "datos", "reservas.json");
  let datosIniciales;

  try {
    const contenido = await fs.readFile(rutaDatos, "utf8");
    datosIniciales = JSON.parse(contenido);
  } catch (error) {
    console.error("Error al cargar los datos iniciales:", error.message);
    process.exit(1);
  }

  const servicio = crearServicioReservas(datosIniciales);
  const app = crearApp(servicio, config);

  app.listen(config.puerto, () => {
    console.log(`Servidor escuchando en http://localhost:${config.puerto}`);
    console.log(`Entorno: ${config.entorno}`);
  });
}

main();
