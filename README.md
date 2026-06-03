# Social Fabric

Streetwear brand site and shop MVP for **Social Fabric (SF)**.

## Shop app

All app code lives in [`social-fabric-shop/`](social-fabric-shop/). See that folder’s [README](social-fabric-shop/README.md) for run instructions, catalogue sync, and gallery setup.

```bash
cd social-fabric-shop
npm install
npm run dev
```

## Project layout

| Folder | Purpose |
|--------|---------|
| `social-fabric-shop/` | Vite + Tailwind shop (source of truth for the site) |
| `Catalogue/` | Product images + `catalogue.json` → sync to shop |
| `Gallery/` | Lookbook images → sync to Models page |
| `Assets/` | Founder and brand assets |
