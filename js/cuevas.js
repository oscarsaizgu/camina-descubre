// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/cuevas.gpx';

// Los puntos pueden tener foto, streetview, o ambos a null
var puntosInteres = [
    { coords: [43.244719, -3.454010], nombre: "Mirador de Covalanas",  foto: "fotos/mirador.jpg",   streetview: null },
    { coords: [43.245467, -3.452144], nombre: "Cueva de Covalanas",    foto: "fotos/covalanas.jpg", streetview: null },
    { coords: [43.245171, -3.452452], nombre: "Cueva del Mirón",       foto: "fotos/miron.jpg",     streetview: null },
    { coords: [43.244278, -3.450562], nombre: "Cueva de la Luz",       foto: "fotos/luz.jpg",       streetview: null },
    { coords: [43.248049, -3.456690], nombre: "Cueva el Haza",         foto: "fotos/haza.jpg",      streetview: null },
    { coords: [43.255676, -3.458022], nombre: "Cueva de Cullalvera",   foto: "fotos/cullalvera.jpg",streetview: null },
    { coords: [43.243676959842375, -3.4515943412797148], nombre: "Mirador Pared del Eco", foto: null,
      streetview: "https://www.google.com/maps/embed?pb=!4v1786105827670!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHlqZUhfQ2c.!2m2!1d43.24362767947232!2d-3.451567598630545!3f102.16397789636218!4f0!5f0.7820865974627469" },
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

var elevacion = crearElevacion('#grafico-elevacion');
elevacion.addTo(mapa);
elevacion.load(GPX);

// Esta ruta no limita el zoom máximo (usarMaxBounds = false)
cargarTrack(mapa, GPX, 1, false);

crearLightboxConStreetView();
crearMarcadoresConStreetView(mapa, puntosInteres);
