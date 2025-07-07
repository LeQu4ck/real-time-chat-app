// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from '@primeuix/themes/aura';

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@primevue/nuxt-module',
    'nuxt-mongoose'
  ],
  //ssr: true,
  mongoose: {
    uri: import.meta.env.MONGODB_URI,
    options: {},
    modelsDir: 'models',
    devtools: true,
  },
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  nitro: {
    experimental: {
      websocket: true
    },
  },
  plugins: [
    '~/plugins/auth-init.client.js'
  ],
})