const dns = require("node:dns");
const mongoose = require("mongoose");
const { cargarUriMongo } = require("./entorno");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectar() {
  const uri = cargarUriMongo();

  if (!uri) {
    throw new Error(
      "La variable MONGODB_URI no está definida. Revisar el archivo .env.",
    );
  }

  await mongoose.connect(uri);
  return mongoose.connection;
}

async function desconectar() {
  await mongoose.disconnect();
}

module.exports = { conectar, desconectar };
