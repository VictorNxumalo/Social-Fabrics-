# Social Fabric — Product Catalogue

Drop product photos here. The shop page auto-syncs on `npm run dev` or `npm run build`.

Also supported: `Assets/Catalogue/` (same level as this folder's parent).

## How it works

1. Add images to this folder (or `Assets/Catalogue/`)
2. Edit `catalogue.json` in this folder — one entry per product
3. Run `npm run sync:catalogue` or restart the dev server

## catalogue.json fields

| Field | Description |
|-------|-------------|
| `id` | URL slug, e.g. `sf-core-tee` |
| `name` | Product name on site |
| `price` | Price in ZAR |
| `category` | `Tees`, `Hoodies`, `Pants`, or `Accessories` |
| `sizes` | Array of sizes |
| `source` | Exact filename in this folder |
| `description` | Short product copy |
| `story` | Design narrative — shown when user unfolds the piece on the shop archive |
| `inStock` | `true` or `false` |
| `featured` | Show on home page if `true` |
| `dateAdded` | `YYYY-MM-DD` for sort |

Images are copied to `public/assets/images/products/{id}.jpg` automatically.
