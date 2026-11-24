const {
  SALAS_PERMITIDAS,
  TURNOS_PERMITIDOS,
} = require("../middleware/reservas");

function crearControladorReservas(servicio) {
  return {
    listar(req, res) {
      const salaFiltro = req.query.sala || "";
      let listado = servicio.listar();

      if (salaFiltro) {
        listado = listado.filter(
          (r) => r.sala.toLowerCase() === salaFiltro.toLowerCase(),
        );
      }

      res.status(200).render("reservas/lista", {
        titulo: "Reservas",
        reservas: listado,
        salas: SALAS_PERMITIDAS,
        salaFiltro,
      });
    },

    detalle(req, res) {
      const id = Number(req.params.id);
      const reserva = servicio.buscar(id);

      if (!reserva) {
        return res.status(404).render("no-encontrado", {
          titulo: "Reserva no encontrada",
          mensaje: "La reserva solicitada no existe.",
        });
      }

      res.status(200).render("reservas/detalle", {
        titulo: `Reserva #${reserva.id}`,
        reserva,
      });
    },

    formulario(req, res) {
      res.status(200).render("reservas/nueva", {
        titulo: "Nueva reserva",
        salas: SALAS_PERMITIDAS,
        turnos: TURNOS_PERMITIDOS,
        errores: [],
        valores: {},
      });
    },

    crear(req, res) {
      servicio.crear(req.reservaValidada);
      res.redirect("/reservas");
    },
  };
}

module.exports = { crearControladorReservas };
