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

## Deploy

### Vercel (recommended)

1. Push the **whole** repo to [GitHub](https://github.com/VictorNxumalo/Social-Fabrics-).
2. Go to [vercel.com/new](https://vercel.com/new) → **Import** your `Social-Fabrics-` repository.
3. Leave **Root Directory** as `.` (repo root). `vercel.json` at the root sets:
   - **Install:** `cd social-fabric-shop && npm ci`
   - **Build:** `cd social-fabric-shop && npm run build`
   - **Output:** `social-fabric-shop/dist`
4. Click **Deploy**. Each build runs asset sync (gallery, catalogue, videos, feed) then Vite.

**CLI (optional):**

```bash
npx vercel
```

Run from the repo root and follow the prompts. Production deploy: `npx vercel --prod`.

**Custom domain:** Vercel project → **Settings** → **Domains**.

### Netlify

`netlify.toml` at the repo root still works if you prefer Netlify. You can run both hosts, but point your custom domain to one only.

**Before first deploy, commit large assets** so production has media even if sync paths are missing on CI:

- `social-fabric-shop/public/assets/video/` (`.mp4` files)
- `social-fabric-shop/public/assets/images/`
- `social-fabric-shop/public/data/`

Keep source folders in the repo for rebuilds: `Gallery/`, `Assets/`, `Catalogue/`.

## Project layout

| Folder | Purpose |
|--------|---------|
| `social-fabric-shop/` | Vite + Tailwind shop (source of truth for the site) |
| `Catalogue/` | Product images + `catalogue.json` → sync to shop |
| `Gallery/` | Lookbook images → sync to Models page |
| `Assets/` | Founder and brand assets |
