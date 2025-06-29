export default defineNuxtRouteMiddleware((to) => {
  const userStore = useUserStore()

  // Allow access to login and public pages
  const publicPages = ['/login', '/']
  if (publicPages.includes(to.path)) {
    return
  }

  // Redirect to login if not authenticated
  if (!userStore.isLoggedIn) {
    return navigateTo('/login')
  }

  // Redirect to profile setup if needed (except if already on setup page)
  if (userStore.needsProfileSetup && to.path !== '/profile/setup') {
    return navigateTo('/profile/setup')
  }
}) 