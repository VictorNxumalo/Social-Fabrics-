import { getCartCount, initCartBadge } from './cart-store.js'
import { initMotion } from './motion.js'
import { SITE } from './site-config.js'

const NAV_LINKS = [
  { href: '/shop.html', label: 'Archive', index: '01' },
  { href: '/models.html', label: 'Models', index: '02' },
  { href: '/about.html', label: 'About', index: '03' },
]

const LOGO_DARK = '/assets/images/logo-dark.jpeg'
const LOGO_LIGHT = '/assets/images/logo-light.jpeg'

function isActiveLink(href, activePath) {
  return (
    activePath === href ||
    activePath.endsWith(href.replace('/', '')) ||
    (href === '/shop.html' && activePath.includes('shop'))
  )
}

function logoMarkup({ variant = 'solid' } = {}) {
  const isOverlay = variant === 'overlay'

  return `
    <a href="/" class="header-logo no-underline" aria-label="Social Fabric home">
      <span class="header-logo-mark font-display" aria-hidden="true">SF</span>
      <span class="header-logo-text">
        <span class="wordmark header-logo-wordmark">Social Fabric</span>
        <span class="header-logo-sub font-mono">House of Fabric</span>
      </span>
      <img
        id="${isOverlay ? 'logo-hero' : 'logo-nav'}"
        src="${isOverlay ? LOGO_DARK : LOGO_LIGHT}"
        alt=""
        class="header-logo-img sr-only"
        width="140"
        height="48"
      />
    </a>
  `
}

function initLogoImages() {
  document.querySelectorAll('#logo-hero, #logo-nav').forEach((img) => {
    img.addEventListener('error', () => {
      img.remove()
    })
  })
}

function navCellMarkup({ href, label, index }, activePath, variant) {
  const isActive = isActiveLink(href, activePath)
  return `
    <a
      href="${href}"
      class="nav-cell ${isActive ? 'is-active' : ''}"
      ${isActive ? 'aria-current="page"' : ''}
    >
      <span class="nav-cell-index font-mono" aria-hidden="true">${index}</span>
      <span class="nav-cell-label">${label}</span>
    </a>
  `
}

function cartMarkup(variant) {
  const count = getCartCount()
  const countHidden = count === 0 ? 'hidden' : ''

  return `
    <a href="/cart.html" class="nav-cart" aria-label="Cart${count ? `, ${count} items` : ''}">
      <span class="nav-cart-label">Cart</span>
      <span id="cart-count-badge" class="nav-cart-count font-mono ${countHidden}">${count || '0'}</span>
    </a>
  `
}

export function renderHeader({ variant = 'solid', activePath = '' } = {}) {
  const isOverlay = variant === 'overlay'
  const headerClass = isOverlay ? 'site-header header-overlay' : 'site-header header-solid'

  const navCells = NAV_LINKS.map((link) => navCellMarkup(link, activePath, variant)).join('')
  const mobileLinks = NAV_LINKS.map(({ href, label, index }) => {
    const isActive = isActiveLink(href, activePath)
    return `
      <a href="${href}" class="mobile-nav-link ${isActive ? 'is-active' : ''}" ${isActive ? 'aria-current="page"' : ''}>
        <span class="mobile-nav-index font-mono">${index}</span>
        <span class="mobile-nav-label font-display">${label}</span>
      </a>
    `
  }).join('')

  return `
    <header class="${headerClass}">
      <div class="header-rail" aria-hidden="true">
        <div class="header-rail-inner">
          <span class="header-rail-tag font-mono">East Rand / SA</span>
          <span class="header-rail-sep hidden sm:inline">—</span>
          <span class="header-rail-tag font-mono hidden sm:inline">Nationwide</span>
          <span class="header-rail-sep hidden md:inline">—</span>
          <span class="header-rail-tag font-mono hidden md:inline">Monochrome only</span>
        </div>
      </div>

      <div class="header-main">
        ${logoMarkup({ variant })}

        <nav class="header-nav hidden md:flex" aria-label="Main">
          ${navCells}
        </nav>

        <div class="header-actions">
          ${cartMarkup(variant)}
          <a href="/shop.html" class="nav-cta hidden sm:inline-flex">Enter drop</a>
          <button
            type="button"
            id="mobile-menu-btn"
            class="menu-trigger md:hidden"
            aria-expanded="false"
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <span class="menu-trigger-box" aria-hidden="true">
              <span class="menu-trigger-line"></span>
              <span class="menu-trigger-line"></span>
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        class="mobile-nav-overlay"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        aria-hidden="true"
      >
        <button type="button" class="mobile-nav-backdrop" data-mobile-nav-close aria-label="Close menu"></button>
        <div class="mobile-nav-panel ${isOverlay ? 'mobile-nav-panel--dark' : ''}">
          <div class="mobile-nav-head">
            <p class="wordmark opacity-40">Navigate</p>
            <button type="button" class="mobile-nav-close font-mono" data-mobile-nav-close aria-label="Close menu">Close ✕</button>
          </div>
          <nav class="mobile-nav-links" aria-label="Mobile">
            ${mobileLinks}
          </nav>
          <div class="mobile-nav-foot">
            <p class="font-mono text-[10px] uppercase tracking-[0.25em] opacity-50">Tsakane · East Rand</p>
            <a href="/shop.html" class="btn-brutal-filled mobile-nav-cta">Enter the drop</a>
          </div>
        </div>
      </div>
    </header>
  `
}

export function renderFooter() {
  return `
    <footer class="border-t-2 border-sf-white bg-sf-black text-sf-white">
      <div class="grid border-b-2 border-sf-white/20 md:grid-cols-12">
        <div class="border-b-2 border-sf-white/20 sf-pad md:col-span-5 md:border-b-0 md:border-r-2" data-reveal="up">
          <img src="${LOGO_DARK}" alt="Social Fabric" class="mb-6 h-16 w-auto" width="200" height="80" />
          <p class="display-section max-w-md">
            A movement, not a moodboard.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-6 border-b-2 border-sf-white/20 sf-pad md:col-span-4 md:border-b-0 md:border-r-2" data-reveal="up" data-reveal-delay="80">
          <nav class="flex flex-col gap-4" aria-label="Footer">
            <span class="wordmark opacity-40">Navigate</span>
            <a href="/shop.html" class="nav-link text-left">Shop</a>
            <a href="/models.html" class="nav-link text-left">Models</a>
            <a href="/about.html" class="nav-link text-left">About</a>
            <a href="/cart.html" class="nav-link text-left">Cart</a>
            <a href="/delivery.html" class="nav-link text-left">Delivery</a>
          </nav>
          <div class="flex flex-col gap-4">
            <span class="wordmark opacity-40">Connect</span>
            <a href="${SITE.instagram}" class="nav-link" target="_blank" rel="noopener noreferrer">${SITE.instagramHandle}</a>
            <a href="mailto:${SITE.email}" class="nav-link">${SITE.email}</a>
          </div>
        </div>

        <div class="flex flex-col justify-between sf-pad md:col-span-3" data-reveal="up" data-reveal-delay="160">
          <p class="font-mono text-xs leading-relaxed opacity-50">
            Tsakane · East Rand<br />
            Nationwide delivery.<br />
            Monochrome only.
          </p>
          <p class="wordmark mt-8 opacity-30">
            &copy; ${new Date().getFullYear()} Social Fabric
          </p>
        </div>
      </div>

      <div class="overflow-hidden py-4 opacity-30">
        <p class="wordmark whitespace-nowrap text-center text-[9px]">
          SOCIAL FABRIC — HOUSE OF FABRIC — INDEPENDENCE — GIVING BACK — EAST RAND — SOCIAL FABRIC — HOUSE OF FABRIC —
        </p>
      </div>
    </footer>
  `
}

export function initLayout({ variant = 'solid', activePath = '' } = {}) {
  const headerEl = document.getElementById('site-header')
  const footerEl = document.getElementById('site-footer')

  if (headerEl) headerEl.innerHTML = renderHeader({ variant, activePath })
  if (footerEl) footerEl.innerHTML = renderFooter()

  initMobileMenu()
  initLogoImages()
  initHeaderScroll()
  initCartBadge()
  initMotion()
}

function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn')
  const menu = document.getElementById('mobile-menu')
  if (!btn || !menu) return

  const closeEls = menu.querySelectorAll('[data-mobile-nav-close]')

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open)
    btn.classList.toggle('is-open', open)
    btn.setAttribute('aria-expanded', String(open))
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    menu.setAttribute('aria-hidden', String(!open))
    document.body.classList.toggle('nav-open', open)
  }

  btn.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'))
  })

  closeEls.forEach((el) => {
    el.addEventListener('click', () => setOpen(false))
  })

  menu.querySelectorAll('.mobile-nav-link').forEach((link) => {
    link.addEventListener('click', () => setOpen(false))
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.classList.contains('is-open')) {
      setOpen(false)
    }
  })
}

function initHeaderScroll() {
  const header = document.querySelector('.site-header')
  if (!header) return

  const onScroll = () => {
    header.classList.toggle('header-scrolled', window.scrollY > 24)
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
}
