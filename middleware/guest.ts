export default defineNuxtRouteMiddleware(() => {
  const userStore = useUserStore()

  // Redirect authenticated users away from login page
  if (userStore.isLoggedIn) {
    if (userStore.needsProfileSetup) {
      return navigateTo('/profile/setup')
    }
    return navigateTo('/')
  }
}) 