import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error: Vuetify Error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  devtools: { enabled: true },
  app: {
    baseURL:
      process.env.PANEL_VUE_URL === '/'
      || !process.env.PANEL_VUE_URL?.startsWith('/')
        ? undefined
        : process.env.PANEL_VUE_URL,
  },
  runtimeConfig: {
    public: {
      host: process.env.PANEL_VUE_URL || 'localhost',
      apiHostInternal: `http://${process.env.API_HOST || 'api'}:${
        process.env.API_PORT || '3000'
      }`,
      apiHostExternal: process.env.API_URL?.startsWith('/')
        ? process.env.API_URL
        : `https://${process.env.API_URL}`,
      googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    },
  },
  build: {
    transpile: ['vuetify'],
  },
  compatibilityDate: '2024-11-01',
  vite: {
    server: {
      allowedHosts: [
        process.env.PANEL_VUE_URL?.startsWith('/')
          ? `${process.env.NGINX_HOST}:${process.env.NGINX_PORT}`
          : process.env.PANEL_VUE_URL || 'localhost',
      ],
    },
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
