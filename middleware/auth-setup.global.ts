export default defineNuxtRouteMiddleware((to) => {
  // Only run on client side since no SSR
  if (process.server) return

  try {
    // Set up the auth state listener using the composable
    const { setupAuthListener } = usePhoneAuth()
    setupAuthListener()
    
    // Check authentication for protected routes
    const userStore = useUserStore()
    
    // Check if the route is public via page meta
    const isPublicRoute = to.meta.public === true
    
    // If user is logged in and trying to access login page, redirect them
    if (userStore.isLoggedIn && to.path === '/login') {
      if (userStore.needsProfileSetup) {
        return navigateTo('/profile/setup')
      }
      return navigateTo('/')
    }
    
    // If route is not public and user is not logged in, redirect to login
    if (!isPublicRoute && !userStore.isLoggedIn) {
      return navigateTo('/login')
    }
    
    // If logged in but needs profile setup (except if already on setup page)
    if (userStore.isLoggedIn && userStore.needsProfileSetup && to.path !== '/profile/setup') {
      return navigateTo('/profile/setup')
    }
    
  } catch (error) {
    console.error('Failed to setup auth listener in middleware:', error)
  }
}) 