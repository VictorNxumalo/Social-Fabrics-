import { renderImg, DEFAULT_SIZES } from './image-utils.js'

let cache = null

export async function fetchGallery() {
  const res = await fetch('/data/gallery.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load gallery')
  cache = await res.json()
  return cache
}

const SPAN_CLASS = {
  hero: 'models-item-hero',
  tall: 'models-item-tall',
  wide: 'models-item-wide',
  default: 'models-item-default',
}

export function renderGalleryItem(item, index) {
  const spanClass = SPAN_CLASS[item.span] || SPAN_CLASS.default
  const num = String(index + 1).padStart(2, '0')

  return `
    <article class="models-item ${spanClass} group" id="${item.id}" data-reveal="clip">
      <button
        type="button"
        class="models-item-btn"
        data-gallery-index="${index}"
        aria-label="View ${item.caption}"
      >
        <div class="models-item-frame">
          <span class="models-item-index font-display" aria-hidden="true">${num}</span>
          ${renderImg({
            src: item.src,
            alt: item.alt,
            className: 'models-item-img',
            width: 800,
            height: 1000,
            sizes: DEFAULT_SIZES.gallery,
            priority: index < 2,
            loading: index < 4 ? 'eager' : 'lazy',
          })}
          <div class="models-item-overlay">
            <span class="wordmark opacity-70">View</span>
            <p class="models-item-caption">${item.caption}</p>
            ${item.productIds?.length ? `<a href="/product.html?id=${item.productIds[0]}" class="look-chip" onclick="event.stopPropagation()">Shop this fit →</a>` : ''}
          </div>
        </div>
      </button>
    </article>
  `
}

export function renderEmptyGallery() {
  return `
    <div class="models-empty-state col-span-full">
      <p class="font-display text-3xl font-extrabold uppercase md:text-4xl">Drop your looks.</p>
      <p class="mt-4 max-w-md font-light leading-relaxed opacity-60">
        Add images to the <span class="font-mono text-sm">Gallery/</span> folder at the project root.
        They sync automatically when you run the dev server.
      </p>
      <p class="mt-6 font-mono text-xs opacity-40">
        JPG · PNG · WebP · GIF
      </p>
    </div>
  `
}

export function renderGalleryMeta(count) {
  if (count === 0) return '0 looks — awaiting material'
  return `${count} look${count === 1 ? '' : 's'} — shot in monochrome`
}
