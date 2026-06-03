import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const MODEL_VIDEO_SOURCES = [
  path.resolve(__dirname, '../../Assets/Catalogue'),
  path.resolve(__dirname, '../../Catalogue'),
]

export const MODEL_VIDEO_DEST_DIR = path.resolve(__dirname, '../public/assets/video')
export const MODEL_VIDEO_DEST = path.join(MODEL_VIDEO_DEST_DIR, 'models-walk.mp4')

const VIDEO_RE = /\.mp4$/i

function findModelVideo(dir) {
  if (!fs.existsSync(dir)) return null

  const files = fs.readdirSync(dir)
  const exact = files.find((file) => file === 'SF. Model video $k.mp4')
  if (exact) return path.join(dir, exact)

  const match = files.find((file) => VIDEO_RE.test(file) && /model/i.test(file))
  return match ? path.join(dir, match) : null
}

export function syncModelsVideo() {
  fs.mkdirSync(MODEL_VIDEO_DEST_DIR, { recursive: true })

  for (const srcDir of MODEL_VIDEO_SOURCES) {
    const src = findModelVideo(srcDir)
    if (!src) continue

    fs.copyFileSync(src, MODEL_VIDEO_DEST)
    console.log(`[sync-models-video] ${path.basename(src)} → public/assets/video/models-walk.mp4`)
    return MODEL_VIDEO_DEST
  }

  if (!fs.existsSync(MODEL_VIDEO_DEST)) {
    console.warn('[sync-models-video] No model video found in Assets/Catalogue/')
  }

  return null
}

if (process.argv[1]?.endsWith('sync-models-video.mjs')) {
  syncModelsVideo()
}
