import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  
  // Add modules in the correct order - using basic setup first
  modules: [
    '@nuxt/ui-pro',
    '@pinia/nuxt'
  ],
  
  // Add CSS file
  css: ['~/assets/css/main.css'],
  
  // Configure Tailwind 4 via Vite plugin
  vite: {
    plugins: [tailwindcss()]
  },
  
  // Configure Pinia
  pinia: {
    storesDirs: ['./stores/**']
  }
})
