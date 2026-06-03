import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const GALLERY_SOURCES = [
  path.resolve(__dirname, '../../Gallery'),
  path.resolve(__dirname, '../../Assets/Gallery'),
]

export const GALLERY_DEST = path.resolve(__dirname, '../public/gallery')
export const GALLERY_JSON = path.resolve(__dirname, '../public/data/gallery.json')
export const LOOK_LINKS_PATH = path.resolve(__dirname, '../../Catalogue/look-links.json')

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i
const SPANS = ['hero', 'default', 'default', 'tall', 'wide', 'default', 'default', 'tall']

function collectGalleryFiles() {
  const files = new Map()

  for (const srcDir of GALLERY_SOURCES) {
    fs.mkdirSync(srcDir, { recursive: true })
    if (!fs.existsSync(srcDir)) continue

    for (const file of fs.readdirSync(srcDir)) {
      if (IMAGE_RE.test(file) && !files.has(file)) {
        files.set(file, srcDir)
      }
    }
  }

  return [...files.entries()].sort((a, b) =>
    a[0].localeCompare(b[0], undefined, { numeric: true }),
  )
}

function safeExt(filename) {
  const ext = path.extname(filename).toLowerCase()
  return ext === '.jpeg' ? '.jpg' : ext
}

export function syncGallery() {
  fs.mkdirSync(GALLERY_DEST, { recursive: true })
  fs.mkdirSync(path.dirname(GALLERY_JSON), { recursive: true })

  const entries = collectGalleryFiles()

  for (const file of fs.readdirSync(GALLERY_DEST)) {
    if (IMAGE_RE.test(file)) {
      fs.unlinkSync(path.join(GALLERY_DEST, file))
    }
  }

  const lookLinks = fs.existsSync(LOOK_LINKS_PATH)
    ? JSON.parse(fs.readFileSync(LOOK_LINKS_PATH, 'utf8'))
    : {}

  const items = entries.map(([file, srcDir], index) => {
    const lookId = `look-${String(index + 1).padStart(2, '0')}`
    const safeName = `${lookId}${safeExt(file)}`
    fs.copyFileSync(path.join(srcDir, file), path.join(GALLERY_DEST, safeName))

    const caption = `Look ${String(index + 1).padStart(2, '0')}`
    const productIds = lookLinks[lookId] || []

    return {
      id: lookId,
      src: `/gallery/${safeName}`,
      alt: `Social Fabric — ${caption}`,
      caption,
      span: SPANS[index % SPANS.length],
      ...(productIds.length ? { productIds } : {}),
    }
  })

  fs.writeFileSync(GALLERY_JSON, `${JSON.stringify(items, null, 2)}\n`)
  return items.length
}

if (process.argv[1]?.endsWith('sync-gallery.mjs')) {
  const count = syncGallery()
  console.log(`Gallery synced: ${count} image${count === 1 ? '' : 's'}`)
}
