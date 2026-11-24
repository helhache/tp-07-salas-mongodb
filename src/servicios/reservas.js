function crearServicioReservas(datosIniciales) {
  const reservas = [...datosIniciales];
  let siguienteId = datosIniciales.length + 1;

  return {
    listar() {
      return [...reservas];
    },
    buscar(id) {
      return reservas.find((r) => r.id === id) || null;
    },
    contar() {
      return reservas.length;
    },
    crear(datos) {
      const nueva = { id: siguienteId++, ...datos };
      reservas.push(nueva);
      return nueva;
    },
  };
}

module.exports = { crearServicioReservas };
