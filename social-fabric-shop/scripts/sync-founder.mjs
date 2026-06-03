import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const FOUNDER_SOURCES = [
  path.resolve(__dirname, '../../Assets/Founder'),
  path.resolve(__dirname, '../../Founder'),
]

export const FOUNDER_DEST_DIR = path.resolve(__dirname, '../public/assets/images/founder')
export const FOUNDER_DEST = path.join(FOUNDER_DEST_DIR, 'yxngfrshmadala.png')

const IMAGE_RE = /\.(jpe?g|png|webp)$/i

export function syncFounder() {
  fs.mkdirSync(FOUNDER_DEST_DIR, { recursive: true })

  for (const srcDir of FOUNDER_SOURCES) {
    fs.mkdirSync(srcDir, { recursive: true })
    if (!fs.existsSync(srcDir)) continue

    const match = fs.readdirSync(srcDir).find((file) => IMAGE_RE.test(file))
    if (!match) continue

    const src = path.join(srcDir, match)
    const ext = path.extname(match).toLowerCase()
    const dest = ext === '.png' ? FOUNDER_DEST : path.join(FOUNDER_DEST_DIR, `yxngfrshmadala${ext}`)

    fs.copyFileSync(src, dest)
    console.log(`[sync-founder] ${match} → public/assets/images/founder/${path.basename(dest)}`)
    return dest
  }

  if (!fs.existsSync(FOUNDER_DEST)) {
    console.warn('[sync-founder] No founder image found. Add a photo to Assets/Founder/')
  }

  return null
}

if (process.argv[1]?.endsWith('sync-founder.mjs')) {
  syncFounder()
}
