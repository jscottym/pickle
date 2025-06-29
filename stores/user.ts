export type UserRole = 'PLAYER' | 'ORGANIZER' | 'ADMIN'

export interface User {
  id: string
  firebaseUserId: string
  first: string
  last: string
  nickname: string | null
  phone: string
  email: string | null
  role: UserRole
  createdAt: string
  updatedAt: string
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)
  const isLoading = ref(false)

  // Getters
  const currentUserRole = computed((): UserRole | null => {
    return currentUser.value?.role || null
  })

  const fullName = computed((): string => {
    if (!currentUser.value) return ''
    return `${currentUser.value.first} ${currentUser.value.last}`.trim()
  })

  const displayName = computed((): string => {
    if (!currentUser.value) return ''
    return currentUser.value.nickname || fullName.value
  })

  const isPlayer = computed(() => currentUserRole.value === 'PLAYER')
  const isOrganizer = computed(() => currentUserRole.value === 'ORGANIZER')
  const isAdmin = computed(() => currentUserRole.value === 'ADMIN')

  const needsProfileSetup = computed(() => {
    return currentUser.value?.first === 'New' && currentUser.value?.last === 'User'
  })

  // Actions
  const login = (userData: User) => {
    currentUser.value = userData
    isLoggedIn.value = true
    isLoading.value = false
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    isLoading.value = false
    clearStorage()
  }

  const updateUser = async (updates: Partial<Omit<User, 'id' | 'firebaseUserId' | 'createdAt'>>) => {
    if (!currentUser.value) return

    try {
      isLoading.value = true
      
             const response = await $fetch<User>('/api/auth/user', {
         method: 'PATCH',
         body: {
           ...updates,
           firebaseUserId: currentUser.value.firebaseUserId
         }
       })

      currentUser.value = response
      return response
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const updateProfile = async (profileData: {
    first?: string
    last?: string
    nickname?: string
  }) => {
    return await updateUser(profileData)
  }

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!currentUserRole.value) return false
    
    const roleHierarchy: Record<UserRole, number> = {
      'PLAYER': 1,
      'ORGANIZER': 2,
      'ADMIN': 3
    }

    return roleHierarchy[currentUserRole.value] >= roleHierarchy[requiredRole]
  }

  const canManageUsers = computed(() => hasPermission('ORGANIZER'))
  const canManageSystem = computed(() => hasPermission('ADMIN'))

  // Persistence
  const saveToStorage = () => {
    if (process.client) {
      localStorage.setItem('user', JSON.stringify({
        currentUser: currentUser.value,
        isLoggedIn: isLoggedIn.value
      }))
    }
  }

  const loadFromStorage = () => {
    if (process.client) {
      const stored = localStorage.getItem('user')
      if (stored) {
        try {
          const data = JSON.parse(stored)
          currentUser.value = data.currentUser
          isLoggedIn.value = data.isLoggedIn
        } catch (error) {
          console.error('Failed to load user from storage:', error)
        }
      }
    }
  }

  const clearStorage = () => {
    if (process.client) {
      localStorage.removeItem('user')
    }
  }

  // Auto-save to storage when user data changes
  watch([currentUser, isLoggedIn], () => {
    saveToStorage()
  }, { deep: true })

  return {
    // State
    currentUser: readonly(currentUser),
    isLoggedIn: readonly(isLoggedIn),
    isLoading: readonly(isLoading),
    
    // Getters
    currentUserRole,
    fullName,
    displayName,
    isPlayer,
    isOrganizer,
    isAdmin,
    canManageUsers,
    canManageSystem,
    needsProfileSetup,
    
    // Actions
    login,
    logout,
    updateUser,
    updateProfile,
    hasPermission,
    loadFromStorage,
    clearStorage
  }
}) 