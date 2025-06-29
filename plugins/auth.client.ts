export default defineNuxtPlugin(async () => {
  // Only run on client side
  if (process.server) return

  try {
    // Wait for Firebase to be initialized
    await nextTick()
    
    const { setupAuthListener } = useFirebaseAuth()
    
    // Initialize auth state listener when the app starts
    setupAuthListener()
  } catch (error) {
    console.error('Failed to initialize auth listener:', error)
  }
}) 