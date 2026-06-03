import { resolve } from 'path'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { syncGallery } from './scripts/sync-gallery.mjs'
import { syncCatalogue } from './scripts/sync-catalogue.mjs'
import { syncFounder } from './scripts/sync-founder.mjs'
import { syncModelsVideo } from './scripts/sync-models-video.mjs'
import { syncSfFeed } from './scripts/sync-sf-feed.mjs'

function assetSyncPlugin() {
  return {
    name: 'asset-sync',
    buildStart() {
      syncGallery()
      syncCatalogue()
      syncFounder()
      syncModelsVideo()
      syncSfFeed()
    },
    configureServer() {
      syncGallery()
      syncCatalogue()
      syncFounder()
      syncModelsVideo()
      syncSfFeed()
    },
  }
}

export default defineConfig({
  plugins: [assetSyncPlugin(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        shop: resolve(__dirname, 'shop.html'),
        product: resolve(__dirname, 'product.html'),
        cart: resolve(__dirname, 'cart.html'),
        checkout: resolve(__dirname, 'checkout.html'),
        about: resolve(__dirname, 'about.html'),
        models: resolve(__dirname, 'models.html'),
        delivery: resolve(__dirname, 'delivery.html'),
      },
    },
  },
})
