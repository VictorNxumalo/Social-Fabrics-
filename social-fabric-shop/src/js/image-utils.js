const DEFAULT_SIZES = {
  product: '(max-width: 480px) 88vw, (max-width: 768px) 45vw, 400px',
  gallery: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw',
  archive: '(max-width: 768px) 100vw, 50vw',
  hero: '100vw',
}

export function imgAttrs({
  src,
  alt,
  width,
  height,
  loading = 'lazy',
  sizes,
  priority = false,
} = {}) {
  return {
    src,
    alt,
    width,
    height,
    loading: priority ? 'eager' : loading,
    decoding: 'async',
    ...(sizes ? { sizes } : {}),
    ...(priority ? { fetchpriority: 'high' } : {}),
  }
}

export function renderImg({ className = '', ...attrs }) {
  const { src, alt, width, height, loading, decoding, sizes, fetchpriority } = imgAttrs(attrs)
  const sizeAttr = sizes ? ` sizes="${sizes}"` : ''
  const priorityAttr = fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''

  return `<img
            src="${src}"
            alt="${alt}"
            class="${className}"
            width="${width}"
            height="${height}"
            loading="${loading}"
            decoding="${decoding}"${sizeAttr}${priorityAttr}
          />`
}

export { DEFAULT_SIZES }
