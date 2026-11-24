const { conectar, desconectar } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

const datosReserva = {
  estudiante: "Lucía",
  email: "lucia.gomez@gmail.com",
  sala: "Sala Norte",
  fecha: "2026-11-20",
  turno: "Tarde",
  personas: 3,
};

async function main() {
  try {
    await conectar();
    console.log("Conexión establecida.");

    const reserva = new Reserva(datosReserva);
    const guardada = await reserva.save();

    console.log("Reserva creada con éxito.");
    console.log(`  _id:        ${guardada._id}`);
    console.log(`  Estudiante: ${guardada.estudiante}`);
    console.log(`  Email:      ${guardada.email}`);
    console.log(`  Sala:       ${guardada.sala}`);
    console.log(`  Fecha:      ${guardada.fecha}`);
    console.log(`  Turno:      ${guardada.turno}`);
    console.log(`  Personas:   ${guardada.personas}`);
  } catch (error) {
    if (error.name === "ValidationError") {
      console.error("Error de validación al crear la reserva:");
      for (const campo of Object.keys(error.errors)) {
        console.error(`  ${campo}: ${error.errors[campo].message}`);
      }
    } else {
      console.error("Error al crear la reserva:");
      console.error(`  Nombre: ${error.name}`);
      console.error(`  Mensaje: ${error.message}`);
    }
    process.exit(1);
  } finally {
    await desconectar();
  }
}

main();
