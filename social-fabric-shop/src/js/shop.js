import { fetchProducts } from './products.js'
import { renderArchivePiece, initArchiveInteractions } from './archive-piece.js'
import { refreshScrollReveal } from './motion.js'

const CATEGORIES = ['All', 'Tees', 'Hoodies', 'Accessories']

let allProducts = []
let activeCategory = 'All'

export async function initShop() {
  const runway = document.getElementById('archive-runway')
  const countEl = document.getElementById('shop-count')
  const progressEl = document.getElementById('archive-progress')

  if (!runway) return

  try {
    allProducts = await fetchProducts().then((list) =>
      [...list].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)),
    )
    renderFilters()
    renderArchive()
    initFilterListeners()
    initScrollProgress(progressEl)
  } catch {
    runway.innerHTML =
      '<p class="sf-pad font-mono text-sm opacity-50">Archive unavailable.</p>'
    if (countEl) countEl.textContent = '0 pieces in the archive'
  }
}

function renderFilters() {
  const cats = document.getElementById('shop-categories')
  if (!cats) return

  cats.innerHTML = CATEGORIES.map(
    (cat) => `
      <button
        type="button"
        class="archive-filter-btn ${cat === activeCategory ? 'is-active' : ''}"
        data-category="${cat}"
      >${cat === 'All' ? 'All pieces' : cat}</button>
    `,
  ).join('')
}

function initFilterListeners() {
  document.getElementById('shop-categories')?.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-category]')
    if (!btn) return
    activeCategory = btn.dataset.category
    document.querySelectorAll('.archive-filter-btn').forEach((el) => {
      el.classList.toggle('is-active', el.dataset.category === activeCategory)
    })
    renderArchive()
  })
}

function getFilteredProducts() {
  if (activeCategory === 'All') return allProducts
  return allProducts.filter((p) => p.category === activeCategory)
}

function renderArchive() {
  const runway = document.getElementById('archive-runway')
  const countEl = document.getElementById('shop-count')
  const progressEl = document.getElementById('archive-progress')
  if (!runway) return

  const products = getFilteredProducts()

  if (countEl) {
    countEl.textContent = `${products.length} piece${products.length === 1 ? '' : 's'} in the archive — unfold to discover`
  }

  if (products.length === 0) {
    runway.innerHTML =
      '<p class="sf-pad font-mono text-sm opacity-50">No pieces in this chapter.</p>'
    if (progressEl) progressEl.innerHTML = ''
    return
  }

  runway.innerHTML = products.map(renderArchivePiece).join('')
  initArchiveInteractions(runway, {
    onPieceChange: (id) => highlightProgress(id),
  })
  buildProgress(products, progressEl)
  refreshScrollReveal(runway)
}

function buildProgress(products, progressEl) {
  if (!progressEl) return
  progressEl.innerHTML = products
    .map(
      (p, i) => `
      <a href="#piece-${p.id}" class="archive-progress-dot" data-piece="${p.id}" aria-label="Piece ${String(i + 1).padStart(2, '0')}">
        <span class="font-mono text-[9px]">${String(i + 1).padStart(2, '0')}</span>
      </a>
    `,
    )
    .join('')
}

function highlightProgress(id) {
  document.querySelectorAll('.archive-progress-dot').forEach((dot) => {
    dot.classList.toggle('is-active', dot.dataset.piece === id)
  })
}

function initScrollProgress(progressEl) {
  if (!progressEl) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          highlightProgress(entry.target.id.replace('piece-', ''))
        }
      })
    },
    { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
  )

  const observeAll = () => {
    document.querySelectorAll('.archive-piece').forEach((el) => observer.observe(el))
  }

  observeAll()

  const runway = document.getElementById('archive-runway')
  if (runway) {
    new MutationObserver(observeAll).observe(runway, { childList: true })
  }
}
