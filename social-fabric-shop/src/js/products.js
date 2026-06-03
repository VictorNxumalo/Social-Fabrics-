let cache = null

export async function fetchProducts() {
  const res = await fetch('/data/products.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load products')
  cache = await res.json()
  return cache
}

export async function getFeaturedProducts(limit = 6) {
  const products = await fetchProducts()
  return products.filter((p) => p.featured).slice(0, limit)
}

export async function getProductById(id) {
  const products = await fetchProducts()
  return products.find((p) => p.id === id) ?? null
}

export async function getProductsByIds(ids) {
  if (!ids?.length) return []
  const products = await fetchProducts()
  return ids.map((id) => products.find((p) => p.id === id)).filter(Boolean)
}

export async function getLooksForProduct(productId) {
  const res = await fetch('/data/gallery.json', { cache: 'no-store' })
  if (!res.ok) return []
  const gallery = await res.json()
  return gallery.filter((item) => item.productIds?.includes(productId))
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
