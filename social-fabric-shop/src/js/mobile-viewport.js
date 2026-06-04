/** Keeps mobile layout height in sync with visible viewport (browser chrome). */
export function initMobileViewport() {
  const root = document.documentElement

  const setViewportHeight = () => {
    root.style.setProperty('--sf-vh', `${window.innerHeight * 0.01}px`)
  }

  setViewportHeight()
  window.addEventListener('resize', setViewportHeight, { passive: true })
  window.addEventListener('orientationchange', setViewportHeight, { passive: true })
}
