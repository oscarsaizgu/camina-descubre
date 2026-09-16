// ======================================================
// analytics.js — Consentimiento de cookies + Google Analytics 4
// Compartido por todas las páginas de Camina y Descubre.
// Edita aquí para cambiar el comportamiento en todo el sitio.
// ======================================================

var GA_MEASUREMENT_ID = 'G-HC9MEPLSPG';
var CYD_CONSENT_KEY    = 'cyd_consentimiento_analitica';

function _cydConsentimientoGuardado() {
    try { return localStorage.getItem(CYD_CONSENT_KEY); } catch (e) { return null; }
}
function _cydGuardarConsentimiento(valor) {
    try { localStorage.setItem(CYD_CONSENT_KEY, valor); } catch (e) { /* almacenamiento no disponible */ }
}

// ─── Carga de gtag.js — solo si hay consentimiento concedido ───────
function _cydCargarGA() {
    if (window._cydGACargado) return;
    window._cydGACargado = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag('js', new Date());
    // transport_type: 'beacon' evita perder eventos cuando el clic
    // navega inmediatamente a otra página (folleto, seguir ruta, etc.)
    gtag('config', GA_MEASUREMENT_ID, {
        anonymize_ip: true,
        transport_type: 'beacon'
    });

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(script);
}

// ─── Cambiar de opinión — usado desde la política de cookies ──────
window.cydCambiarPreferenciaCookies = function () {
    try { localStorage.removeItem(CYD_CONSENT_KEY); } catch (e) { /* almacenamiento no disponible */ }
    location.reload();
};

// ─── Envío de eventos — no hace nada sin consentimiento ────────────
function enviarEventoGA(nombre, params) {
    if (_cydConsentimientoGuardado() !== 'concedido') return;
    if (typeof window.gtag !== 'function') return;
    window.gtag('event', nombre, params || {});
}
window.enviarEventoGA = enviarEventoGA;

// ─── Banner de consentimiento (solo si no hay decisión previa) ─────
function _cydMostrarBanner() {
    if (document.getElementById('cyd-cookies-banner')) return;

    var div = document.createElement('div');
    div.id = 'cyd-cookies-banner';
    div.setAttribute('role', 'region');
    div.setAttribute('aria-label', 'Aviso de cookies');
    div.innerHTML =
        '<p class="cyd-cookies-texto">Usamos una analítica mínima (Google Analytics) para saber qué paseos interesan más. Más información en <a href="cookies.html">la política de cookies</a>.</p>' +
        '<div class="cyd-cookies-botones">' +
            '<button type="button" class="cyd-cookies-btn cyd-cookies-btn--rechazar">Rechazar</button>' +
            '<button type="button" class="cyd-cookies-btn cyd-cookies-btn--aceptar">Aceptar</button>' +
        '</div>';
    document.body.appendChild(div);

    div.querySelector('.cyd-cookies-btn--aceptar').addEventListener('click', function () {
        _cydGuardarConsentimiento('concedido');
        _cydCargarGA();
        div.remove();
    });
    div.querySelector('.cyd-cookies-btn--rechazar').addEventListener('click', function () {
        _cydGuardarConsentimiento('denegado');
        div.remove();
    });
}

(function _cydInitConsentimiento() {
    var consentimiento = _cydConsentimientoGuardado();
    if (consentimiento === 'concedido') {
        _cydCargarGA();
    } else if (consentimiento !== 'denegado') {
        // En páginas donde el banner podría interferir con controles críticos
        // (p. ej. seguir.html, pantalla completa de seguimiento GPS) se puede
        // suprimir su aparición automática con: window.CYD_SUPPRIMIR_BANNER = true
        if (window.CYD_SUPPRIMIR_BANNER) return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', _cydMostrarBanner);
        } else {
            _cydMostrarBanner();
        }
    }
})();

// ─── Eventos genéricos mediante atributos data-ga-* ────────────────
// Cualquier elemento con data-ga-event="nombre_evento" envía ese
// evento al hacer clic; data-ga-param-XXX="valor" se añade como
// parámetro XXX. Evita repetir listeners de JS en cada página.
document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('[data-ga-event]');
    if (!el) return;
    var nombre = el.getAttribute('data-ga-event');
    var params = {};
    for (var i = 0; i < el.attributes.length; i++) {
        var attr = el.attributes[i];
        if (attr.name.indexOf('data-ga-param-') === 0) {
            params[attr.name.slice('data-ga-param-'.length)] = attr.value;
        }
    }
    enviarEventoGA(nombre, params);
});
