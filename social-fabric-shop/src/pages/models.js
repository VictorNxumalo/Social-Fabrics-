import '../style.css'
import { initLayout } from '../js/layout.js'
import {
  fetchGallery,
  renderGalleryItem,
  renderEmptyGallery,
  renderGalleryMeta,
} from '../js/gallery.js'
import { initLightbox } from '../js/lightbox.js'
import { refreshScrollReveal } from '../js/motion.js'
import { initModelsHeroVideo } from '../js/models-hero.js'
import { fetchSfFeed, initSfFeed, renderFeedSection } from '../js/sf-feed.js'

initLayout({ activePath: '/models.html' })
initModelsHeroVideo()
renderSfFeed()
renderGallery()

async function renderSfFeed() {
  const root = document.getElementById('sf-feed-root')
  if (!root) return

  try {
    const feed = await fetchSfFeed()
    root.innerHTML = renderFeedSection(feed)
    initSfFeed(root, feed)
    refreshScrollReveal(root)
  } catch (err) {
    console.error('SF feed failed to load:', err)
    root.innerHTML = ''
  }
}

async function renderGallery() {
  const grid = document.getElementById('gallery-grid')
  const meta = document.getElementById('gallery-meta')
  if (!grid) return

  try {
    const items = await fetchGallery()

    if (meta) meta.textContent = renderGalleryMeta(items.length)

    if (items.length === 0) {
      grid.innerHTML = renderEmptyGallery()
      return
    }

    grid.innerHTML = items.map((item, index) => renderGalleryItem(item, index)).join('')
    initLightbox(items)
    refreshScrollReveal(grid)
  } catch (err) {
    console.error('Gallery failed to load:', err)
    grid.innerHTML = renderEmptyGallery()
    if (meta) meta.textContent = 'Gallery unavailable'
  }
}
