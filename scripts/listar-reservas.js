const { conectar, desconectar } = require("../src/config/base-datos");
const Reserva = require("../src/modelos/reserva");

async function main() {
  try {
    await conectar();
    console.log("Conexión establecida.");

    const reservas = await Reserva.find();
    console.log(`\nCantidad de reservas: ${reservas.length}\n`);

    if (reservas.length === 0) {
      console.log("La colección está vacía.");
    } else {
      for (const reserva of reservas) {
        console.log(`  _id: ${reserva._id}`);
        console.log(`    Estudiante: ${reserva.estudiante}`);
        console.log(`    Email:      ${reserva.email}`);
        console.log(`    Sala:       ${reserva.sala}`);
        console.log(`    Fecha:      ${reserva.fecha}`);
        console.log(`    Turno:      ${reserva.turno}`);
        console.log(`    Personas:   ${reserva.personas}`);
        console.log("");
      }
    }
  } catch (error) {
    console.error("Error al listar reservas:");
    console.error(`  Nombre: ${error.name}`);
    console.error(`  Mensaje: ${error.message}`);
    process.exit(1);
  } finally {
    await desconectar();
  }
}

main();
