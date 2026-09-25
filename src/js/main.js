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

// Visor en la misma pagina: intercepta el click en cada tarjeta,
// carga esa plantilla en el iframe y muestra la capa -- nunca navega a
// otra pestana ni recarga la pagina. Esc y el boton "Volver" la
// cierran; el iframe se vacia al cerrar para que cualquier animacion o
// audio de la plantilla se detenga de verdad, no siga sonando oculto.
function initTemplateViewer() {
  const viewer = document.getElementById('templateViewer');
  const frame = document.getElementById('templateViewerFrame');
  const title = document.getElementById('templateViewerTitle');
  const newTabLink = document.getElementById('templateViewerNewTab');
  const backButton = document.getElementById('templateViewerBack');
  const cards = document.querySelectorAll('.card[href]');

  function openViewer(url, label) {
    frame.src = url;
    title.textContent = label;
    newTabLink.href = url;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    viewer.hidden = true;
    frame.src = 'about:blank';
    document.body.style.overflow = '';
  }

  cards.forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      const label = card.querySelector('.card-title')?.textContent ?? '';
      openViewer(card.getAttribute('href'), label);
    });
  });

  backButton.addEventListener('click', closeViewer);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !viewer.hidden) {
      closeViewer();
    }
  });
}

initCatalogFilter();
initTemplateViewer();
