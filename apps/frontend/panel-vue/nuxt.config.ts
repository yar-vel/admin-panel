import { dictionary, getT } from '@workspace/shared'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    'vuetify-nuxt-module',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
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
  build: { transpile: ['@workspace/shared'] },
  compatibilityDate: '2025-07-15',
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'ua-parser-js',
      ],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    strategy: 'no_prefix',
    defaultLocale: getT().langCode,
    locales: Object.values(dictionary).map(l => ({
      code: l.langCode,
      name: l.langName,
    })),
  },
  vuetify: {
    vuetifyOptions: {
      theme: { defaultTheme: 'dark' },
    },
  },
})
