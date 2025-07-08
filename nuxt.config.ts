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
  ],
  ssr: true,
  primevue: {
    options: {
      theme: {
        preset: Aura
      }
    }
  },
  nitro: {
    preset: 'vercel',
    experimental: {
      websocket: true
    },
    externals: {
      external: [
        "snappy",
        "aws4",
        "gcp-metadata",
        "kerberos",
        "mongodb-client-encryption",
        "@aws-sdk/credential-providers"
      ]
    }
  },
  plugins: [
    '~/plugins/auth-init.client.js'
  ],

  runtimeConfig: {
    mongoUri: process.env.MONGODB_URI
  }
})