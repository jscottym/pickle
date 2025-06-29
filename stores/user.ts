export type UserRole = 'PLAYER' | 'ORGANIZER' | 'ADMIN'

export interface User {
  id: string
  first: string
  last: string
  nickname: string
  phone: string
  role: UserRole
  email?: string
  createdAt?: Date
  updatedAt?: Date
}

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isLoggedIn = ref(false)

  // Getters
  const currentUserRole = computed((): UserRole | null => {
    return currentUser.value?.role || null
  })

  const fullName = computed((): string => {
    if (!currentUser.value) return ''
    return `${currentUser.value.first} ${currentUser.value.last}`.trim()
  })

  const nickname = computed((): string => {
    if (!currentUser.value) return ''
    return currentUser.value.nickname || fullName.value
  })

  const isPlayer = computed(() => currentUserRole.value === 'PLAYER')
  const isOrganizer = computed(() => currentUserRole.value === 'ORGANIZER')
  const isAdmin = computed(() => currentUserRole.value === 'ADMIN')

  // Actions
  const login = (userData: User) => {
    currentUser.value = userData
    isLoggedIn.value = true
  }

  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
  }

  const updateUser = (updates: Partial<Omit<User, 'id'>>) => {
    if (currentUser.value) {
      currentUser.value = {
        ...currentUser.value,
        ...updates,
        updatedAt: new Date()
      }
    }
  }

  const updateProfile = (profileData: {
    first?: string
    last?: string
    nickname?: string
    phone?: string
  }) => {
    updateUser(profileData)
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

  // Persistence (optional - for development/demo purposes)
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
    
    // Getters
    currentUserRole,
    fullName,
    nickname,
    isPlayer,
    isOrganizer,
    isAdmin,
    canManageUsers,
    canManageSystem,
    
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