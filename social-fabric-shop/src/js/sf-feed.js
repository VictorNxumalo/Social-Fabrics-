import { SITE } from './site-config.js'
import {
  formatFeedLikeCount,
  getFeedLikeCount,
  isFeedLiked,
  toggleFeedLike,
} from './sf-feed-likes.js'

const HEART_OUTLINE = `
  <svg class="sf-feed-heart-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M16.5 3c-1.74 0-3.41 1.01-4.5 2.09C10.91 4.01 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3Zm0 2c2.21 0 4 1.79 4 4 0 2.88-2.84 5.64-8 10.05C7.34 14.64 4.5 11.88 4.5 9c0-2.21 1.79-4 4-4 1.54 0 3.04 1.01 4 2.08.96-1.07 2.46-2.08 4-2.08Z"/>
  </svg>
`

const HEART_FILLED = `
  <svg class="sf-feed-heart-icon sf-feed-heart-icon--filled" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35Z"/>
  </svg>
`

export async function fetchSfFeed() {
  const res = await fetch('/data/sf-feed.json')
  if (!res.ok) throw new Error('Feed unavailable')
  return res.json()
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function heartMarkup(liked) {
  return liked ? HEART_FILLED : HEART_OUTLINE
}

function renderStoryRing(story, index) {
  const ready = story.videoReady !== false
  return `
    <button
      type="button"
      class="sf-feed-story ${ready ? '' : 'sf-feed-story--pending'}"
      data-story-open="${escapeHtml(story.id)}"
      data-story-index="${index}"
      aria-label="Watch ${escapeHtml(story.label)} story"
    >
      <span class="sf-feed-story-ring">
        <span class="sf-feed-story-thumb">
          ${
            ready
              ? `<video class="sf-feed-story-video" src="${escapeHtml(story.videoUrl)}" muted loop playsinline preload="metadata" aria-hidden="true"></video>`
              : `<span class="sf-feed-story-fallback font-display">SF</span>`
          }
        </span>
      </span>
      <span class="sf-feed-story-label font-mono">${escapeHtml(story.label)}</span>
    </button>
  `
}

export function renderStoriesStrip(stories, username) {
  if (!stories?.length) return ''

  return `
    <div class="sf-feed-stories-wrap">
      <div class="sf-feed-stories" role="list" aria-label="SF stories">
        ${stories.map((story, index) => `<div role="listitem">${renderStoryRing(story, index)}</div>`).join('')}
      </div>
      <a href="${SITE.instagram}" class="sf-feed-stories-link nav-link" target="_blank" rel="noopener noreferrer">
        @${escapeHtml(username)} on IG →
      </a>
    </div>
  `
}

export function renderFeedPost(post, username, location) {
  const liked = isFeedLiked(post.id)
  const likeCount = getFeedLikeCount(post.id, post.likes)
  const ready = post.videoReady !== false

  return `
    <article class="sf-feed-post" data-feed-post="${escapeHtml(post.id)}" data-reveal="up">
      <header class="sf-feed-post-head">
        <div class="sf-feed-avatar font-display" aria-hidden="true">SF</div>
        <div class="sf-feed-post-meta">
          <span class="sf-feed-user font-mono">@${escapeHtml(username)}</span>
          <span class="sf-feed-location font-mono">${escapeHtml(location)}</span>
        </div>
      </header>

      <div class="sf-feed-media" data-feed-media>
        ${
          ready
            ? `
          <video
            class="sf-feed-video"
            src="${escapeHtml(post.videoUrl)}"
            muted
            loop
            playsinline
            preload="metadata"
            aria-label="Social Fabric video post"
          ></video>
          <button type="button" class="sf-feed-mute-btn" aria-label="Unmute video" aria-pressed="false">🔇</button>
          <span class="sf-feed-double-tap-hint font-mono" aria-hidden="true">Double-tap to like</span>
        `
            : `
          <div class="sf-feed-media-fallback">
            <p class="font-mono text-xs uppercase tracking-[0.2em] opacity-50">Video loading soon</p>
          </div>
        `
        }
      </div>

      <div class="sf-feed-actions">
        <button
          type="button"
          class="sf-feed-like-btn ${liked ? 'is-liked' : ''}"
          data-feed-like="${escapeHtml(post.id)}"
          aria-pressed="${liked}"
          aria-label="${liked ? 'Unlike post' : 'Like post'}"
        >
          ${heartMarkup(liked)}
        </button>
        <p class="sf-feed-like-count font-mono" data-feed-like-count="${escapeHtml(post.id)}">
          ${formatFeedLikeCount(likeCount)}
        </p>
      </div>

      <p class="sf-feed-caption prose-body">
        <strong class="font-mono text-xs uppercase tracking-[0.12em]">@${escapeHtml(username)}</strong>
        ${escapeHtml(post.caption)}
      </p>
      <p class="sf-feed-time font-mono">${escapeHtml(post.timeAgo ?? '')} ago</p>
    </article>
  `
}

function renderStoryViewer(stories) {
  return `
    <div id="sf-story-viewer" class="sf-story-viewer" hidden aria-hidden="true">
      <div class="sf-story-viewer-backdrop" data-story-close aria-hidden="true"></div>
      <div class="sf-story-viewer-panel" role="dialog" aria-modal="true" aria-label="Story viewer">
        <div class="sf-story-viewer-progress" aria-hidden="true">
          ${stories.map((_, i) => `<span class="sf-story-progress-seg" data-story-seg="${i}"></span>`).join('')}
        </div>
        <button type="button" class="sf-story-viewer-close" data-story-close aria-label="Close story">✕</button>
        <video id="sf-story-viewer-video" class="sf-story-viewer-video" playsinline muted aria-label="Story video"></video>
        <div class="sf-story-viewer-nav">
          <button type="button" class="sf-story-viewer-prev" data-story-prev aria-label="Previous story">←</button>
          <button type="button" class="sf-story-viewer-next" data-story-next aria-label="Next story">→</button>
        </div>
        <p id="sf-story-viewer-label" class="sf-story-viewer-label font-mono"></p>
      </div>
    </div>
  `
}

function updateLikeUi(postId, baseLikes) {
  const liked = isFeedLiked(postId)
  const countEl = document.querySelector(`[data-feed-like-count="${postId}"]`)
  const btn = document.querySelector(`[data-feed-like="${postId}"]`)

  if (countEl) countEl.textContent = formatFeedLikeCount(getFeedLikeCount(postId, baseLikes))
  if (btn) {
    btn.classList.toggle('is-liked', liked)
    btn.setAttribute('aria-pressed', String(liked))
    btn.setAttribute('aria-label', liked ? 'Unlike post' : 'Like post')
    btn.innerHTML = heartMarkup(liked)
    if (liked) {
      btn.classList.add('sf-feed-like-pop')
      window.setTimeout(() => btn.classList.remove('sf-feed-like-pop'), 420)
    }
  }
}

function initFeedVideos(root) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) return

  const videos = root.querySelectorAll('.sf-feed-video, .sf-feed-story-video')
  if (!videos.length) return

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target
        if (!(video instanceof HTMLVideoElement)) return
        if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      })
    },
    { threshold: [0, 0.45, 0.75] },
  )

  videos.forEach((video) => observer.observe(video))
}

function initMuteButtons(root) {
  root.querySelectorAll('.sf-feed-mute-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const media = btn.closest('[data-feed-media]')
      const video = media?.querySelector('.sf-feed-video')
      if (!(video instanceof HTMLVideoElement)) return

      video.muted = !video.muted
      const muted = video.muted
      btn.setAttribute('aria-pressed', String(!muted))
      btn.setAttribute('aria-label', muted ? 'Unmute video' : 'Mute video')
      btn.textContent = muted ? '🔇' : '🔊'
      if (!muted) video.play().catch(() => {})
    })
  })
}

function initLikeButtons(root, posts) {
  const baseMap = Object.fromEntries(posts.map((p) => [p.id, p.likes ?? 0]))

  root.querySelectorAll('[data-feed-like]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const postId = btn.getAttribute('data-feed-like')
      if (!postId) return
      toggleFeedLike(postId)
      updateLikeUi(postId, baseMap[postId] ?? 0)
    })
  })

  root.querySelectorAll('[data-feed-media]').forEach((media) => {
    const article = media.closest('[data-feed-post]')
    const postId = article?.getAttribute('data-feed-post')
    if (!postId) return

    let lastTap = 0
    media.addEventListener('click', (event) => {
      if (event.target.closest('.sf-feed-mute-btn')) return
      const now = Date.now()
      if (now - lastTap < 320) {
        if (!isFeedLiked(postId)) toggleFeedLike(postId)
        updateLikeUi(postId, baseMap[postId] ?? 0)
        media.classList.add('sf-feed-media-liked')
        window.setTimeout(() => media.classList.remove('sf-feed-media-liked'), 520)
      }
      lastTap = now
    })
  })
}

function initStoryViewer(stories) {
  const viewer = document.getElementById('sf-story-viewer')
  const video = document.getElementById('sf-story-viewer-video')
  const label = document.getElementById('sf-story-viewer-label')
  if (!viewer || !(video instanceof HTMLVideoElement) || !stories.length) return

  let activeIndex = 0

  const segs = () => viewer.querySelectorAll('[data-story-seg]')

  const setOpen = (open) => {
    viewer.hidden = !open
    viewer.setAttribute('aria-hidden', String(!open))
    document.body.classList.toggle('sf-story-open', open)
    if (!open) {
      video.pause()
      video.removeAttribute('src')
    }
  }

  const showStory = (index) => {
    const story = stories[index]
    if (!story?.videoUrl) return

    activeIndex = index
    video.src = story.videoUrl
    video.currentTime = 0
    video.play().catch(() => {})

    if (label) label.textContent = story.label ?? ''
    segs().forEach((seg, i) => {
      seg.classList.toggle('is-active', i === index)
      seg.classList.toggle('is-done', i < index)
    })
  }

  document.querySelectorAll('[data-story-open]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const index = Number(btn.getAttribute('data-story-index') ?? 0)
      showStory(index)
      setOpen(true)
    })
  })

  viewer.querySelectorAll('[data-story-close]').forEach((el) => {
    el.addEventListener('click', () => setOpen(false))
  })

  viewer.querySelector('[data-story-prev]')?.addEventListener('click', () => {
    showStory(activeIndex > 0 ? activeIndex - 1 : stories.length - 1)
  })

  viewer.querySelector('[data-story-next]')?.addEventListener('click', () => {
    showStory(activeIndex < stories.length - 1 ? activeIndex + 1 : 0)
  })

  video.addEventListener('ended', () => {
    if (activeIndex < stories.length - 1) showStory(activeIndex + 1)
    else setOpen(false)
  })

  document.addEventListener('keydown', (event) => {
    if (viewer.hidden) return
    if (event.key === 'Escape') setOpen(false)
    if (event.key === 'ArrowLeft') showStory(activeIndex > 0 ? activeIndex - 1 : stories.length - 1)
    if (event.key === 'ArrowRight') showStory(activeIndex < stories.length - 1 ? activeIndex + 1 : 0)
  })
}

export function renderFeedSection(feed) {
  const { username, location, stories = [], posts = [] } = feed

  return `
    <section class="sf-feed-section section-rule" id="sf-feed" aria-labelledby="sf-feed-heading">
      <div class="sf-feed-section-head sf-pad-lg" data-reveal="up">
        <p class="wordmark mb-4 opacity-40">005 / Feed</p>
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <h2 id="sf-feed-heading" class="display-section">On the feed.</h2>
          <p class="prose-body max-w-md opacity-70">
            BTS clips, runway passes, and drop energy — styled like the timeline. Tap like to show love.
          </p>
        </div>
      </div>

      ${renderStoriesStrip(stories, username)}

      <div class="sf-feed-grid sf-pad-lg" data-reveal-stagger="70">
        ${posts.map((post) => renderFeedPost(post, username, location)).join('')}
      </div>

      ${renderStoryViewer(stories)}
    </section>
  `
}

export function initSfFeed(root, feed) {
  if (!root || !feed) return
  initFeedVideos(root)
  initMuteButtons(root)
  initLikeButtons(root, feed.posts ?? [])
  initStoryViewer(feed.stories ?? [])
}
