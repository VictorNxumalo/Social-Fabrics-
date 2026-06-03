import { getProductById, formatPrice, getLooksForProduct } from './products.js'
import { addToCart } from './cart-store.js'
import { renderImg, DEFAULT_SIZES } from './image-utils.js'
import { initProductCardImages } from './product-card.js'

export async function initProductPage() {
  const root = document.getElementById('product-root')
  if (!root) return

  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')

  if (!id) {
    root.innerHTML = renderNotFound()
    return
  }

  try {
    const product = await getProductById(id)
    if (!product) {
      root.innerHTML = renderNotFound()
      return
    }

    const looks = await getLooksForProduct(id)
    root.innerHTML = renderProduct(product, looks)
    initProductCardImages(root)
    initProductInteractions(product)
  } catch {
    root.innerHTML = renderNotFound('Could not load this piece.')
  }
}

function renderNotFound(message = 'Piece not found in the archive.') {
  return `
    <section class="section-rule sf-pad-lg">
      <p class="wordmark mb-4 opacity-40">Archive</p>
      <h1 class="display-section">${message}</h1>
      <a href="/shop.html" class="btn-brutal-filled mt-8 inline-flex">Back to archive</a>
    </section>
  `
}

function renderProduct(product, looks) {
  const soldOut = !product.inStock
  const story = product.story || product.description

  const sizeButtons = product.sizes
    .map(
      (size) => `
      <button type="button" class="size-btn" data-size="${size}" ${soldOut ? 'disabled' : ''}>${size}</button>
    `,
    )
    .join('')

  const lookLinks = looks.length
    ? `
      <div class="product-looks mt-8 border-t-2 border-sf-white pt-6">
        <p class="wordmark mb-3 opacity-40">Worn in</p>
        <div class="flex flex-wrap gap-2">
          ${looks
            .map(
              (look) => `
            <a href="/models.html#${look.id}" class="look-chip">${look.caption}</a>
          `,
            )
            .join('')}
        </div>
        <a href="/models.html" class="nav-link mt-4 inline-flex">View all looks →</a>
      </div>
    `
    : ''

  return `
    <article class="product-detail section-rule">
      <div class="product-detail-grid">
        <div class="product-detail-visual border-b-2 border-sf-white md:border-b-0 md:border-r-2">
          ${soldOut ? '<span class="stamp absolute left-5 top-5 z-20">Sold out</span>' : ''}
          <div class="product-card-image relative aspect-[4/5] bg-neutral-900 md:aspect-auto md:min-h-[480px]">
            ${renderImg({
              src: product.image,
              alt: product.name,
              className: 'product-card-img absolute inset-0 h-full w-full object-cover object-center',
              width: 800,
              height: 1000,
              sizes: DEFAULT_SIZES.archive,
              priority: true,
            })}
            <span class="product-card-fallback absolute inset-0 flex items-center justify-center sf-fabric-texture" aria-hidden="true">
              <span class="font-display text-4xl font-extrabold opacity-20">SF</span>
            </span>
          </div>
        </div>

        <div class="product-detail-panel sf-pad-lg">
          <p class="wordmark mb-3 opacity-40">${product.category}</p>
          <h1 class="display-section">${product.name}</h1>

          <p class="product-detail-story archive-story mt-6 prose-body opacity-90">${story}</p>
          <p class="product-detail-desc mt-4 prose-body opacity-60">${product.description}</p>

          ${lookLinks}

          <div class="product-detail-form mt-8 space-y-6">
            <div>
              <p class="wordmark mb-3 opacity-40">Select size</p>
              <div class="size-picker" role="group" aria-label="Size">${sizeButtons}</div>
              <p class="size-hint mt-2 font-mono text-[10px] uppercase tracking-[0.2em] opacity-40">Choose a size to continue</p>
            </div>

            <div class="product-price-block">
              <button type="button" class="archive-price-btn" data-action="reveal-price" disabled>
                Reveal price
              </button>
              <p class="archive-price-value font-display text-2xl font-extrabold md:text-3xl" hidden aria-live="polite">
                ${formatPrice(product.price)}
              </p>
            </div>

            <button type="button" class="btn-brutal-filled w-full justify-center" data-action="add-cart" disabled>
              Add to bag
            </button>
            <a href="/shop.html" class="nav-link inline-flex">← Back to archive</a>
          </div>
        </div>
      </div>
    </article>
  `
}

function initProductInteractions(product) {
  const root = document.getElementById('product-root')
  if (!root) return

  let selectedSize = null
  let priceRevealed = false

  const sizeHint = root.querySelector('.size-hint')
  const priceBtn = root.querySelector('[data-action="reveal-price"]')
  const priceValue = root.querySelector('.archive-price-value')
  const addBtn = root.querySelector('[data-action="add-cart"]')

  root.querySelectorAll('.size-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedSize = btn.dataset.size
      root.querySelectorAll('.size-btn').forEach((b) => b.classList.toggle('is-selected', b === btn))
      if (sizeHint) sizeHint.textContent = `Selected · ${selectedSize}`
      if (priceBtn) priceBtn.disabled = false
      updateAddButton()
    })
  })

  priceBtn?.addEventListener('click', () => {
    if (!selectedSize) return
    priceRevealed = true
    priceBtn.hidden = true
    priceValue.hidden = false
    updateAddButton()
  })

  addBtn?.addEventListener('click', () => {
    if (!selectedSize || !priceRevealed || !product.inStock) return

    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.image,
    })

    addBtn.textContent = 'Added — view bag'
    addBtn.classList.add('is-added')
    window.setTimeout(() => {
      window.location.href = '/cart.html'
    }, 600)
  })

  function updateAddButton() {
    if (!addBtn) return
    addBtn.disabled = !(selectedSize && priceRevealed && product.inStock)
  }
}
