# Trabajo práctico 07

Persistencia inicial de reservas de salas con MongoDB y Mongoose.

## Punto de partida

Copia funcional del TP 06 (`tp-06-salas-modular`). Se conserva intacta la aplicación Express con rutas, controladores, servicio en memoria, middleware, vistas y recursos. Se agrega un laboratorio de persistencia con configuración, conexión, modelo y scripts de creación y consulta.

## Versiones utilizadas

- Node.js v22.x
- Express 5.x
- Mongoose 8.x
- MongoDB Atlas Free (M0)

## Instalación y ejecución

```bash
npm install
```

### Preparar el entorno

1. Crear un clúster gratuito Free (M0) en [MongoDB Atlas](https://cloud.mongodb.com/).
2. Crear un usuario de base de datos con permisos de lectura y escritura.
3. Agregar la IP actual a la lista de acceso (o `0.0.0.0/0` para desarrollo).
4. Copiar la URI de conexión para Node.js que ofrece Atlas.
5. Copiar la plantilla de entorno y completar los datos reales:

```bash
cp .env.example .env
```

Editar `.env` reemplazando `USUARIO`, `CLAVE` y `HOST` por los valores del clúster. Conservar las opciones de la URI (`retryWrites=true&w=majority`).

### Arrancar el sitio web (memoria)

```bash
npm start
```

El servidor inicia en `http://localhost:3000`. Las rutas web operan con datos en memoria cargados desde `datos/reservas.json`. Las reservas del laboratorio MongoDB no aparecen en las vistas; eso se abordará en la unidad 8 cuando se migre el servicio HTTP a promesas.

Para usar variables de entorno desde `.env`:

```bash
npm run start:local
```

### Scripts de base de datos

Todos requieren `MONGODB_URI` definida en `.env`:

```bash
node --env-file=.env scripts/comprobar-conexion.js
node --env-file=.env scripts/crear-reserva.js
node --env-file=.env scripts/listar-reservas.js
```

O con los atajos del manifiesto:

```bash
npm run conexion
npm run crear
npm run listar
```

## Diagnóstico DNS

Se configuran los resolutores DNS de Google (`8.8.8.8`) y Cloudflare (`1.1.1.1`) en `src/config/base-datos.js` mediante `dns.setServers()` antes de conectar. Esto resuelve problemas de resolución SRV/TXT que Node.js puede tener con ciertos proveedores de Internet. Solo afecta la resolución DNS dentro del proceso de Node.js, no la del sistema operativo ni la autenticación.

## Mapa de archivos

```
tp-07-salas-mongodb/
  src/
    config/
      entorno.js              Configuración de puerto, entorno y URI de MongoDB
      base-datos.js           Conexión y desconexión con DNS corregido
    modelos/
      reserva.js              Esquema y modelo Mongoose para la colección reservas
    controladores/reservas.js Renderiza vistas, responde JSON, redirige
    middleware/
      solicitudes.js          ID de solicitud y medición de duración
      reservas.js             Sección y validación del formulario
    rutas/reservas.js         Relaciona método/camino con middleware y controlador
    servicios/reservas.js     Listar, buscar, contar y crear reservas en memoria
    app.js                    Configura Express, pipeline y monta rutas
    index.js                  Lee config, carga JSON, crea servicio y app, escucha
  scripts/
    comprobar-conexion.js     Prueba de conexión a Atlas sin crear datos
    crear-reserva.js          Crea una reserva válida y muestra el _id confirmado
    listar-reservas.js        Lista todas las reservas con _id y campos
  datos/reservas.json         Datos iniciales para el servicio en memoria
  views/                      Plantillas EJS
  public/css/estilos.css      Hoja de estilos
  .env.example                Plantilla de entorno sin secretos
  .gitignore
  eslint.config.js
  package.json
  package-lock.json
```

## Esquema, modelo y colección

El modelo `Reserva` se define en `src/modelos/reserva.js` y se asocia explícitamente a la colección `reservas` en la base `reservas_salas_u7`. Mongoose genera un `_id` de tipo ObjectId para cada documento; no se usan IDs consecutivos con reduce.

Un `_id` asignado a un objeto en memoria no demuestra una escritura en la base: el ObjectId se genera localmente antes de enviar el documento al servidor. Solo después de que `.save()` resuelve su promesa sin error se confirma que MongoDB aceptó la escritura.

### Campos y reglas

| Campo      | Tipo   | Regla                                                     |
|------------|--------|-----------------------------------------------------------|
| estudiante | String | Obligatorio, trim                                         |
| email      | String | Obligatorio, trim, debe contener `@` (match: `/@/`)      |
| sala       | String | Obligatorio, enum: Sala Norte, Sala Sur, Sala Multimedia  |
| fecha      | String | Obligatorio, trim, no vacío                               |
| turno      | String | Obligatorio, enum: Mañana, Tarde, Noche                   |
| personas   | Number | Obligatorio, entero (validate), min 1, max 6              |

### Límites no controlados

No se valida formato completo de email, fechas imposibles o pasadas, solapamiento de horarios, cupos compartidos ni reservas duplicadas. No hay índice único ni regla de fecha futura.

## Separación memoria / base de datos

El sitio Express sigue operando con el arreglo en memoria del TP 06. Las reservas persistentes se crean y consultan desde los scripts de terminal, que conectan a MongoDB Atlas. Esta separación se mantiene porque los controladores actuales usan funciones síncronas del servicio; migrarlos a promesas (para usar `await` con Mongoose) se abordará en la unidad 8.

## Calidad

```bash
npm run format       # Aplica formato con Prettier a src/ y scripts/
npm run format:check # Verifica formato sin modificar
npm run lint         # Ejecuta ESLint sobre src/ y scripts/
npm run check        # Ejecuta format:check y lint juntos
```

## Matriz de pruebas

| Caso                                     | Resultado esperado                              |
|------------------------------------------|-------------------------------------------------|
| Conexión válida                          | Confirmación y proceso terminado                |
| Variable vacía                           | Fallo de configuración; sin mensaje de éxito    |
| Contraseña incorrecta temporal en .env   | Fallo de autenticación; sin crear documentos    |
| Colección vacía                          | Listado de cantidad 0, sin error                |
| Reserva válida                           | Se guarda y devuelve _id                        |
| Consulta desde proceso nuevo             | Recupera ese _id                                |
| Segunda consulta                         | No agrega registros                             |
| Estudiante vacío                         | Rechazo, cantidad sin cambios                   |
| Email sin @                              | Rechazo, cantidad sin cambios                   |
| Sala o turno no permitido                | Rechazo, cantidad sin cambios                   |
| Fecha vacía                              | Rechazo, cantidad sin cambios                   |
| Personas 0, 7 y 2.5                      | Rechazo, cantidad sin cambios                   |
| Personas con texto no numérico           | Rechazo de conversión, sin escritura            |

Ejecutar dos veces `crear-reserva.js` genera dos documentos distintos aunque tengan los mismos campos, ya que cada uno recibe un `_id` diferente.

## Evidencia de persistencia

1. Ejecutar `npm run listar` y anotar la cantidad inicial.
2. Ejecutar `npm run crear` y guardar el `_id` que devuelve.
3. Ejecutar `npm run listar` desde un nuevo proceso y comprobar que aparece ese `_id` y la cantidad creció en uno.
4. Ejecutar `npm run listar` una vez más; sin otras escrituras, la cantidad permanece igual.

## Seguridad

- `.env` no se versiona; contiene la URI con credenciales reales.
- `.env.example` se versiona con marcadores sin secretos.
- No se publican `node_modules`, `.env` ni credenciales.
- Los mensajes de error no imprimen la URI completa.
