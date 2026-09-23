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
        descripcion: "Punto elevado con vistas sobre el valle del Asón y la entrada al complejo de cuevas prehistóricas de Ramales. Desde aquí se distinguen los farallones kársticos que albergan las cuevas de Covalanas y El Mirón.",
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
        descripcion: "Frente al Pico de San Vicente se localiza Covalanas, conocida como «cueva de las ciervas rojas», declarada Patrimonio de la Humanidad por la Unesco en 2008. Se trata de una cavidad estrecha y de dimensiones reducidas (65 m) que alberga representaciones rupestres de hace más de 25.000 años (Paleolítico superior). Las 18 ciervas, el ciervo, el uro y el caballo presentan un buen estado de conservación y belleza. Sus figuras están dotadas de gran realismo y movilidad gracias a su color rojizo, a la técnica de dibujo utilizada, «tamponado», y a su concentración en áreas bien delimitadas de la roca para resaltar y dar volumen. Una visita inolvidable que nos sumerge en el pasado.",
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
        descripcion: "Yacimiento de excepcional importancia que alberga el primer enterramiento magdaleniense documentado en la Península Ibérica. La 'Dama del Mirón', fragmentos de una joven cubierta de ocre rojo con más de 18.500 años de antigüedad, es uno de los hallazgos más significativos del Paleolítico europeo.",
        historia: "Declarada Bien de Interés Cultural (BIC) en 2006. Las excavaciones dirigidas por Lawrence Straus y Manuel González Morales desde 1996 han revelado una secuencia de ocupación humana de más de 40.000 años. El enterramiento estaba asociado a grabados en la roca y cubierto de ocre rojo, un ritual único en la Península Ibérica.",
        informacionPractica: "La cueva no está abierta al público. Es un yacimiento activo de investigación arqueológica.",
        enlaceOficial: null
    },
    {
        coords: [43.244278, -3.450562],
        nombre: "Cueva de la Luz",
        foto: "fotos/cuevas/luz.jpg",
        streetview: null,
        categoria: "Cueva",
        descripcion: "Cavidad kárstica integrada en el rico conjunto espeleológico del macizo del Asón, en los alrededores de Ramales de la Victoria.",
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
        descripcion: "Cavidad kárstica del entorno de Ramales de la Victoria, integrada en el conjunto espeleológico del macizo kárstico del Asón.",
        historia: null,
        informacionPractica: null,
        enlaceOficial: null
    },
    {
        coords: [43.255676, -3.458022],
        nombre: "Cueva de Cullalvera",
        foto: "fotos/cuevas/cullalvera.jpg",
        streetview: null,
        categoria: "Cueva prehistórica · Patrimonio UNESCO",
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
        descripcion: "Imponente pared de roca caliza que cierra el valle del río Calera. Recibe su nombre por el eco que producen los sonidos al rebotar en su vertical superficie. Es también una conocida zona de escalada deportiva con rutas de distintos niveles.",
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
