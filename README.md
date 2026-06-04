# Social Fabric

Streetwear brand site and shop MVP for **Social Fabric (SF)**.

## Shop app

All app code lives in [`social-fabric-shop/`](social-fabric-shop/). See that folder’s [README](social-fabric-shop/README.md) for catalogue sync and gallery setup.

**From this folder (repo root):**

```bash
npm run install:shop
npm run dev
```

**Or from `social-fabric-shop/`:**

```bash
cd social-fabric-shop
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). Do not use Live Server on the source HTML — use Vite.

## Project layout

| Folder | Purpose |
|--------|---------|
| `social-fabric-shop/` | Vite + Tailwind shop (source of truth for the site) |
| `Catalogue/` | Product images + `catalogue.json` → sync to shop |
| `Gallery/` | Lookbook images → sync to Models page |
| `Assets/` | Founder and brand assets |
