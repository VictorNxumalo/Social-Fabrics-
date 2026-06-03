import { prefersReducedMotion } from './motion.js'

export function initModelsHeroVideo() {
  const video = document.getElementById('models-hero-video')
  const stage = document.querySelector('.models-video-stage')
  if (!video || !stage) return

  if (prefersReducedMotion()) {
    video.pause()
    video.removeAttribute('autoplay')
    stage.classList.add('models-video-stage--static')
    return
  }

  requestAnimationFrame(() => {
    stage.classList.add('models-video-stage--live')
  })

  video.play().catch(() => {
    stage.classList.add('models-video-stage--paused')
  })
}
