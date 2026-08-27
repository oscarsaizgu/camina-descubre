// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/pondra.gpx';

var puntosInteres = [
    // Sin puntos de interés por ahora.
    // Para añadir uno, copia esta línea y rellena los datos:
    // { coords: [latitud, longitud], nombre: "Nombre del sitio", foto: "fotos/nombre.jpg" },
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

var elevacion = crearElevacion('#grafico-elevacion');
elevacion.addTo(mapa);
elevacion.load(GPX);

cargarTrack(mapa, GPX, 0.1);

crearLightbox();
crearMarcadores(mapa, puntosInteres);
