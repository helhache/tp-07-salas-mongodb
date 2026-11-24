const mongoose = require("mongoose");

const esquemaReserva = new mongoose.Schema({
  estudiante: {
    type: String,
    required: [true, "El nombre del estudiante es obligatorio."],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "El email es obligatorio."],
    trim: true,
    match: [/@/, "El email debe contener @."],
  },
  sala: {
    type: String,
    required: [true, "La sala es obligatoria."],
    enum: {
      values: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
      message: "La sala elegida no está permitida.",
    },
  },
  fecha: {
    type: String,
    required: [true, "La fecha es obligatoria."],
    trim: true,
    validate: {
      validator: function (valor) {
        return valor.length > 0;
      },
      message: "La fecha no puede estar vacía.",
    },
  },
  turno: {
    type: String,
    required: [true, "El turno es obligatorio."],
    enum: {
      values: ["Mañana", "Tarde", "Noche"],
      message: "El turno debe ser Mañana, Tarde o Noche.",
    },
  },
  personas: {
    type: Number,
    required: [true, "La cantidad de personas es obligatoria."],
    min: [1, "La cantidad mínima de personas es 1."],
    max: [6, "La cantidad máxima de personas es 6."],
    validate: {
      validator: Number.isInteger,
      message: "La cantidad de personas debe ser un número entero.",
    },
  },
});

const Reserva = mongoose.model("Reserva", esquemaReserva, "reservas");

module.exports = Reserva;
