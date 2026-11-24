function cargarConfiguracion() {
  let puerto = 3000;

  if (process.env.PORT !== undefined && process.env.PORT !== "") {
    puerto = Number(process.env.PORT);
    if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
      console.error(
        `Puerto inválido: "${process.env.PORT}". Debe ser un número entero entre 1 y 65535.`,
      );
      process.exit(1);
    }
  }

  const entorno = process.env.NODE_ENV || "development";
  const formatoMorgan = entorno === "production" ? "combined" : "dev";

  return { puerto, entorno, formatoMorgan };
}

function cargarUriMongo() {
  const uri = process.env.MONGODB_URI || "";

  if (!uri) {
    return null;
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error("MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://");
    process.exit(1);
  }

  return uri;
}

module.exports = { cargarConfiguracion, cargarUriMongo };
