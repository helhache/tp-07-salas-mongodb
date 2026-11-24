const { conectar, desconectar } = require("../src/config/base-datos");

async function main() {
  try {
    const conexion = await conectar();
    console.log("Conexión exitosa a MongoDB Atlas.");
    console.log(`Base de datos: ${conexion.name}`);
    console.log(`Host: ${conexion.host}`);
  } catch (error) {
    console.error("Error al conectar a MongoDB:");
    console.error(`  Nombre: ${error.name}`);
    console.error(`  Mensaje: ${error.message}`);

    if (error.cause) {
      const causa = error.cause;
      if (causa.code) {
        console.error(`  Código: ${causa.code}`);
      }
      if (causa.syscall) {
        console.error(`  Operación: ${causa.syscall}`);
      }
      if (causa.hostname) {
        console.error(`  Servidor: ${causa.hostname}`);
      }
    }

    process.exit(1);
  } finally {
    await desconectar();
  }
}

main();
