const MOBILE_MQ = '(max-width: 767px)'

/** Keeps mobile layout height and header offset in sync with the visible viewport. */
export function initMobileViewport() {
  const root = document.documentElement
  const mq = window.matchMedia(MOBILE_MQ)

  const setViewportHeight = () => {
    root.style.setProperty('--sf-vh', `${window.innerHeight * 0.01}px`)
  }

  const setHeaderHeight = () => {
    const header = document.querySelector('.site-header')
    if (!header) return
    root.style.setProperty('--sf-header-height', `${header.offsetHeight}px`)
  }

  const refresh = () => {
    setViewportHeight()
    setHeaderHeight()
  }

  refresh()
  window.addEventListener('resize', refresh, { passive: true })
  window.addEventListener('orientationchange', refresh, { passive: true })

  mq.addEventListener('change', refresh)

  const header = document.querySelector('.site-header')
  if (header && typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(setHeaderHeight)
    observer.observe(header)
  }
}
