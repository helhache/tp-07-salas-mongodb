const express = require("express");
const path = require("node:path");
const morgan = require("morgan");
const expressLayouts = require("express-ejs-layouts");
const {
  identificarSolicitud,
  medirDuracion,
} = require("./middleware/solicitudes");
const { SALAS_PERMITIDAS } = require("./middleware/reservas");
const { crearControladorReservas } = require("./controladores/reservas");
const { crearRutasReservas } = require("./rutas/reservas");

function crearApp(servicio, config) {
  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));

  app.use(morgan(config.formatoMorgan));
  app.use(identificarSolicitud);
  app.use(medirDuracion);
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  app.get("/", (req, res) => {
    res.status(200).render("inicio", {
      titulo: "Inicio",
      salas: SALAS_PERMITIDAS,
    });
  });

  app.get("/estado", (req, res) => {
    res.json({
      servicio: "activo",
      reservas: servicio.contar(),
      solicitudId: res.locals.solicitudId,
    });
  });

  const controlador = crearControladorReservas(servicio);
  const rutasReservas = crearRutasReservas(controlador);
  app.use("/reservas", rutasReservas);

  app.use((req, res) => {
    res.status(404).render("no-encontrado", {
      titulo: "Página no encontrada",
      mensaje: "La dirección solicitada no existe.",
    });
  });

  return app;
}

module.exports = { crearApp };
