const STORAGE_KEY = 'sf-feed-likes'

function readLikes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writeLikes(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function isFeedLiked(postId) {
  return Boolean(readLikes()[postId])
}

export function toggleFeedLike(postId) {
  const map = readLikes()
  const next = !map[postId]
  if (next) map[postId] = true
  else delete map[postId]
  writeLikes(map)
  return next
}

export function getFeedLikeCount(postId, baseLikes = 0) {
  return baseLikes + (isFeedLiked(postId) ? 1 : 0)
}

export function formatFeedLikeCount(count) {
  const n = Math.max(0, Number(count) || 0)
  const formatted = n.toLocaleString('en-ZA')
  return n === 1 ? '1 like' : `${formatted} likes`
}
