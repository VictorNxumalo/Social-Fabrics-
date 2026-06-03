let revealObserver = null

export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function initMotion() {
  if (prefersReducedMotion()) {
    document.documentElement.classList.add('motion-reduced')
    document.querySelectorAll('[data-reveal]').forEach((el) => el.classList.add('is-visible'))
    return
  }

  initScrollReveal(document)
  initHeroEntrance()
  initScrollCue()
}

export function refreshScrollReveal(root = document) {
  if (prefersReducedMotion()) return

  applyStaggerDelays(root)
  root.querySelectorAll('[data-reveal]:not(.is-visible)').forEach((el) => {
    revealObserver?.observe(el)
  })
}

function initScrollReveal(root) {
  applyStaggerDelays(root)

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        revealObserver.unobserve(entry.target)
      })
    },
    { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
  )

  root.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el))
}

function applyStaggerDelays(root) {
  root.querySelectorAll('[data-reveal-stagger]').forEach((parent) => {
    const step = Number(parent.dataset.revealStagger) || 70
    ;[...parent.children].forEach((child, index) => {
      if (!child.hasAttribute('data-reveal')) return
      const extra = Number(child.dataset.revealDelay) || 0
      child.style.setProperty('--reveal-delay', `${index * step + extra}ms`)
    })
  })

  root.querySelectorAll('[data-reveal][data-reveal-delay]').forEach((el) => {
    if (!el.closest('[data-reveal-stagger]')) {
      el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`)
    }
  })
}

function initHeroEntrance() {
  const hero = document.querySelector('.hero-split')
  if (!hero) return

  requestAnimationFrame(() => {
    hero.classList.add('hero-entrance-active')
  })
}

function initScrollCue() {
  const cue = document.querySelector('[data-scroll-cue]')
  if (!cue) return

  const hide = () => {
    cue.classList.add('scroll-cue-hidden')
    window.removeEventListener('scroll', hide)
  }

  window.addEventListener('scroll', hide, { passive: true, once: true })
}
