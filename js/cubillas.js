// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/cubillas.gpx';

var puntosInteres = [
    { coords: [43.26362180926293, -3.4614135044247236], nombre: "Puente de madera",     foto: "fotos/puente.jpg" },
    { coords: [43.264984830307064, -3.458112289614538], nombre: "Parque de Cubillas",   foto: "fotos/parquecubillas.jpg" },
    { coords: [43.266546944938824, -3.455966820850918], nombre: "Pump track de Cubillas", foto: "fotos/pumptrack.jpeg" },
    { coords: [43.26458650397139, -3.4596487965668645], nombre: "Campo de fútbol",      foto: "fotos/campofutbol.jpg" },
    { coords: [43.26529409062337, -3.458398512298079],  nombre: "Piscina Municipal",    foto: "fotos/piscina.jpg" },
];

// ====================================================
// A partir de aquí no hay que tocar nada
// ====================================================

var mapa = inicializarMapaRuta();

var elevacion = crearElevacion('#grafico-elevacion');
elevacion.addTo(mapa);
elevacion.load(GPX);

cargarTrack(mapa, GPX, 1);

crearLightbox();
crearMarcadores(mapa, puntosInteres);
