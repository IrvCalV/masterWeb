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
// Historial: abrir una plantilla mete un estado nuevo con pushState, asi
// que el boton "atras" del navegador (no solo el boton "Volver" de la
// barra ni Esc) tambien cierra el visor -- los tres disparan el mismo
// popstate en vez de cada uno cerrando la capa por su cuenta, para que
// nunca queden desincronizados.
//
// frame.contentWindow.location.replace() en vez de frame.src=: asignar
// .src hace que el iframe navegue metiendo SU PROPIA entrada en el
// historial conjunto de la pestana, ademas de la que ya mete nuestro
// pushState -- dos entradas por cada apertura en vez de una. Eso
// desincroniza el conteo despues del segundo ciclo de abrir/cerrar (un
// "atras" a veces cierra, a veces deja el visor a medio abrir).
// .replace() navega el iframe sin agregar entrada, asi que solo queda la
// entrada que nosotros mismos controlamos.
//
// Navegacion interna por anclas DENTRO de la plantilla (ej. "Servicios",
// "Sobre mi" en Negocios): cada click en un <a href="#seccion"> del
// iframe mete su propia entrada al historial conjunto de la pestana,
// aunque esa entrada le pertenezca al iframe y no a esta pagina -- por
// eso history.state (el de ESTA pagina) se queda en {viewerOpen:true,...}
// sin cambiar durante esos clicks. Un history.back() de un solo paso
// entonces solo deshace la ultima ancla del iframe, no cierra el visor
// -- hay que apretar "Volver" una vez por cada seccion visitada. Para
// que "Volver al catalogo" siempre regrese de un salto sin importar
// cuantas anclas se hayan clickeado adentro, guardamos history.length
// justo ANTES de nuestro pushState (openedAtLength) y calculamos cuantos
// pasos hay que retroceder para aterrizar exactamente ahi.
function initTemplateViewer() {
  const viewer = document.getElementById('templateViewer');
  const frame = document.getElementById('templateViewerFrame');
  const title = document.getElementById('templateViewerTitle');
  const newTabLink = document.getElementById('templateViewerNewTab');
  const backButton = document.getElementById('templateViewerBack');
  const cards = document.querySelectorAll('.card[href]');
  let openedAtLength = null;

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
      openedAtLength = history.length;
      history.pushState({ viewerOpen: true, url, label }, '', '#plantilla');
      showViewer(url, label);
    });
  });

  // El boton "Volver" y Esc solo retroceden el historial -- es el
  // listener de popstate el que de verdad cierra el visor, para que los
  // tres caminos (boton, Esc, boton fisico/gesto de atras) queden
  // siempre sincronizados con el estado real de la URL.
  backButton.addEventListener('click', () => {
    if (history.state && history.state.viewerOpen) {
      const stepsBack = openedAtLength !== null ? history.length - openedAtLength : 1;
      history.go(-Math.max(stepsBack, 1));
    } else {
      hideViewer();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !viewer.hidden) {
      backButton.click();
    }
  });

  window.addEventListener('popstate', (event) => {
    if (event.state && event.state.viewerOpen) {
      showViewer(event.state.url, event.state.label);
    } else {
      hideViewer();
    }
  });
}

initCatalogFilter();
initTemplateViewer();
