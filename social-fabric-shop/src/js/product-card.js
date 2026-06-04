import { formatPrice } from './products.js'
import { renderImg, DEFAULT_SIZES } from './image-utils.js'

export function renderProductCard(product, { variant = 'editorial', index = 0 } = {}) {
  const soldOut = !product.inStock
  const num = String(index + 1).padStart(2, '0')

  if (variant === 'shop') {
    return renderShopCard(product, soldOut)
  }

  if (variant === 'light') {
    return renderLightCard(product, soldOut, num)
  }

  return `
    <article class="product-card-editorial featured-scroll-card group shrink-0 snap-center md:min-w-0 md:max-w-none" data-reveal="scale">
      <div class="relative aspect-[4/5] overflow-hidden bg-sf-black">
        <div class="product-card-image relative h-full w-full">
          <a href="/product.html?id=${product.id}" class="block h-full no-underline text-inherit">
            ${soldOut ? `<span class="stamp absolute left-4 top-4 z-20 bg-sf-black">Sold out</span>` : ''}
            <span class="product-card-watermark pointer-events-none absolute -left-2 top-6 z-10 font-display font-extrabold leading-none opacity-[0.07]" aria-hidden="true">${num}</span>
            ${renderImg({
              src: product.image,
              alt: product.name,
              className: 'product-card-img h-full w-full object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0',
              width: 400,
              height: 500,
              sizes: DEFAULT_SIZES.product,
              priority: index === 0,
            })}
            <span class="product-card-fallback absolute inset-0 flex items-center justify-center sf-fabric-texture" aria-hidden="true">
              <span class="font-display text-4xl font-extrabold opacity-20">SF</span>
            </span>
          </a>
        </div>
        <div class="product-card-mobile-meta absolute inset-x-0 bottom-0 border-t-2 border-sf-white bg-sf-black/90 p-4 backdrop-blur-sm md:translate-y-full md:transition-transform md:duration-300 md:group-hover:translate-y-0">
          <p class="wordmark mb-1 opacity-50">${product.category}</p>
          <h3 class="font-display text-base font-bold uppercase leading-tight md:text-lg">${product.name}</h3>
          <div class="card-price-block mt-2" data-card-price>
            <button type="button" class="card-reveal-price font-mono text-[10px] uppercase tracking-[0.2em] opacity-70 hover:opacity-100">Reveal price</button>
            <p class="card-price-value font-mono text-sm hidden" aria-live="polite">${formatPrice(product.price)}</p>
          </div>
          <a href="/product.html?id=${product.id}" class="nav-link mt-3 inline-flex text-[10px]">Enter piece →</a>
        </div>
      </div>
    </article>
  `
}

function renderShopCard(product, soldOut) {
  return `
    <article class="shop-card group">
      <a href="/product.html?id=${product.id}" class="block no-underline text-inherit">
        <div class="product-card-image relative aspect-[3/4] overflow-hidden border-2 border-sf-white bg-neutral-900">
          ${soldOut ? `<span class="stamp absolute left-3 top-3 z-20 border-sf-white bg-sf-black text-sf-white">Sold out</span>` : ''}
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-card-img absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
            width="400"
            height="533"
          />
          <span class="product-card-fallback absolute inset-0 flex items-center justify-center sf-fabric-texture" aria-hidden="true">
            <span class="font-display text-4xl font-extrabold opacity-20">SF</span>
          </span>
        </div>
        <div class="mt-3 space-y-1 border-t-2 border-sf-white pt-3">
          <p class="wordmark opacity-40">${product.category}</p>
          <h3 class="font-display text-sm font-bold uppercase leading-tight">${product.name}</h3>
          <p class="font-mono text-xs">${formatPrice(product.price)}</p>
        </div>
      </a>
    </article>
  `
}

function renderLightCard(product, soldOut, num) {
  return `
    <article class="product-card-editorial-light group">
      <a href="/product.html?id=${product.id}" class="block no-underline text-sf-black">
        <div class="product-card-image relative aspect-[3/4] overflow-hidden border-2 border-sf-black bg-sf-off-white">
          ${soldOut ? `<span class="stamp absolute left-3 top-3 z-20 border-sf-black bg-sf-white text-sf-black">Sold out</span>` : ''}
          <span class="pointer-events-none absolute right-2 top-2 font-mono text-4xl font-bold opacity-10" aria-hidden="true">${num}</span>
          <img
            src="${product.image}"
            alt="${product.name}"
            class="product-card-img h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            loading="lazy"
            width="400"
            height="533"
          />
          <span class="product-card-fallback absolute inset-0 flex items-center justify-center sf-fabric-texture-light" aria-hidden="true">
            <span class="font-display text-5xl font-extrabold opacity-15">SF</span>
          </span>
        </div>
        <div class="mt-3 flex items-baseline justify-between gap-2 border-t-2 border-sf-black pt-3">
          <h3 class="font-display text-sm font-bold uppercase">${product.name}</h3>
          <p class="font-mono text-xs">${formatPrice(product.price)}</p>
        </div>
      </a>
    </article>
  `
}

export function initProductCardImages(root = document) {
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

  initCardPriceReveal(root)
}

function initCardPriceReveal(root) {
  root.querySelectorAll('[data-card-price]').forEach((block) => {
    const btn = block.querySelector('.card-reveal-price')
    const value = block.querySelector('.card-price-value')
    if (!btn || !value) return

    btn.addEventListener('click', (event) => {
      event.preventDefault()
      event.stopPropagation()
      btn.hidden = true
      value.hidden = false
    })
  })
}
