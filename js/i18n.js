// portfolio — i18n.js (EN default, ES alternative)
(function () {
    'use strict';

    var ES = {
    "nav_home": "Inicio",
    "nav_about": "Sobre mí",
    "nav_exp": "Experiencia",
    "nav_skills": "Habilidades",
    "nav_projects": "Proyectos",
    "nav_contact": "Contacto",
    "hero_sub": "Construyo aplicaciones cloud con Node.js, .NET y Java. Antes fui QA Automation Engineer, así que las pruebas y los pipelines CI/CD forman parte de cómo diseño software.",
    "hero_work": "VER LO QUE CONSTRUYO",
    "hero_cv": "DESCARGAR CV",
    "hero_brands": "Experiencia en proyectos de El Corte Inglés, Mango y Simpleat.",
    "avail_label": "INCORPORACIÓN",
    "avail_title": "Verano<br/>2027",
    "testi_quote": "\"Detectó regresiones críticas en los servicios de El Corte Inglés antes de que llegaran a producción. Diseñó las suites de API que hoy siguen en uso.\"",
    "lbl_about": "Sobre Mí",
    "about_1": "Soy <strong>desarrollador Full Stack</strong> con base en cloud. Construyo aplicaciones con <strong>Node.js</strong>, <strong>C# / .NET</strong> y <strong>Java</strong> en el backend, y con <strong>React</strong> y <strong>Angular</strong> en el frontend. Mi proyecto personal más ambicioso, <strong>F.R.I.D.A.Y-bot</strong>, es un asistente de IA autoalojado, con arquitectura hexagonal, desplegado en <strong>Oracle Cloud</strong> con un pipeline de CI/CD.",
    "about_2": "Empecé como <strong>QA Automation Engineer</strong> en proyectos enterprise de <strong>El Corte Inglés</strong> y <strong>Mango</strong>, con <strong>Karate DSL</strong>, <strong>Gatling</strong>, <strong>JMeter</strong> y <strong>Jenkins</strong>. Esa etapa me dejó una forma de trabajar: probar pronto, automatizar el pipeline y mantener la arquitectura limpia.",
    "about_3": "Actualmente curso el <strong>Máster en Full Stack &amp; Cloud en Tajamar Tech</strong> y preparo las certificaciones de <strong>AWS</strong>, <strong>Azure</strong> y <strong>Power Platform</strong>. Disponible para incorporación a partir de <strong>verano de 2027</strong> y abierto a reubicación internacional.",
    "lbl_exp": "Experiencia Laboral",
    "d_qa": "Mayo 2026<br />Agosto 2026",
    "d_intern": "Marzo 2026<br />Mayo 2026",
    "d_vol": "Abril 2025<br />Mayo 2025",
    "d_coach": "2023<br />Actualidad",
    "qa_1": "Automaticé pruebas de integración de APIs con <strong>Karate DSL</strong> para los microservicios Unity de <strong>El Corte Inglés</strong>, reduciendo el tiempo de validación de releases.",
    "qa_2": "Validé la consistencia funcional del sistema POS de escritorio de <strong>Mango</strong> (.NET, MAUI, CQRS) integrado con <strong>SonarQube</strong> para análisis estático continuo.",
    "qa_3": "Diseñé escenarios de carga y estrés con <strong>JMeter</strong> y <strong>Gatling (Java DSL)</strong> que identificaron cuellos de botella antes de despliegues en producción.",
    "qa_4": "Construí y mantuve pipelines de CI/CD en <strong>Jenkins</strong> (Groovy) y <strong>GitLab</strong>, ejecutando suites de regresión automatizadas en cada commit.",
    "intern_tag": "(Prácticas 2º DAW)",
    "int_1": "Diseñé y ejecuté pruebas automatizadas con <strong>Karate DSL</strong> y <strong>JUnit</strong> en proyectos enterprise reales desde la primera semana de incorporación.",
    "int_2": "Integración directa en sprints Scrum con gestión de incidencias en <strong>Jira</strong>, participando en dailies y refinamientos de backlog.",
    "vol_org": "Club Voleibol Aranjuez &middot; Madrid (Voluntariado)",
    "vol_1": "Diseñé, desarrollé y desplegué el sitio web oficial del club con <strong>HTML5</strong>, <strong>CSS3</strong> y <strong>JavaScript</strong> vanilla, optimizando Core Web Vitals y responsividad.",
    "coach_title": "Entrenador de voleibol",
    "coach_org": "Federación de Voleibol de Madrid &middot; Madrid",
    "coach_1": "Único entrenador de un equipo cadete mixto, que se clasificó para la competición zonal la pasada temporada.",
    "sk_ai": "IA &amp; Seguridad",
    "sk_lang": "Idiomas",
    "sk_aws": "AWS (en formación)",
    "sk_azure": "Azure (en formación)",
    "sk_es": "Español (Nativo)",
    "sk_en": "Inglés (B2 certificado)",
    "tg_fri": "IA · Cloud · En desarrollo",
    "pr_fri": "Asistente personal de IA autoalojado, controlado por WhatsApp y desplegado en Oracle Cloud. Llamadas a herramientas con varios proveedores de LLM (Groq, OpenAI, Ollama), RAG híbrido y servidores MCP, sobre una arquitectura hexagonal. Pipeline de CI/CD en GitHub Actions con puertas de calidad automáticas.",
    "tg_enl": "Juego Multijugador · WebSockets",
    "tfg": "— TFG",
    "pr_enl": "Juego web multijugador en tiempo real donde los jugadores intentan escribir la misma palabra. Salas y rondas por WebSockets (Socket.io), autenticación JWT y detección de palabras casi iguales con distancia de Levenshtein. Frontend en React 19 y despliegue con Docker Compose y Nginx.",
    "tg_sim": "SaaS · Menús Digitales · QR",
    "pr_sim": "Plataforma SaaS de menús digitales y pedidos por QR para restauración. Arquitectura desacoplada con suites E2E (Playwright + Cucumber BDD), pruebas de API (Karate) y carga transaccional (Gatling), orquestado desde GitHub Actions.",
    "tg_atl": "SaaS · Análisis de Calidad",
    "pr_atl": "Plataforma modular de análisis de calidad de software construida con Clean Architecture. Backend en Spring Modulith con PostgreSQL, frontend en Angular 20, contenedorizada con Docker.",
    "pr_goa": "Infraestructura web y catálogo online para marca de ropa deportiva y camisetas de fútbol. Diseño de producto, gestión de inventario digital y optimización de conversión.",
    "repo": "Ver código",
    "lbl_edu": "Formación",
    "edu_m": "Máster en Desarrollo Full Stack &amp; Arquitecturas Cloud",
    "edu_prog": "En curso",
    "edu_md": "Especialización de 814 horas en C#, ASP.NET Core, EF Core, Angular, React, Docker, Kubernetes y arquitecturas en Microsoft Azure y AWS. Finalización: junio 2027.",
    "edu_d": "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
    "edu_dd": "Diseño de bases de datos relacionales, desarrollo web frontend/backend, control de versiones (Git) y metodologías ágiles.",
    "lbl_contact": "Hablemos",
    "ct_line": "Madrid &middot; Incorporación verano 2027 &middot; Abierto a remoto y reubicación internacional",
    "ct_cv": "Descargar CV",
    "copy": "&copy; 2026 David Castellanos. Todos los derechos reservados."
};
    var META_ES = {
    "title": "David Castellanos — Full Stack Developer & Multicloud · Node.js · .NET · Java · React · Angular",
    "description": "Desarrollador Full Stack especializado en cloud (Oracle Cloud, AWS, Azure) y antiguo QA Automation Engineer en proyectos de El Corte Inglés y Mango. Node.js, .NET, Java, React, Angular. Disponible verano 2027.",
    "ogDescription": "Full Stack Developer con base en cloud y background en QA Automation (El Corte Inglés, Mango). Disponible para incorporación verano 2027."
};
    var ATTRS = [
    {
        "sel": ".navbar",
        "attr": "aria-label",
        "en": "Main navigation",
        "es": "Navegación principal"
    },
    {
        "sel": ".navbar-toggler",
        "attr": "aria-label",
        "en": "Toggle navigation menu",
        "es": "Abrir menú de navegación"
    },
    {
        "sel": "#back-to-top",
        "attr": "aria-label",
        "en": "Back to top",
        "es": "Volver arriba"
    },
    {
        "sel": "#email-copy",
        "attr": "title",
        "en": "Click to copy the email",
        "es": "Haz clic para copiar el correo"
    }
];
    var META_EN = {};
    var EN = {};
    var STORAGE_KEY = 'portfolio-lang';

    function readStored() {
        try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }
    function writeStored(v) {
        try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* storage unavailable */ }
    }
    function fromQuery() {
        try {
            var q = new URLSearchParams(window.location.search).get('lang');
            return (q === 'es' || q === 'en') ? q : null;
        } catch (e) { return null; }
    }

    function metaEl(selector) { return document.querySelector(selector); }

    function cacheEnglish() {
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            EN[el.getAttribute('data-i18n')] = el.innerHTML;
        });
        META_EN.title = document.title;
        var d = metaEl('meta[name="description"]');
        var od = metaEl('meta[property="og:description"]');
        META_EN.description = d ? d.getAttribute('content') : '';
        META_EN.ogDescription = od ? od.getAttribute('content') : '';
    }

    function apply(lang) {
        var dict = lang === 'es' ? ES : EN;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) { el.innerHTML = dict[key]; }
        });

        var meta = lang === 'es' ? META_ES : META_EN;
        document.title = meta.title;
        var d = metaEl('meta[name="description"]');
        var od = metaEl('meta[property="og:description"]');
        var ot = metaEl('meta[property="og:title"]');
        if (d) { d.setAttribute('content', meta.description); }
        if (od) { od.setAttribute('content', meta.ogDescription); }
        if (ot) { ot.setAttribute('content', lang === 'es' ? META_ES.title.split(' · ')[0] : META_EN.title.split(' · ')[0]); }
        var loc = metaEl('meta[property="og:locale"]');
        if (loc) { loc.setAttribute('content', lang === 'es' ? 'es_ES' : 'en_US'); }

        ATTRS.forEach(function (a) {
            var el = document.querySelector(a.sel);
            if (el) { el.setAttribute(a.attr, lang === 'es' ? a.es : a.en); }
        });

        document.documentElement.setAttribute('lang', lang);
        document.querySelectorAll('.lang-btn').forEach(function (b) {
            var on = b.getAttribute('data-lang') === lang;
            b.classList.toggle('active', on);
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        api.lang = lang;
    }

    var api = {
        lang: 'en',
        set: function (lang) {
            if (lang !== 'en' && lang !== 'es') { return; }
            writeStored(lang);
            apply(lang);
        },
        text: function (en, es) { return api.lang === 'es' ? es : en; }
    };
    window.i18n = api;

    cacheEnglish();

    document.querySelectorAll('.lang-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { api.set(btn.getAttribute('data-lang')); });
    });

    var initial = fromQuery() || readStored() || 'en';
    apply(initial);
})();
