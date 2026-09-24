// ====================================================
// DATOS DE ESTA RUTA — lo único que hay que editar aquí
// ====================================================

var GPX = 'data/cuevas.gpx';

var puntosInteres = [
    {
        coords: [43.244719, -3.454010],
        nombre: "Mirador de Covalanas",
        foto: "fotos/cuevas/mirador.jpg",
        streetview: null,
        categoria: "Mirador",
        descripcion: "Mirador situado junto al aparcamiento de la cueva de Covalanas, en el Camino Real. Ofrece una panorámica hacia el valle de Ruesga y Ramales, dominada por la silueta piramidal del Pico San Vicente.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.245467, -3.452144],
        nombre: "Cueva de Covalanas",
        foto: "fotos/cuevas/covalanas.jpg",
        streetview: null,
        categoria: "Cueva prehistórica · Patrimonio UNESCO",
        descripcion: "Frente al Pico de San Vicente se localiza Covalanas, conocida como «cueva de las ciervas rojas», declarada Patrimonio de la Humanidad por la Unesco en 2008. Se trata de una cavidad estrecha y de dimensiones reducidas (65 m) que alberga representaciones rupestres de hace unos 22.000 años (hacia el 20.000 a.C.). Las 18 ciervas, el ciervo, el uro y el caballo presentan un buen estado de conservación y belleza. Sus figuras están dotadas de gran realismo y movilidad gracias a su color rojizo, a la técnica de dibujo utilizada, «tamponado», y a su concentración en áreas bien delimitadas de la roca para resaltar y dar volumen. Una visita inolvidable que nos sumerge en el pasado.",
        historia: null,
        informacionPractica: "Localización: En el Monte Pando. A 2,5 km de Ramales, en dirección a Burgos, encontramos el parking. Desde aquí hay que andar 15 minutos. Grupos máximos: 7-8 personas. Imprescindible reservar. Información y reservas: 942 598 425. Más información: Cuevas Cultura Cantabria. Email: reservascuevas@culturadecantabria.es.",
        enlaceOficial: "https://cuevas.culturadecantabria.com"
    },
    {
        coords: [43.245171, -3.452452],
        nombre: "Cueva del Mirón",
        foto: "fotos/cuevas/miron.jpg",
        streetview: null,
        categoria: "Yacimiento arqueológico · BIC",
        descripcion: "Yacimiento con una secuencia de ocupación humana de unos 40.000 años, desde el Musteriense hasta la Edad del Bronce. En él se halló la Dama Roja del Mirón, el primer enterramiento humano completo del Magdaleniense documentado en la Península Ibérica: una mujer de entre 35 y 40 años, enterrada hace unos 18.700 años y cubierta de ocre rojo, junto a una pared con grabados.",
        historia: "Excavado desde 1996 por un equipo dirigido por Lawrence G. Straus (Universidad de Nuevo México) y Manuel González Morales (Universidad de Cantabria).",
        informacionPractica: "La cueva no está abierta al público. Es un yacimiento activo de investigación arqueológica.",
        enlaceOficial: null
    },
    {
        coords: [43.244278, -3.450562],
        nombre: "Cueva de la Luz",
        foto: "fotos/cuevas/luz.jpg",
        streetview: null,
        categoria: "Cueva",
        descripcion: "Cavidad de pequeño desarrollo en el valle del Calera, cerca de su confluencia con el Asón. Conserva grabados paleolíticos, entre ellos los cuartos traseros de un caballo. Forma parte de la Zona Arqueológica de Ramales, declarada Bien de Interés Cultural en 2006.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.248049, -3.456690],
        nombre: "Cueva el Haza",
        foto: "fotos/cuevas/haza.jpg",
        streetview: null,
        categoria: "Cueva",
        descripcion: "Pequeña cueva muy próxima a Covalanas, con pinturas rupestres paleolíticas en las que se representan caballos. Forma parte de la Zona Arqueológica de Ramales (BIC, 2006). No es visitable.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.255676, -3.458022],
        nombre: "Cueva de Cullalvera",
        foto: "fotos/cuevas/cullalvera.jpg",
        streetview: null,
        categoria: "Cueva prehistórica",
        descripcion: "Cavidad kárstica de grandes dimensiones declarada Bien de Interés Cultural. En momentos de fuertes lluvias funciona como una surgencia, donde la acción del agua sobre la roca y el paso del tiempo han configurado una cueva mágica. La espectacular boca de la entrada, inmersa en un frondoso encinar cantábrico de gran valor ecológico, nos abre las puertas a asombrosas formaciones geológicas, arte rupestre a centenares de metros de profundidad (no visitables) y a un escenario donde la historia se dio cita con enfrentamientos durante la Guerra Civil. Todo ello hace de su visita una experiencia emocionante.",
        historia: null,
        informacionPractica: "Localización: En el centro de Ramales. Grupos máximos: 30 personas. Accesibilidad: Acondicionada para personas con discapacidad. Información y reservas: 942 598 425. Más información: Cuevas Cultura Cantabria. Email: reservascuevas@culturadecantabria.es.",
        enlaceOficial: "https://cuevas.culturadecantabria.com"
    },
    {
        coords: [43.243676959842375, -3.4515943412797148],
        nombre: "Mirador Pared del Eco",
        foto: "fotos/cuevas/mirador.jpg",
        streetview: "https://www.google.com/maps/embed?pb=!4v1786105827670!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHlqZUhfQ2c.!2m2!1d43.24362767947232!2d-3.451567598630545!3f102.16397789636218!4f0!5f0.7820865974627469",
        categoria: "Formación geológica · Mirador",
        descripcion: "Pared de roca caliza cercana al aparcamiento de Covalanas, conocida como zona de escalada deportiva. Cuenta con más de cuarenta vías, de dificultad media-alta a muy alta (6b–8c).",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    }
];

// ====================================================
// Inicialización — no editar
// ====================================================

if (!window.MODO_SEGUIR) {
    inicializarRuta({ gpx: GPX, pad: 1, maxBounds: false });
}
