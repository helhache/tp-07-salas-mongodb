const SALAS_PERMITIDAS = ["Sala Norte", "Sala Sur", "Sala Multimedia"];
const TURNOS_PERMITIDOS = ["Mañana", "Tarde", "Noche"];

function prepararAreaReservas(req, res, next) {
  res.locals.seccion = "Reservas de salas";
  next();
}

function validarReserva(req, res, next) {
  const estudiante = (req.body.estudiante || "").trim();
  const email = (req.body.email || "").trim();
  const sala = (req.body.sala || "").trim();
  const fecha = (req.body.fecha || "").trim();
  const turno = (req.body.turno || "").trim();
  const personasRaw = (req.body.personas || "").toString().trim();
  const personas = Number(personasRaw);

  const errores = [];
  const valores = {
    estudiante,
    email,
    sala,
    fecha,
    turno,
    personas: personasRaw,
  };

  if (!estudiante) {
    errores.push("El nombre del estudiante es obligatorio.");
  }

  if (!email) {
    errores.push("El email es obligatorio.");
  } else if (!email.includes("@")) {
    errores.push("El email debe contener @.");
  }

  if (!sala) {
    errores.push("La sala es obligatoria.");
  } else if (!SALAS_PERMITIDAS.includes(sala)) {
    errores.push("La sala elegida no está permitida.");
  }

  if (!fecha) {
    errores.push("La fecha es obligatoria.");
  }

  if (!turno) {
    errores.push("El turno es obligatorio.");
  } else if (!TURNOS_PERMITIDOS.includes(turno)) {
    errores.push("El turno debe ser Mañana, Tarde o Noche.");
  }

  if (!personasRaw) {
    errores.push("La cantidad de personas es obligatoria.");
  } else if (!Number.isInteger(personas) || personas < 1 || personas > 6) {
    errores.push(
      "La cantidad de personas debe ser un número entero entre 1 y 6.",
    );
  }

  if (errores.length > 0) {
    return res.status(400).render("reservas/nueva", {
      titulo: "Nueva reserva",
      salas: SALAS_PERMITIDAS,
      turnos: TURNOS_PERMITIDOS,
      errores,
      valores,
    });
  }

  req.reservaValidada = {
    ...valores,
    personas,
  };

  next();
}

module.exports = {
  prepararAreaReservas,
  validarReserva,
  SALAS_PERMITIDAS,
  TURNOS_PERMITIDOS,
};
