const MANIFESTO_ITEMS = [
  'House of Fabric',
  'Independence',
  'Giving back',
  'East Rand',
  'Generation SF',
  'Nationwide',
  'Creative rebellion',
  'Refuse the palette',
]

const HOME_BG_ROW_COUNT = 8
const HOME_BG_PHRASE = 'Social Fabric · '

function homeBgWaveSegment() {
  return HOME_BG_PHRASE.repeat(28)
}

/** Repeating “Social Fabric” rows that drift horizontally with a soft vertical wave. */
export function renderHomeBgWaves() {
  const segment = homeBgWaveSegment()

  return Array.from({ length: HOME_BG_ROW_COUNT }, (_, i) => {
    const tilt = i % 2 === 0 ? '-0.75deg' : '0.75deg'
    return `
      <div class="home-bg-wave-row" style="--wave-row: ${i}; --wave-tilt: ${tilt}">
        <div class="home-bg-wave-track">
          <span class="home-bg-wave-chunk">${segment}</span>
          <span class="home-bg-wave-chunk" aria-hidden="true">${segment}</span>
        </div>
      </div>
    `
  }).join('')
}

export function renderMarquee() {
  const segment = MANIFESTO_ITEMS.map(
    (text) => `<span class="marquee-item">${text}</span><span class="marquee-sep">///</span>`,
  ).join('')

  return `
    <div class="marquee-wrap" aria-hidden="true">
      <div class="marquee-track">
        ${segment}${segment}
      </div>
    </div>
  `
}

export function initHeroVideo() {
  const video = document.getElementById('hero-video')
  if (!video) return

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    video.pause()
    video.removeAttribute('autoplay')
    return
  }

  video.play().catch(() => {
    /* autoplay blocked — poster frame still visible */
  })
}
