# Social Fabric Shop — MVP

Black-and-white streetwear e-commerce MVP for **Social Fabric (SF)**. Vanilla JS + Vite + Tailwind CSS.

## Run locally

```bash
cd social-fabric-shop
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Build for production:

```bash
npm run build
npm run preview
```

## Folder structure

```
social-fabric-shop/
├── index.html          # Home
├── shop.html           # Catalog
├── product.html        # Product detail
├── cart.html           # Cart
├── checkout.html       # Checkout (MVP form)
├── about.html          # About
├── public/
│   ├── assets/images/
│   │   ├── logo-dark.png    # Black bg, patterned SF + white wordmark
│   │   ├── logo-light.png   # White bg, solid black SF
│   │   └── products/        # Product photos (drop PNG/JPG here)
│   └── data/
│       └── products.json    # Product catalog (Phase 3)
└── src/
    ├── style.css       # Tailwind + SF design tokens
    ├── main.js         # Home entry
    ├── js/
    │   ├── layout.js   # Nav, footer, mobile menu
    │   └── cart-store.js
    └── pages/          # Per-page entry scripts
```

# Logo assets

- `public/assets/images/logo-dark.jpeg` — black bg (nav on video, footer)
- `public/assets/images/logo-light.jpeg` — white bg (inner page nav)

# Hero video

- `public/assets/video/header-animation.mp4` — full-screen home hero background

## Adding products (Phase 3+)

Edit `public/data/products.json`. Each product:

```json
{
  "id": "sf-core-tee",
  "name": "SF Core Tee",
  "price": 45,
  "category": "Tees",
  "sizes": ["S", "M", "L", "XL"],
  "image": "/assets/images/products/sf-core-tee.jpg",
  "description": "Heavyweight cotton. SF monogram chest hit.",
  "inStock": true
}
```

Place the image at the path in `image`.

## Gallery / Models page

Drop lookbook images in the **`Gallery/`** folder at the project root (same level as `social-fabric-shop/`):

```
Social Fabric/
├── Gallery/           ← drop model photos here
│   ├── look-01.jpg
│   └── subway-fit.png
└── social-fabric-shop/
```

Images auto-sync to the Models page on `npm run dev` or `npm run build`. Manual sync:

```bash
npm run sync:gallery
```

Then open `/models.html` to preview the gallery.

## Product catalogue / Shop

Product photos live in **`Catalogue/`** (or `Assets/Catalogue/`). Metadata is in **`Catalogue/catalogue.json`**.

```
Social Fabric/
├── Catalogue/
│   ├── catalogue.json    ← edit names, prices, categories
│   └── your-product.jpg  ← or in Assets/Catalogue/
└── social-fabric-shop/
```

Sync manually:

```bash
npm run sync:catalogue
# or both gallery + catalogue:
npm run sync
```

Open `/shop.html` for the full catalogue with filters and sort.

## Stack

- **Vite** — fast dev server, multi-page build, easy to extend
- **Tailwind CSS v4** — design tokens in `src/style.css`
- **Vanilla JS** — cart in `localStorage`, no framework
