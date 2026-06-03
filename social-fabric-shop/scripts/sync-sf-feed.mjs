import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const FEED_SOURCES = [
  path.resolve(__dirname, '../../Catalogue/sf-feed.json'),
  path.resolve(__dirname, '../Catalogue/sf-feed.json'),
]

const VIDEO_DIR = path.resolve(__dirname, '../public/assets/video')
const OUT = path.resolve(__dirname, '../public/data/sf-feed.json')

const CATALOGUE_VIDEO_DIRS = [
  path.resolve(__dirname, '../../Assets/Catalogue'),
  path.resolve(__dirname, '../../Catalogue'),
  path.resolve(__dirname, '../Assets/Catalogue'),
]

function resolveFeedSource() {
  return FEED_SOURCES.find((file) => fs.existsSync(file)) ?? null
}

function findCatalogueVideo(filename) {
  for (const dir of CATALOGUE_VIDEO_DIRS) {
    const candidate = path.join(dir, filename)
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

function copyFeedVideo(entry) {
  const destName = entry.video
  if (!destName) return false

  const sourceName = entry.source ?? destName
  const src = findCatalogueVideo(sourceName)
  if (!src) return false

  fs.mkdirSync(VIDEO_DIR, { recursive: true })
  const dest = path.join(VIDEO_DIR, destName)
  const srcStat = fs.statSync(src)

  if (fs.existsSync(dest)) {
    const destStat = fs.statSync(dest)
    if (destStat.size === srcStat.size && destStat.mtimeMs >= srcStat.mtimeMs) {
      return true
    }
  }

  const tempDest = `${dest}.tmp`
  try {
    fs.copyFileSync(src, tempDest)
    fs.renameSync(tempDest, dest)
  } catch (err) {
    try {
      if (fs.existsSync(tempDest)) fs.unlinkSync(tempDest)
    } catch {
      /* ignore */
    }
    if (err?.code === 'EBUSY' || err?.code === 'EPERM') {
      console.warn(`[sync-sf-feed] Could not refresh ${destName} (file locked) — using existing copy`)
      return fs.existsSync(dest)
    }
    throw err
  }

  console.log(`[sync-sf-feed] ${sourceName} → public/assets/video/${destName}`)
  return true
}

function syncFeedVideos(entries) {
  const seen = new Set()
  for (const entry of entries) {
    const key = `${entry.source ?? ''}:${entry.video}`
    if (!entry.video || seen.has(key)) continue
    seen.add(key)
    copyFeedVideo(entry)
  }
}

function videoUrl(filename) {
  return `/assets/video/${filename}`
}

function enrichEntry(entry, type) {
  const file = entry.video
  const diskPath = path.join(VIDEO_DIR, file)
  const exists = fs.existsSync(diskPath)

  if (!exists) {
    console.warn(`[sync-sf-feed] Missing video for ${type} "${entry.id}": ${file}`)
  }

  return {
    ...entry,
    videoUrl: videoUrl(file),
    videoReady: exists,
  }
}

export function syncSfFeed() {
  const source = resolveFeedSource()
  if (!source) {
    console.warn('[sync-sf-feed] Catalogue/sf-feed.json not found — skipping')
    return null
  }

  const raw = JSON.parse(fs.readFileSync(source, 'utf8'))
  syncFeedVideos([...(raw.stories ?? []), ...(raw.posts ?? [])])

  const feed = {
    username: raw.username ?? 'socialfabric_onlinestore',
    location: raw.location ?? 'Tsakane · East Rand',
    stories: (raw.stories ?? []).map((item) => enrichEntry(item, 'story')),
    posts: (raw.posts ?? []).map((item) => enrichEntry(item, 'post')),
  }

  fs.mkdirSync(path.dirname(OUT), { recursive: true })
  fs.writeFileSync(OUT, `${JSON.stringify(feed, null, 2)}\n`, 'utf8')
  console.log(
    `[sync-sf-feed] ${feed.stories.length} stories, ${feed.posts.length} posts → public/data/sf-feed.json`,
  )
  return OUT
}

if (process.argv[1]?.endsWith('sync-sf-feed.mjs')) {
  syncSfFeed()
}
