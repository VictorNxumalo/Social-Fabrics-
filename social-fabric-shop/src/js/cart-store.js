const CART_KEY = 'sf-cart'
export const CART_EVENT = 'sf-cart-updated'

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

export function getCartCount() {
  return getCart().reduce((sum, item) => sum + item.quantity, 0)
}

export function getCartSubtotal() {
  return getCart().reduce((sum, item) => sum + item.price * item.quantity, 0)
}

function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
  window.dispatchEvent(new CustomEvent(CART_EVENT))
}

export function addToCart({ productId, name, price, size, image, quantity = 1 }) {
  const cart = getCart()
  const key = `${productId}::${size}`
  const existing = cart.find((item) => `${item.productId}::${item.size}` === key)

  if (existing) {
    existing.quantity += quantity
  } else {
    cart.push({ productId, name, price, size, image, quantity })
  }

  saveCart(cart)
}

export function updateCartQuantity(productId, size, quantity) {
  const cart = getCart()
  const item = cart.find((i) => i.productId === productId && i.size === size)
  if (!item) return

  if (quantity <= 0) {
    saveCart(cart.filter((i) => !(i.productId === productId && i.size === size)))
    return
  }

  item.quantity = quantity
  saveCart(cart)
}

export function removeFromCart(productId, size) {
  saveCart(getCart().filter((i) => !(i.productId === productId && i.size === size)))
}

export function clearCart() {
  saveCart([])
}

export function initCartBadge() {
  const refresh = () => {
    const count = getCartCount()
    document.querySelectorAll('#cart-count-badge').forEach((badge) => {
      badge.textContent = String(count)
      badge.classList.toggle('hidden', count === 0)
      badge.setAttribute('aria-label', `${count} items in cart`)
    })
  }

  window.addEventListener(CART_EVENT, refresh)
  refresh()
}
