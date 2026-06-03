import './style.css'
import { initLayout } from './js/layout.js'
import { getFeaturedProducts } from './js/products.js'
import { renderProductCard, initProductCardImages } from './js/product-card.js'
import { renderHomeBgWaves, renderMarquee, initHeroVideo } from './js/home.js'
import { refreshScrollReveal } from './js/motion.js'

initLayout({ variant: 'overlay', activePath: '/' })

const homeBgEl = document.getElementById('home-bg-waves')
if (homeBgEl) homeBgEl.innerHTML = renderHomeBgWaves()

const marqueeEl = document.getElementById('marquee-slot')
if (marqueeEl) marqueeEl.innerHTML = renderMarquee()

initHeroVideo()
renderFeaturedDrops()

async function renderFeaturedDrops() {
  const grid = document.getElementById('featured-grid')
  if (!grid) return

  try {
    const products = await getFeaturedProducts(6)
    grid.innerHTML = products
      .map((product, index) => renderProductCard(product, { variant: 'editorial', index }))
      .join('')
    initProductCardImages(grid)
    refreshScrollReveal(grid)
  } catch {
    grid.innerHTML =
      '<p class="sf-pad font-mono text-sm opacity-50">Could not load drops.</p>'
  }
}
