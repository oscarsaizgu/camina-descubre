// ============================================================
// js/datos-rutas.js
// CATÁLOGO CENTRAL DE TODAS LAS RUTAS
// ============================================================
//
// ¿QUÉ ES ESTE ARCHIVO?
//   Es la única fuente de verdad de toda la aplicación.
//   Aquí se definen los datos de CADA ruta: nombre, distancia,
//   descripción, servicios, fotos, puntos de interés, etc.
//
// ¿CUÁNDO LO TOCO YO?
//   Cada vez que quieras cambiar algo de una ruta:
//   un texto, una foto, un dato de distancia, un servicio...
//   Todo está aquí, organizado por ruta.
//
// ¿QUÉ NO DEBO TOCAR?
//   La estructura del objeto (las llaves, los corchetes, las comas).
//   Si mueves una llave o borras una coma, el código dejará de funcionar.
//   Modifica solo los VALORES (lo que está entre comillas).
//
// CÓMO AÑADIR UNA RUTA NUEVA:
//   1. Copia el bloque de una ruta existente (desde "nombreId: {" hasta su "}" de cierre).
//   2. Pégalo al final del objeto RUTAS, antes del último "};".
//   3. Cambia el id y todos los datos.
//   4. Añade el id al array RUTAS_ORDEN al final de este archivo.
//   5. Pon visibleEnMapa: true si quieres que aparezca en la portada.
// ============================================================


// El objeto RUTAS contiene una entrada por cada ruta, identificada por su "id".
// Ejemplo: RUTAS['cuevas'] devuelve todos los datos de la Ruta de las Cuevas.
var RUTAS = {


    // ──────────────────────────────────────────────────────────────────
    // RUTA: CUEVAS
    // Página de la ruta: ruta.html?id=cuevas
    // ──────────────────────────────────────────────────────────────────
    cuevas: {

        // ── Identificación ──────────────────────────────────────────
        id: 'cuevas',                        // Identificador único. NO cambiar: se usa en la URL.
        nombre: 'Ruta de las Cuevas',        // Nombre completo que aparece en el encabezado y el mapa.
        color: '#2d4a35',                     // Color del trazado en el mapa de portada (verde oscuro).
        gpx: 'data/cuevas.gpx',             // Archivo GPX con el recorrido GPS de la ruta.
        visibleEnMapa: true,                  // true → aparece en el mapa de portada; false → oculta.
        dashArray: null,                      // null → línea continua; '8, 8' → línea discontinua.

        // ── Datos resumen (los 4 iconos bajo el mapa) ───────────────
        distancia: '6 km',                   // Distancia total.
        duracion: '1h',                      // Duración estimada.
        desnivel: '254m',                    // Desnivel acumulado (subida + bajada).
        tipo: 'Lineal',                      // Tipo: Circular, Lineal, Ida y vuelta.
        dificultad: 'Moderada',              // Nivel de dificultad (aparece en el popup del mapa).

        // ── Descripción ─────────────────────────────────────────────
        // Cada texto entre comillas es un párrafo independiente.
        // Para añadir más párrafos, escribe más cadenas separadas por comas.
        descripcion: [
            'Desde el Ayuntamiento, tomamos la N-629 en dirección al Puerto de Los Tornos. A 300 metros, tras pasar el cuartel de la Guardia Civil, giramos a la izquierda por una carretera que pronto se convierte en un sendero que discurre por un encinar cantábrico. El camino bordea una imponente pared vertical de roca caliza, donde empieza la via ferrata El Cáliz.',
            'Llegamos al aparcamiento, desde donde un sendero asciende hasta el Mirador de Covalanas, con vistas espectaculares al pueblo de Ramales, el Pico San Vicente y la Sierra del Hornijo. Continuando el ascenso, alcanzamos la entrada de la Cueva de Covalanas, decorada con pinturas rupestres de ciervas de hace más de 20.000 años. Justo debajo, la Cueva del Mirón completa este núcleo arqueológico excepcional.',
            'Siguiendo el recorrido, llegamos a la Cueva de la Luz, antes de retomar el descenso, donde unas escaleras nos llevan hasta la Cueva el Haza, una ventana natural abierta al Pico San Vicente. El recorrido culmina en la Cueva de Cullalvera, cuya monumental entrada es uno de los rincones más impresionantes de la ruta. Desde aquí regresamos al Ayuntamiento, cerrando el círculo.'
        ],

        // ── Servicios e instalaciones ────────────────────────────────
        // Cada servicio tiene un icono (ruta al archivo .png) y un texto.
        // Para añadir un servicio: añade un { icono: '...', texto: '...' } al array.
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Cueva.png',                texto: 'Cueva' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Restaurante.png',          texto: 'Restaurante' }
        ],

        // ── Imágenes decorativas (pinturas/ilustraciones) ────────────
        // El campo "style" permite posiciones y tamaños personalizados.
        // Si está vacío (''), se aplican los estilos por defecto del CSS.
        // Puedes sobrescribirlos desde el CSS con: body[data-ruta="cuevas"] #pinturas img { ... }
        pinturas: [
            { src: 'iconos/Cierva.png', alt: 'Cierva rupestre', style: '' },
            { src: 'iconos/Uro.png',    alt: 'Uro rupestre',    style: '' }
        ],

        // ── Puntos de interés (marcadores en el mapa) ────────────────
        // coords: [latitud, longitud] — son números, sin comillas.
        // foto: ruta a la imagen que aparece en el lightbox. null si no hay foto.
        // streetview: URL de Google Maps en modo embed para mostrar Street View. null si no hay.
        puntosInteres: [
            { coords: [43.244719, -3.454010],                   nombre: 'Mirador de Covalanas',   foto: 'fotos/mirador.jpg',    streetview: null },
            { coords: [43.245467, -3.452144],                   nombre: 'Cueva de Covalanas',     foto: 'fotos/covalanas.jpg',  streetview: null },
            { coords: [43.245171, -3.452452],                   nombre: 'Cueva del Mirón',        foto: 'fotos/miron.jpg',      streetview: null },
            { coords: [43.244278, -3.450562],                   nombre: 'Cueva de la Luz',        foto: 'fotos/luz.jpg',        streetview: null },
            { coords: [43.248049, -3.456690],                   nombre: 'Cueva el Haza',          foto: 'fotos/haza.jpg',       streetview: null },
            { coords: [43.255676, -3.458022],                   nombre: 'Cueva de Cullalvera',    foto: 'fotos/cullalvera.jpg', streetview: null },
            { coords: [43.243676959842375, -3.4515943412797148], nombre: 'Mirador Pared del Eco', foto: null,
              streetview: 'https://www.google.com/maps/embed?pb=!4v1786105827670!6m8!1m7!1sCAoSFkNJSE0wb2dLRUlDQWdJRHlqZUhfQ2c.!2m2!1d43.24362767947232!2d-3.451567598630545!3f102.16397789636218!4f0!5f0.7820865974627469' }
        ],

        // null = ruta simple de un solo recorrido. Ver "guardamino" para ejemplo con variantes.
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: CUBILLAS
    // Página de la ruta: ruta.html?id=cubillas
    // ──────────────────────────────────────────────────────────────────
    cubillas: {
        id: 'cubillas',
        nombre: 'Paseo de Cubillas',
        color: '#8B4513',
        gpx: 'data/cubillas.gpx',
        visibleEnMapa: true,
        dashArray: null,
        distancia: '4 km',
        duracion: '45 min',
        desnivel: '23m',
        tipo: 'Circular',
        dificultad: 'Fácil',
        descripcion: [
            'Empezamos la ruta en la plaza Duques de la Victoria, dirigiéndonos por la N-629 hasta el cruce con la carretera de Arredondo (CA-261) que tomaremos a la izquierda, seguidamente giramos a la derecha por la calle estrecha que pasa detrás de la casa amarilla. A partir de ahí, continuamos por una senda peatonal, cruzaremos un puente de madera que nos llevará a rodear una zona con varias instalaciones deportivas y zonas ajardinadas. Regresando de nuevo al puente volveremos por el mismo camino hasta la carretera general donde cogemos, de frente, por la calle Manuel González Peral para finalizar el recorrido en el punto de inicio.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Parque infantil.png',       texto: 'Parque infantil' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        pinturas: [
            { src: 'iconos/cubillas.png', alt: 'Cubillas', style: '' }
        ],
        puntosInteres: [
            { coords: [43.26362180926293,  -3.4614135044247236], nombre: 'Puente de madera',      foto: 'fotos/puente.jpg',         streetview: null },
            { coords: [43.264984830307064, -3.458112289614538],  nombre: 'Parque de Cubillas',    foto: 'fotos/parquecubillas.jpg', streetview: null },
            { coords: [43.266546944938824, -3.455966820850918],  nombre: 'Pump track de Cubillas', foto: 'fotos/pumptrack.jpeg',    streetview: null },
            { coords: [43.26458650397139,  -3.4596487965668645], nombre: 'Campo de fútbol',       foto: 'fotos/campofutbol.jpg',    streetview: null },
            { coords: [43.26529409062337,  -3.458398512298079],  nombre: 'Piscina Municipal',     foto: 'fotos/piscina.jpg',        streetview: null }
        ],
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: VEGA (Vegacorredor)
    // Página de la ruta: ruta.html?id=vega
    // ──────────────────────────────────────────────────────────────────
    vega: {
        id: 'vega',
        nombre: 'Paseo de Vegacorredor',
        color: '#1a5f7a',
        gpx: 'data/vega.gpx',
        visibleEnMapa: true,
        dashArray: null,
        distancia: '7 km',
        duracion: '1h 30min',
        desnivel: '58m',
        tipo: 'Circular',
        dificultad: 'Fácil',
        descripcion: [
            'Empezando la ruta en la plaza Duques de la Victoria, por detrás de la iglesia cogemos la calle Manuel Marure que nos llevará a Entrepuentes, zona donde se unen el río Asón y su principal afluente, el río Gándara. Aquí encontraremos un antiguo puente medieval, un molino (ahora propiedad privada) y la presa Don Cecilio. Siguiendo la carretera atravesaremos una zona ajardinada y área recreativa que nos lleva al Bº Vegacorredor. Una vez aquí subimos por la carretera de la izquierda en dirección al Bº Helguero, el cual atravesaremos y donde podremos visitar la Fuente Iseña, manantial que abastece Ramales. Siguiendo el camino regresaremos hasta el Humilladero Ánima de Iseña y desde aquí, volveremos por el mismo recorrido hasta la plaza.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Parque infantil.png',       texto: 'Parque infantil' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        // Las imágenes de Vega tienen posiciones personalizadas definidas aquí en "style".
        // Para cambiarlas sin tocar este archivo, usa el CSS con:
        //   body[data-ruta="vega"] #pinturas img:first-child { ... }
        pinturas: [
            { src: 'iconos/vega1.png', alt: 'vega1',
              style: 'position:absolute !important; width:12rem !important; top:-2rem !important; left:11rem !important; transform:translateX(-50%); opacity:0.6;' },
            { src: 'iconos/vega2.png', alt: 'vega2',
              style: 'position:absolute !important; width:12rem !important; top:-2rem !important; left:0rem !important; transform:translateX(-50%); opacity:0.6;' }
        ],
        puntosInteres: [
            { coords: [43.257757822382096, -3.469872258786685],  nombre: 'Puente Romano',           foto: 'fotos/puenteromano.jpg',  streetview: null },
            { coords: [43.255762810521176, -3.475972336495188],  nombre: 'Humilladero',             foto: 'fotos/humilladero.jpg',   streetview: null },
            { coords: [43.26165281811487,  -3.4842905538024946], nombre: 'Parque de Vegacorredor',  foto: 'fotos/parquevega.jpeg',   streetview: null },
            { coords: [43.25408574766927,  -3.48623600049769],   nombre: 'Fuente Iseña',            foto: 'fotos/fuenteisenia.jpg',  streetview: null },
            { coords: [43.25680519840663,  -3.470456579361322],  nombre: 'Presa Don Cecilio',       foto: 'fotos/presa.jpg',         streetview: null }
        ],
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: GUARDAMINO
    // Esta ruta tiene DOS variantes (principal y secundaria).
    // El campo "variantes" contiene los datos específicos de cada una.
    // Página de la ruta: ruta.html?id=guardamino
    // ──────────────────────────────────────────────────────────────────
    guardamino: {
        id: 'guardamino',
        nombre: 'Paseo de Guardamino',
        color: '#7a1a1a',
        gpx: 'data/guardamino.gpx',          // GPX de la variante principal (se usa en el mapa de portada).
        visibleEnMapa: true,
        dashArray: null,
        // Los datos de distancia/duración aquí corresponden a la variante A.
        // Cuando el usuario cambia a la variante B, se actualizan desde "variantes.b".
        distancia: '4,71 km',
        duracion: '60 min',
        desnivel: '146m',
        tipo: 'Circular',
        dificultad: 'Fácil',
        descripcion: [
            'Comenzamos la ruta en la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Sin desviarnos de la carretera, a 2,5 km del inicio llegamos a un cruce que tomamos a la izquierda, en dirección a la ermita de Nuestra Señora de Guardamino. A 300 m de la ermita encontramos otro cruce, también a la izquierda, que nos lleva a la zona más alta de la ruta, desde donde se divisa el pueblo de Ramales y todo el macizo del Pico San Vicente y la Sierra del Hornijo. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',     texto: 'Zona Picnic' },
            { icono: 'iconos/Apta para niños.png',    texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png', texto: 'Calzada compartida' },
            { icono: 'iconos/Restaurante.png',        texto: 'Restaurante' }
        ],
        pinturas: [
            { src: 'iconos/piedra.png',  alt: 'Piedra Carlista',    style: '' },
            { src: 'iconos/iglesia.png', alt: 'Iglesia Guardamino', style: '' }
        ],
        puntosInteres: [
            { coords: [43.26138646986801,  -3.455310394447993],  nombre: 'Monumento a La Batalla de Ramales',              foto: 'fotos/piedra.jpg',    streetview: null },
            { coords: [43.2620532187991,   -3.4450485940378512], nombre: 'Iglesia de Nuestra Señora, Parroquia de San Pedro', foto: 'fotos/iglesia.jpg', streetview: null },
            { coords: [43.256952100060936, -3.4629698197607337], nombre: 'Bolera Domingo Muguira',                         foto: 'fotos/bolera.jpg',    streetview: null },
            { coords: [43.25867491569154,  -3.450799765317839],  nombre: 'Camino secundario',                              foto: 'fotos/secundario.jpg', streetview: null }
        ],

        // ── Variantes ────────────────────────────────────────────────
        // Cuando "variantes" no es null, la página muestra dos botones para elegir recorrido.
        // Cada variante tiene: etiqueta (texto del botón), gpx, distancia, duracion,
        //                      desnivel, tipo y descripcion (solo una cadena, no array).
        variantes: {
            a: {
                etiqueta: 'Ruta principal',          // Texto del botón en la página.
                gpx: 'data/guardamino.gpx',
                distancia: '4,71 km',
                duracion: '60 min',
                desnivel: '146m',
                tipo: 'Circular',
                descripcion: 'Comenzamos la ruta en la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Sin desviarnos de la carretera, a 2,5 km del inicio llegamos a un cruce que tomamos a la izquierda, en dirección a la ermita de Nuestra Señora de Guardamino. A 300 m de la ermita encontramos otro cruce, también a la izquierda, que nos lleva a la zona más alta de la ruta, desde donde se divisa el pueblo de Ramales y todo el macizo del Pico San Vicente y la Sierra del Hornijo. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.'
            },
            b: {
                etiqueta: 'Ruta secundaria',
                gpx: 'data/guardaminob.gpx',
                distancia: '3,71 km',
                duracion: '50 min',
                desnivel: '127m',
                tipo: 'Circular',
                descripcion: 'Comenzamos la ruta en la bolera de pasabolo "Domingo Muguira" y tomamos la calle del barrio La Casa en dirección al Bº Guardamino. Antes del taller Madreselva, subimos por el monte hasta llegar a la Piedra Carlista. Siguiendo el camino llegamos al monumento a la batalla de Ramales, de la Primera Guerra Carlista. Desde aquí, continuamos por la carretera de la izquierda para volver, en 1 km, al punto de inicio.'
            }
        }
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: COTO CUENDE
    // Página de la ruta: ruta.html?id=coto
    // ──────────────────────────────────────────────────────────────────
    coto: {
        id: 'coto',
        nombre: 'Coto Cuende',
        color: '#6b4c9a',
        gpx: 'data/coto.gpx',
        visibleEnMapa: true,
        dashArray: null,
        distancia: '1,26 km',
        duracion: '15 min',
        desnivel: '42m',
        tipo: 'Ida y vuelta',
        dificultad: 'Fácil',
        descripcion: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis mollis lacus a molestie. Morbi venenatis ipsum auctor elit commodo placerat. In hac habitasse platea dictumst. Suspendisse potenti. Etiam tincidunt cursus ligula, tincidunt tristique ligula tincidunt ac. Vivamus et condimentum tellus. Curabitur mollis sapien eget lectus faucibus interdum. Cras et ultrices diam. Curabitur tincidunt eleifend sem, ut lobortis eros ultricies sit amet. Praesent fringilla auctor sagittis. Phasellus blandit interdum magna. Maecenas vestibulum porta metus eu euismod. Vestibulum consequat leo id eros auctor blandit. Praesent a dui magna. Quisque convallis justo ut est faucibus euismod.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Parque infantil.png',       texto: 'Parque infantil' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        pinturas: [
            { src: 'iconos/cubillas.png', alt: 'Cubillas', style: '' }
        ],
        puntosInteres: [
            { coords: [43.26362180926293,  -3.4614135044247236], nombre: 'Puente de madera',       foto: 'fotos/puente.jpg',         streetview: null },
            { coords: [43.264984830307064, -3.458112289614538],  nombre: 'Parque de Cubillas',     foto: 'fotos/parquecubillas.jpg', streetview: null },
            { coords: [43.266546944938824, -3.455966820850918],  nombre: 'Pump track de Cubillas', foto: 'fotos/pumptrack.jpg',      streetview: null }
        ],
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: DAMA ROJA
    // Página de la ruta: ruta.html?id=dama
    // ──────────────────────────────────────────────────────────────────
    dama: {
        id: 'dama',
        nombre: 'Dama Roja',
        color: '#b5651d',
        gpx: 'data/dama.gpx',
        visibleEnMapa: true,
        dashArray: null,
        distancia: '9,14 km',
        duracion: '2h',
        desnivel: '483m',
        tipo: 'Circular',
        dificultad: 'Moderada',
        descripcion: [
            'La ruta de la Dama Roja presenta un trazado circular que tiene su punto de inicio en el Centro de Recepción de Ramales de la Victoria. Se abandona la población dirección suroeste. El primer punto de referencia es la Cueva de Cullalvera, la cual se localiza muy próxima al trazado. A partir de este este punto, empieza el tramo más exigente de la ruta, el cual discurre junto a la Cueva del Agua, por un estrecho sendero ascendente rodeado de un bosque de encinar cantábrico. La cota máxima se localiza en la zona denominada Monte del Pando. El descenso, suave y prolongado conduce por el Monte del Yelso, La Pared, la Cueva de Covalanas (Patrimonio de la Humanidad), y por la ribera del río Calera hasta alcanzar de nuevo la localidad de Ramales de la Victoria.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Cueva.png',                texto: 'Cueva' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        // Una sola imagen con posición personalizada definida en "style".
        pinturas: [
            { src: 'iconos/dama.png', alt: 'Dama Roja',
              style: 'position:absolute !important; width:20rem !important; top:-3rem !important; left:5rem !important; transform:translateX(-50%); opacity:0.6;' }
        ],
        puntosInteres: [
            { coords: [43.243171970074215, -3.451663238449687], nombre: 'Cueva de la luz', foto: 'fotos/luz.jpg',          streetview: null },
            { coords: [43.25072794215788,  -3.449933057244813], nombre: 'Cueva Baranda',   foto: 'fotos/cuevabaranda.jpg', streetview: null },
            { coords: [43.244242072407275, -3.448435321552472], nombre: 'Peña el Pando',   foto: 'fotos/penapando.jpg',    streetview: null }
        ],
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: CUCURIO POR ANCILLO
    // Página de la ruta: ruta.html?id=cucurioa
    // visibleEnMapa: false → no aparece en la portada aún.
    //   Para activarla, cambia a true y añade 'cucurioa' en RUTAS_ORDEN.
    // ──────────────────────────────────────────────────────────────────
    cucurioa: {
        id: 'cucurioa',
        nombre: 'Cucurio por Ancillo',
        color: '#2d6b4a',
        gpx: 'data/cucurioancillo.gpx',
        visibleEnMapa: false,
        dashArray: null,
        distancia: '1,26 km',
        duracion: '15 min',
        desnivel: '42m',
        tipo: 'Ida y vuelta',
        dificultad: 'Moderada',
        descripcion: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis mollis lacus a molestie. Morbi venenatis ipsum auctor elit commodo placerat. In hac habitasse platea dictumst. Suspendisse potenti. Etiam tincidunt cursus ligula, tincidunt tristique ligula tincidunt ac. Vivamus et condimentum tellus. Curabitur mollis sapien eget lectus faucibus interdum. Cras et ultrices diam. Curabitur tincidunt eleifend sem, ut lobortis eros ultricies sit amet. Praesent fringilla auctor sagittis. Phasellus blandit interdum magna. Maecenas vestibulum porta metus eu euismod. Vestibulum consequat leo id eros auctor blandit. Praesent a dui magna. Quisque convallis justo ut est faucibus euismod.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Parque infantil.png',       texto: 'Parque infantil' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        pinturas: [
            { src: 'iconos/cubillas.png', alt: 'Cucurio Ancillo', style: '' }
        ],
        puntosInteres: [
            { coords: [43.26362180926293,  -3.4614135044247236], nombre: 'Puente de madera',       foto: 'fotos/puente.jpg',         streetview: null },
            { coords: [43.264984830307064, -3.458112289614538],  nombre: 'Parque de Cubillas',     foto: 'fotos/parquecubillas.jpg', streetview: null },
            { coords: [43.266546944938824, -3.455966820850918],  nombre: 'Pump track de Cubillas', foto: 'fotos/pumptrack.jpg',      streetview: null }
        ],
        variantes: null
    },


    // ──────────────────────────────────────────────────────────────────
    // RUTA: CUCURIO POR BOLAIZ
    // Página de la ruta: ruta.html?id=cucuriob
    // ──────────────────────────────────────────────────────────────────
    cucuriob: {
        id: 'cucuriob',
        nombre: 'Cucurio por Bolaiz',
        color: '#4a2d6b',
        gpx: 'data/cucuriobolaiz.gpx',
        visibleEnMapa: false,
        dashArray: '8, 8',                   // Línea discontinua en el mapa de portada.
        distancia: '1,26 km',
        duracion: '15 min',
        desnivel: '42m',
        tipo: 'Ida y vuelta',
        dificultad: 'Moderada',
        descripcion: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque convallis mollis lacus a molestie. Morbi venenatis ipsum auctor elit commodo placerat. In hac habitasse platea dictumst. Suspendisse potenti. Etiam tincidunt cursus ligula, tincidunt tristique ligula tincidunt ac. Vivamus et condimentum tellus. Curabitur mollis sapien eget lectus faucibus interdum. Cras et ultrices diam. Curabitur tincidunt eleifend sem, ut lobortis eros ultricies sit amet. Praesent fringilla auctor sagittis. Phasellus blandit interdum magna. Maecenas vestibulum porta metus eu euismod. Vestibulum consequat leo id eros auctor blandit. Praesent a dui magna. Quisque convallis justo ut est faucibus euismod.'
        ],
        servicios: [
            { icono: 'iconos/Zona de picnic.png',       texto: 'Zona Picnic' },
            { icono: 'iconos/Parque infantil.png',       texto: 'Parque infantil' },
            { icono: 'iconos/Apta para niños.png',      texto: 'Apta para niños' },
            { icono: 'iconos/Calzada compartida.png',   texto: 'Calzada compartida' },
            { icono: 'iconos/Apta para bicicletas.png', texto: 'Apta para bicicletas' },
            { icono: 'iconos/Recurso hidrico.png',      texto: 'Recurso hidrico' }
        ],
        pinturas: [
            { src: 'iconos/cubillas.png', alt: 'Cucurio Bolaiz', style: '' }
        ],
        puntosInteres: [
            { coords: [43.26362180926293,  -3.4614135044247236], nombre: 'Puente de madera',       foto: 'fotos/puente.jpg',         streetview: null },
            { coords: [43.264984830307064, -3.458112289614538],  nombre: 'Parque de Cubillas',     foto: 'fotos/parquecubillas.jpg', streetview: null },
            { coords: [43.266546944938824, -3.455966820850918],  nombre: 'Pump track de Cubillas', foto: 'fotos/pumptrack.jpg',      streetview: null }
        ],
        variantes: null
    }

}; // ← Cierre del objeto RUTAS. No elimines este punto y coma.


// ──────────────────────────────────────────────────────────────────────
// ORDEN DE CARGA EN EL MAPA DE PORTADA
// ──────────────────────────────────────────────────────────────────────
// Este array controla en qué orden se cargan los tracks y aparecen
// en la leyenda del mapa de portada (index.html).
// Solo las rutas con visibleEnMapa: true se mostrarán realmente.
// Las rutas con visibleEnMapa: false siguen aquí para que ruta.html
// pueda encontrar sus datos cuando alguien acceda directamente.
var RUTAS_ORDEN = [
    'cuevas',
    'cubillas',
    'vega',
    'guardamino',
    'coto',
    'dama',
    'cucurioa',   // visibleEnMapa: false → no aparece en portada
    'cucuriob'    // visibleEnMapa: false → no aparece en portada
];
