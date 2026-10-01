// Filtro de categorias: los tabs solo agregan/quitan [hidden] a los
// .tier-block que no coinciden, y esconden un .catalog-group completo
// si ninguno de sus bloques quedo visible (por ejemplo, "Negocios"
// desaparece cuando el filtro activo es "Basico").
function initCatalogFilter() {
  const tabs = document.querySelectorAll('.filter-tab');
  const blocks = document.querySelectorAll('.tier-block');
  const groups = document.querySelectorAll('.catalog-group');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      tabs.forEach((t) => t.classList.toggle('is-active', t === tab));

      blocks.forEach((block) => {
        const match = filter === 'all' || block.dataset.tier === filter;
        block.hidden = !match;
      });

      groups.forEach((group) => {
        const visibleBlocks = group.querySelectorAll('.tier-block:not([hidden])');
        group.hidden = visibleBlocks.length === 0;
      });
    });
  });
}

// Visor en la misma pagina: intercepta el click en cada tarjeta, carga
// esa plantilla en el iframe y muestra la capa -- nunca navega a otra
// pestana ni recarga la pagina. El iframe se vacia al cerrar para que
// cualquier animacion o audio de la plantilla se detenga de verdad, no
// siga sonando oculto.
//
// Historial: abrir una plantilla mete un estado nuevo con pushState
// solo para que el boton FISICO/gesto de "atras" del navegador tambien
// cierre el visor (bonus, via el listener de popstate). El boton propio
// "Volver al catalogo" (y Esc) NUNCA usa history.back()/history.go(): lo
// cierran llamando a hideViewer() directamente y sin importar cuantas
// entradas de historial se hayan acumulado. Eso importa porque cada
// click en un <a href="#seccion"> DENTRO de la plantilla (ej.
// "Servicios", "Sobre mi" en Negocios) mete su propia entrada al
// historial conjunto de la pestana -- si "Volver" dependiera de contar
// pasos de historial, un click ahi desviaria el conteo y el boton a
// veces se quedaria a medio camino en vez de regresar directo al
// catalogo. Con un cierre directo eso ya no puede pasar.
//
// frame.contentWindow.location.replace() en vez de frame.src=: asignar
// .src hace que el iframe navegue metiendo su propia entrada en el
// historial conjunto de la pestana. .replace() lo evita.
function initTemplateViewer() {
  const viewer = document.getElementById('templateViewer');
  const frame = document.getElementById('templateViewerFrame');
  const title = document.getElementById('templateViewerTitle');
  const newTabLink = document.getElementById('templateViewerNewTab');
  const backButton = document.getElementById('templateViewerBack');
  const cards = document.querySelectorAll('.card[href]');

  function navigateFrame(url) {
    frame.contentWindow.location.replace(url);
  }

  function showViewer(url, label) {
    navigateFrame(url);
    title.textContent = label;
    newTabLink.href = url;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  // Cierre directo: siempre vuelve al catalogo de un salto, sin importar
  // cuantas anclas internas o entradas de historial haya acumulado la
  // plantilla mientras estaba abierta.
  function closeViewer() {
    if (viewer.hidden) return;
    hideViewer();
    if (history.state && history.state.viewerOpen) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function hideViewer() {
    viewer.hidden = true;
    navigateFrame('about:blank');
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      const label = card.querySelector('.card-title')?.textContent ?? '';
      const url = card.getAttribute('href');
      history.pushState({ viewerOpen: true, url, label }, '', '#plantilla');
      showViewer(url, label);
    });
  });

  backButton.addEventListener('click', closeViewer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !viewer.hidden) {
      closeViewer();
    }
  });

  // Fallback para el boton/gesto FISICO de "atras" del navegador -- ese
  // si depende del historial porque el navegador ya decidio navegar por
  // su cuenta; aqui solo reaccionamos al estado en el que aterrizo.
  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.viewerOpen) {
      showViewer(event.state.url, event.state.label);
    } else {
      hideViewer();
    }
  });
}

// Equivalente tactil de los :hover de escritorio -- touchstart agrega
// .is-touch-active (la misma clase que ya definen cards.css y
// packages.css para replicar cada :hover: "ligero aumento + Ver
// plantilla" en las miniaturas, borde dorado + elevacion en las
// tarjetas de precio). Ningun listener llama preventDefault, asi el
// scroll normal de la pagina nunca se bloquea. touchmove mas alla de un
// pequeno umbral cancela el efecto -- eso es un dedo haciendo scroll, no
// un tap sobre la tarjeta.
function initTouchHoverPreview(selector) {
  const cards = document.querySelectorAll(selector);
  const MOVE_THRESHOLD = 10;

  cards.forEach((card) => {
    let startX = 0;
    let startY = 0;

    card.addEventListener(
      'touchstart',
      (event) => {
        const touch = event.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        card.classList.add('is-touch-active');
      },
      { passive: true }
    );

    card.addEventListener(
      'touchmove',
      (event) => {
        const touch = event.touches[0];
        const movedX = Math.abs(touch.clientX - startX);
        const movedY = Math.abs(touch.clientY - startY);
        if (movedX > MOVE_THRESHOLD || movedY > MOVE_THRESHOLD) {
          card.classList.remove('is-touch-active');
        }
      },
      { passive: true }
    );

    card.addEventListener('touchend', () => {
      card.classList.remove('is-touch-active');
    });

    card.addEventListener('touchcancel', () => {
      card.classList.remove('is-touch-active');
    });
  });
}

initCatalogFilter();
initTemplateViewer();
initTouchHoverPreview('.card');
initTouchHoverPreview('.package-card, .support-card');
