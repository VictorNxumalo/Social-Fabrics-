export function initLightbox(items) {
  const root = document.getElementById('gallery-lightbox')
  const img = document.getElementById('lightbox-img')
  const caption = document.getElementById('lightbox-caption')
  const counter = document.getElementById('lightbox-counter')
  const grid = document.getElementById('gallery-grid')

  if (!root || !img || !caption || !counter || !grid || items.length === 0) return

  let currentIndex = 0
  let lastFocus = null

  function show(index, { animate = true } = {}) {
    currentIndex = (index + items.length) % items.length
    const item = items[currentIndex]

    const apply = () => {
      img.src = item.src
      img.alt = item.alt
      caption.textContent = item.caption
      counter.textContent = `${String(currentIndex + 1).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`
      img.classList.remove('is-swapping')
    }

    if (!animate) {
      apply()
      return
    }

    img.classList.add('is-swapping')
    window.setTimeout(apply, 120)
  }

  function open(index) {
    lastFocus = document.activeElement
    show(index, { animate: false })
    root.hidden = false
    root.classList.remove('hidden')
    document.body.classList.add('lightbox-open')
    root.querySelector('[data-lightbox-close]')?.focus()
  }

  function close() {
    root.hidden = true
    root.classList.add('hidden')
    document.body.classList.remove('lightbox-open')
    img.src = ''
    lastFocus?.focus()
  }

  grid.addEventListener('click', (event) => {
    const btn = event.target.closest('[data-gallery-index]')
    if (!btn) return
    open(Number(btn.dataset.galleryIndex))
  })

  root.querySelectorAll('[data-lightbox-close]').forEach((el) => {
    el.addEventListener('click', close)
  })

  root.querySelector('[data-lightbox-prev]')?.addEventListener('click', () => show(currentIndex - 1))
  root.querySelector('[data-lightbox-next]')?.addEventListener('click', () => show(currentIndex + 1))

  let touchStartX = 0
  root.addEventListener(
    'touchstart',
    (event) => {
      if (root.hidden) return
      touchStartX = event.changedTouches[0]?.screenX ?? 0
    },
    { passive: true },
  )

  root.addEventListener(
    'touchend',
    (event) => {
      if (root.hidden) return
      const touchEndX = event.changedTouches[0]?.screenX ?? 0
      const delta = touchEndX - touchStartX
      if (Math.abs(delta) < 48) return
      show(currentIndex + (delta > 0 ? -1 : 1))
    },
    { passive: true },
  )

  document.addEventListener('keydown', (event) => {
    if (root.hidden) return
    if (event.key === 'Escape') close()
    if (event.key === 'ArrowLeft') show(currentIndex - 1)
    if (event.key === 'ArrowRight') show(currentIndex + 1)
  })
}
