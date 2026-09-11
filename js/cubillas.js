// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/cubillas.gpx';

var puntosInteres = [
    {
        coords: [43.26362180926293, -3.4614135044247236],
        nombre: "Puente de madera",
        foto: "fotos/cubillas/puente.jpg",
        categoria: "Infraestructura",
        descripcion: "Pasarela de madera que cruza el arroyo Cubillas, conectando los distintos espacios recreativos del barrio. Un punto agradable del recorrido donde el sonido del agua acompaña la caminata.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.264984830307064, -3.458112289614538],
        nombre: "Parque de Cubillas",
        foto: "fotos/cubillas/parquecubillas.jpg",
        categoria: "Parque",
        descripcion: "Parque público del barrio de Cubillas, con zonas verdes y espacios de ocio al aire libre junto al arroyo. Punto de encuentro habitual para vecinos y familias del municipio.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.266546944938824, -3.455966820850918],
        nombre: "Pump track de Cubillas",
        foto: "fotos/cubillas/pumptrack.jpeg",
        categoria: "Instalación deportiva",
        descripcion: "Circuito de pump track para bicicletas de montaña y BMX, con ondulaciones diseñadas para mantener la velocidad sin pedalear. Una instalación pensada para los jóvenes del municipio que practican deportes sobre ruedas.",
        historia: null,
        informacionPractica: "Acceso libre. Recomendado casco y protecciones.",
        enlaceOficial: null
    },
    {
        coords: [43.26458650397139, -3.4596487965668645],
        nombre: "Campo de fútbol",
        foto: "fotos/cubillas/campofutbol.jpg",
        categoria: "Instalación deportiva",
        descripcion: "Campo de fútbol del barrio de Cubillas, utilizado por el equipo local y para actividades deportivas municipales. Punto de referencia deportiva del municipio.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.26529409062337, -3.458398512298079],
        nombre: "Piscina Municipal",
        foto: "fotos/cubillas/piscina.jpg",
        categoria: "Instalación deportiva",
        descripcion: "Piscina municipal de Ramales de la Victoria en el barrio de Cubillas. El principal espacio de baño del municipio durante los meses de verano, con zona de baño y áreas de descanso.",
        historia: null,
        informacionPractica: "Apertura temporal en verano. Consultar horarios y precios en el Ayuntamiento de Ramales de la Victoria.",
        enlaceOficial: null
    }
];

// ====================================================
// Inicialización — no editar
// ====================================================

if (!window.MODO_SEGUIR) {
    inicializarRuta({ gpx: GPX, pad: 1 });
}
