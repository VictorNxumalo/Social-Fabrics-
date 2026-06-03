import { getCart, getCartSubtotal, clearCart } from './cart-store.js'
import { formatPrice } from './products.js'
import { SITE } from './site-config.js'

export function initCheckoutPage() {
  const root = document.getElementById('checkout-root')
  if (!root) return

  renderCheckout(root)

  root.addEventListener('submit', (event) => {
    const form = event.target.closest('#checkout-form')
    if (!form) return
    event.preventDefault()

    if (!form.reportValidity()) return

    const data = Object.fromEntries(new FormData(form))
    clearCart()
    root.innerHTML = renderThankYou(data)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

function renderCheckout(root) {
  const cart = getCart()

  if (cart.length === 0) {
    root.innerHTML = `
      <section class="section-rule sf-pad-lg">
        <p class="wordmark mb-4 opacity-40">Checkout</p>
        <h1 class="display-section">Your bag is empty.</h1>
        <a href="/shop.html" class="btn-brutal-filled mt-8 inline-flex">Shop the archive</a>
      </section>
    `
    return
  }

  const subtotal = getCartSubtotal()

  root.innerHTML = `
    <section class="section-rule checkout-layout grid md:grid-cols-12">
      <div class="border-b-2 border-sf-white md:col-span-7 md:border-b-0 md:border-r-2">
        <div class="border-b-2 border-sf-white sf-pad">
          <p class="wordmark mb-2 opacity-40">Checkout</p>
          <h1 class="display-section">Complete your order</h1>
          <p class="prose-body mt-3 opacity-60">MVP checkout — no payment processed yet. We will confirm via email.</p>
        </div>

        <form id="checkout-form" class="checkout-form sf-pad-lg space-y-5">
          <div class="form-field">
            <label class="wordmark mb-2 block opacity-50" for="name">Full name</label>
            <input class="form-input" id="name" name="name" type="text" required autocomplete="name" />
          </div>
          <div class="form-field">
            <label class="wordmark mb-2 block opacity-50" for="email">Email</label>
            <input class="form-input" id="email" name="email" type="email" required autocomplete="email" />
          </div>
          <div class="form-field">
            <label class="wordmark mb-2 block opacity-50" for="phone">Phone</label>
            <input class="form-input" id="phone" name="phone" type="tel" required autocomplete="tel" />
          </div>
          <div class="form-field">
            <label class="wordmark mb-2 block opacity-50" for="address">Street address</label>
            <input class="form-input" id="address" name="address" type="text" required autocomplete="street-address" />
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="form-field">
              <label class="wordmark mb-2 block opacity-50" for="city">City</label>
              <input class="form-input" id="city" name="city" type="text" required autocomplete="address-level2" />
            </div>
            <div class="form-field">
              <label class="wordmark mb-2 block opacity-50" for="province">Province</label>
              <input class="form-input" id="province" name="province" type="text" required autocomplete="address-level1" />
            </div>
          </div>
          <div class="form-field">
            <label class="wordmark mb-2 block opacity-50" for="postal">Postal code</label>
            <input class="form-input" id="postal" name="postal" type="text" required autocomplete="postal-code" />
          </div>
          <button type="submit" class="btn-brutal-filled w-full justify-center">Place order</button>
        </form>
      </div>

      <div class="checkout-summary sf-pad-lg md:col-span-5">
        <p class="wordmark mb-4 opacity-40">Order summary</p>
        <ul class="space-y-4">
          ${cart
            .map(
              (item) => `
            <li class="flex justify-between gap-4 border-b border-sf-white/20 pb-3">
              <span class="text-sm">${item.name} · ${item.size} × ${item.quantity}</span>
              <span class="font-mono text-sm">${formatPrice(item.price * item.quantity)}</span>
            </li>
          `,
            )
            .join('')}
        </ul>
        <p class="mt-6 flex justify-between font-display text-xl font-extrabold">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </p>
        <p class="prose-body mt-4 opacity-50">Questions? ${SITE.email}</p>
        <a href="/delivery.html" class="nav-link mt-4 inline-flex">Delivery info →</a>
      </div>
    </section>
  `
}

function renderThankYou(data) {
  return `
    <section class="section-rule sf-pad-lg text-center md:text-left">
      <p class="wordmark mb-4 opacity-40">Order received</p>
      <h1 class="display-large">Thank you, ${escapeHtml(data.name.split(' ')[0])}.</h1>
      <p class="prose-body mx-auto mt-6 max-w-lg opacity-80 md:mx-0">
        Your order request is in. This is an MVP — no payment was taken. The Social Fabric team will reach out at
        <strong class="font-medium">${escapeHtml(data.email)}</strong> to confirm delivery to
        ${escapeHtml(data.city)}.
      </p>
      <div class="mt-10 flex flex-wrap justify-center gap-4 md:justify-start">
        <a href="/shop.html" class="btn-brutal-filled">Back to archive</a>
        <a href="/" class="btn-brutal border-sf-white text-sf-white">Home</a>
      </div>
    </section>
  `
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
