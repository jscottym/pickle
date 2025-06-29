import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui-pro',
    '@pinia/nuxt',
    'nuxt-vuefire'
  ],
  
  css: ['~/assets/css/main.css'],
  
  vite: {
    plugins: [
      tailwindcss()
    ]
  },
  
  pinia: {
    storesDirs: ['./stores/**']
  },

  imports: {
    dirs: [
      'stores/**'
    ]
  },

  ssr: false,

  vuefire: {
    auth: true,
    config: {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      appId: process.env.FIREBASE_APP_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    }
  },
})
