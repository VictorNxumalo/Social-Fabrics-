import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const CATALOGUE_SOURCES = [
  path.resolve(__dirname, '../../Catalogue'),
  path.resolve(__dirname, '../../Assets/Catalogue'),
]

export const MANIFEST_PATH = path.resolve(__dirname, '../../Catalogue/catalogue.json')
export const PRODUCTS_DEST = path.resolve(__dirname, '../public/assets/images/products')
export const PRODUCTS_JSON = path.resolve(__dirname, '../public/data/products.json')

const IMAGE_RE = /\.(jpe?g|png|webp|gif)$/i

function findSourceFile(filename) {
  for (const dir of CATALOGUE_SOURCES) {
    const full = path.join(dir, filename)
    if (fs.existsSync(full)) return full
  }
  return null
}

function safeExt(filename) {
  const ext = path.extname(filename).toLowerCase()
  return ext === '.jpeg' ? '.jpg' : ext || '.jpg'
}

export function syncCatalogue() {
  fs.mkdirSync(PRODUCTS_DEST, { recursive: true })
  fs.mkdirSync(path.dirname(PRODUCTS_JSON), { recursive: true })

  if (!fs.existsSync(MANIFEST_PATH)) {
    console.warn('catalogue.json not found — skipping catalogue sync')
    return 0
  }

  const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'))
  const usedDestFiles = new Set()

  const products = manifest.map((entry) => {
    const src = findSourceFile(entry.source)
    if (!src) {
      console.warn(`Missing source image: ${entry.source} (${entry.id})`)
    } else {
      const destName = `${entry.id}${safeExt(entry.source)}`
      const destPath = path.join(PRODUCTS_DEST, destName)
      fs.copyFileSync(src, destPath)
      usedDestFiles.add(destName)
    }

    const { source, imageFile, ...product } = entry
    return {
      ...product,
      image: `/assets/images/products/${entry.id}${safeExt(entry.source)}`,
    }
  })

  for (const file of fs.readdirSync(PRODUCTS_DEST)) {
    if (IMAGE_RE.test(file) && !usedDestFiles.has(file)) {
      fs.unlinkSync(path.join(PRODUCTS_DEST, file))
    }
  }

  fs.writeFileSync(PRODUCTS_JSON, `${JSON.stringify(products, null, 2)}\n`)
  return products.length
}

if (process.argv[1]?.endsWith('sync-catalogue.mjs')) {
  const count = syncCatalogue()
  console.log(`Catalogue synced: ${count} product${count === 1 ? '' : 's'}`)
}
