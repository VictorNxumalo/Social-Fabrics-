import { formatPrice } from './products.js'
import { prefersReducedMotion } from './motion.js'
import { renderImg, DEFAULT_SIZES } from './image-utils.js'

export function renderArchivePiece(product, index) {
  const num = String(index + 1).padStart(2, '0')
  const flip = index % 2 === 1 ? 'archive-piece-inner--flip' : ''
  const soldOut = !product.inStock
  const story = product.story || product.description

  return `
    <article
      class="archive-piece"
      id="piece-${product.id}"
      data-state="sealed"
      data-priced="false"
      data-category="${product.category}"
      data-reveal="up"
    >
      <div class="archive-piece-inner ${flip}">
        <div class="archive-visual">
          ${soldOut ? '<span class="stamp absolute left-5 top-5 z-20 border-sf-white bg-sf-black text-sf-white">Sold out</span>' : ''}
          <span class="archive-visual-index font-display" aria-hidden="true">${num}</span>
          <div class="archive-visual-img-wrap product-card-image">
            ${renderImg({
              src: product.image,
              alt: product.name,
              className: 'product-card-img archive-img',
              width: 800,
              height: 1000,
              sizes: DEFAULT_SIZES.archive,
              priority: index === 0,
              loading: index < 2 ? 'eager' : 'lazy',
            })}
            <span class="product-card-fallback absolute inset-0 flex items-center justify-center sf-fabric-texture" aria-hidden="true">
              <span class="font-display text-4xl font-extrabold opacity-20">SF</span>
            </span>
          </div>
          <div class="archive-visual-veil" aria-hidden="true"></div>
          <button
            type="button"
            class="archive-unfold-btn"
            data-action="unfold"
            aria-expanded="false"
            aria-controls="archive-panel-${product.id}"
          >
            <span class="archive-unfold-icon" aria-hidden="true">+</span>
            <span class="archive-unfold-text">Unfold piece</span>
          </button>
        </div>

        <div class="archive-panel" id="archive-panel-${product.id}">
          <div class="archive-panel-sealed">
            <p class="wordmark opacity-40">${product.category}</p>
            <h2 class="archive-title display-section">
              ${product.name}
            </h2>
            <p class="archive-teaser mt-4 font-light leading-relaxed opacity-50">
              A piece from the archive. Interact to read its story.
            </p>
          </div>

          <div class="archive-panel-reveal" hidden>
            <p class="wordmark mb-3 opacity-40">The story</p>
            <p class="archive-story text-base font-light leading-relaxed opacity-90 md:text-lg">
              ${story}
            </p>
            <p class="archive-desc mt-4 text-sm leading-relaxed opacity-60">
              ${product.description}
            </p>
            <p class="mt-4 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">
              Sizes · ${product.sizes.join(' / ')}
            </p>

            <div class="archive-price-block mt-8">
              <button type="button" class="archive-price-btn" data-action="price">
                Reveal price
              </button>
              <p class="archive-price-value font-display text-2xl font-extrabold md:text-3xl" hidden aria-live="polite">
                ${formatPrice(product.price)}
              </p>
            </div>

            <div class="archive-actions mt-8 flex flex-wrap gap-3">
              <a href="/product.html?id=${product.id}" class="btn-brutal-filled">Enter piece →</a>
              <button type="button" class="btn-brutal border-sf-white text-sf-white" data-action="fold">
                Fold back
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  `
}

export function initArchiveInteractions(root, { onPieceChange } = {}) {
  root.querySelectorAll('.archive-piece').forEach((piece) => {
    const unfoldBtn = piece.querySelector('[data-action="unfold"]')
    const foldBtn = piece.querySelector('[data-action="fold"]')
    const priceBtn = piece.querySelector('[data-action="price"]')
    const priceValue = piece.querySelector('.archive-price-value')
    const revealPanel = piece.querySelector('.archive-panel-reveal')
    const sealedPanel = piece.querySelector('.archive-panel-sealed')

    unfoldBtn?.addEventListener('click', () => {
      root.querySelectorAll('.archive-piece[data-state="unfolded"]').forEach((open) => {
        if (open !== piece) {
          collapsePiece(
            open,
            open.querySelector('[data-action="unfold"]'),
            open.querySelector('.archive-panel-reveal'),
            open.querySelector('.archive-panel-sealed'),
            open.querySelector('[data-action="price"]'),
            open.querySelector('.archive-price-value'),
          )
        }
      })
      expandPiece(piece, unfoldBtn, revealPanel, sealedPanel)
      onPieceChange?.(piece.id)
    })

    foldBtn?.addEventListener('click', () => {
      collapsePiece(piece, unfoldBtn, revealPanel, sealedPanel, priceBtn, priceValue)
    })

    priceBtn?.addEventListener('click', () => {
      piece.dataset.priced = 'true'
      priceBtn.hidden = true
      priceValue.hidden = false
    })
  })

  initArchiveImages(root)
}

function expandPiece(piece, btn, revealPanel, sealedPanel) {
  piece.dataset.state = 'unfolded'
  btn.setAttribute('aria-expanded', 'true')
  btn.querySelector('.archive-unfold-icon').textContent = '−'
  btn.querySelector('.archive-unfold-text').textContent = 'Unfolded'
  revealPanel.hidden = false
  sealedPanel.classList.add('archive-panel-sealed--hidden')
  piece.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' })
}

function collapsePiece(piece, btn, revealPanel, sealedPanel, priceBtn, priceValue) {
  piece.dataset.state = 'sealed'
  piece.dataset.priced = 'false'
  btn?.setAttribute('aria-expanded', 'false')
  if (btn) {
    btn.querySelector('.archive-unfold-icon').textContent = '+'
    btn.querySelector('.archive-unfold-text').textContent = 'Unfold piece'
  }
  revealPanel.hidden = true
  sealedPanel?.classList.remove('archive-panel-sealed--hidden')
  if (priceBtn) priceBtn.hidden = false
  if (priceValue) priceValue.hidden = true
}

function initArchiveImages(root) {
  root.querySelectorAll('.product-card-image').forEach((wrap) => {
    const img = wrap.querySelector('.product-card-img')
    const fallback = wrap.querySelector('.product-card-fallback')
    if (!img || !fallback) return

    const showFallback = () => {
      img.classList.add('hidden')
      fallback.classList.remove('hidden')
    }

    if (img.complete && img.naturalWidth === 0) showFallback()
    else fallback.classList.add('hidden')

    img.addEventListener('error', showFallback)
    img.addEventListener('load', () => {
      if (img.naturalWidth > 0) fallback.classList.add('hidden')
    })
  })
}
