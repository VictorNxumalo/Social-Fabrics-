import {
  getCart,
  getCartSubtotal,
  updateCartQuantity,
  removeFromCart,
} from './cart-store.js'
import { formatPrice } from './products.js'

export function initCartPage() {
  const root = document.getElementById('cart-root')
  if (!root) return

  renderCart(root)

  root.addEventListener('click', (event) => {
    const dec = event.target.closest('[data-qty-dec]')
    const inc = event.target.closest('[data-qty-inc]')
    const remove = event.target.closest('[data-remove]')

    if (dec) {
      const { productId, size, qty } = dec.dataset
      updateCartQuantity(productId, size, Number(qty) - 1)
      renderCart(root)
    }

    if (inc) {
      const { productId, size, qty } = inc.dataset
      updateCartQuantity(productId, size, Number(qty) + 1)
      renderCart(root)
    }

    if (remove) {
      removeFromCart(remove.dataset.productId, remove.dataset.size)
      renderCart(root)
    }
  })
}

function renderCart(root) {
  const cart = getCart()

  if (cart.length === 0) {
    root.innerHTML = `
      <section class="section-rule sf-pad-lg">
        <p class="wordmark mb-4 opacity-40">Your bag</p>
        <h1 class="display-section">Empty for now.</h1>
        <p class="prose-body mt-4 max-w-md opacity-70">Nothing in the bag yet. Unfold a piece in the archive, reveal the price, and add it on your terms.</p>
        <a href="/shop.html" class="btn-brutal-filled mt-8 inline-flex">Enter the archive</a>
      </section>
    `
    return
  }

  const subtotal = getCartSubtotal()

  root.innerHTML = `
    <section class="section-rule">
      <div class="border-b-2 border-sf-white sf-pad">
        <p class="wordmark mb-2 opacity-40">Your bag</p>
        <h1 class="display-section">${cart.length} piece${cart.length === 1 ? '' : 's'} selected</h1>
      </div>

      <ul class="cart-lines">
        ${cart.map(renderLine).join('')}
      </ul>

      <div class="cart-summary grid md:grid-cols-2">
        <div class="border-b-2 border-sf-white sf-pad md:border-b-0 md:border-r-2">
          <p class="wordmark mb-2 opacity-40">Subtotal</p>
          <p class="font-display text-3xl font-extrabold">${formatPrice(subtotal)}</p>
          <p class="prose-body mt-3 opacity-50">Shipping calculated at checkout. Nationwide delivery across SA.</p>
        </div>
        <div class="flex flex-col justify-center gap-4 sf-pad">
          <a href="/checkout.html" class="btn-brutal-filled w-full justify-center">Proceed to checkout</a>
          <a href="/shop.html" class="btn-brutal w-full justify-center border-sf-white text-sf-white">Continue shopping</a>
        </div>
      </div>
    </section>
  `
}

function renderLine(item) {
  return `
    <li class="cart-line grid border-b-2 border-sf-white md:grid-cols-[6rem_1fr_auto]">
      <div class="cart-line-img border-b-2 border-sf-white md:border-b-0 md:border-r-2">
        <img src="${item.image}" alt="" class="h-full w-full object-cover" width="96" height="120" loading="lazy" decoding="async" />
      </div>
      <div class="sf-pad">
        <h2 class="font-display text-base font-bold uppercase md:text-lg">${item.name}</h2>
        <p class="mt-1 font-mono text-xs opacity-50">Size · ${item.size}</p>
        <p class="mt-2 font-mono text-sm">${formatPrice(item.price)}</p>
      </div>
      <div class="flex flex-col items-end justify-between gap-4 sf-pad">
        <button type="button" class="nav-link" data-remove data-product-id="${item.productId}" data-size="${item.size}">Remove</button>
        <div class="qty-control flex items-center gap-2 border-2 border-sf-white">
          <button type="button" class="qty-btn" data-qty-dec data-product-id="${item.productId}" data-size="${item.size}" data-qty="${item.quantity}" aria-label="Decrease quantity">−</button>
          <span class="font-mono text-sm px-2">${item.quantity}</span>
          <button type="button" class="qty-btn" data-qty-inc data-product-id="${item.productId}" data-size="${item.size}" data-qty="${item.quantity}" aria-label="Increase quantity">+</button>
        </div>
      </div>
    </li>
  `
}
