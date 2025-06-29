<script setup lang="ts">
const counterStore = useCounterStore()
const userStore = useUserStore()

// Load user from storage on mount
onMounted(() => {
  userStore.loadFromStorage()
})

// Demo login function
const demoLogin = (role: 'PLAYER' | 'ORGANIZER' | 'ADMIN') => {
  userStore.login({
    id: '1',
    first: 'John',
    last: 'Doe',
    nickname: 'johnny',
    phone: '+1-555-0123',
    role,
    email: 'john.doe@example.com',
    createdAt: new Date(),
    updatedAt: new Date()
  })
}
</script>

<template>
  <UContainer>
    <div class="py-12">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-highlighted mb-4">
          Welcome to Pickle
        </h1>
        <p class="text-lg text-muted">
          Nuxt UI v3 + Tailwind CSS v4 + Pinia + Prisma
        </p>
      </div>

      <div class="max-w-md mx-auto space-y-6">
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Counter Demo (Pinia)</h3>
          </template>
          
          <div class="text-center space-y-4">
            <div class="text-3xl font-bold">
              {{ counterStore.count }}
            </div>
            
            <div class="flex items-center justify-center space-x-2">
              <UButton @click="counterStore.decrement" variant="outline" size="sm">
                -
              </UButton>
              <UButton @click="counterStore.increment" size="sm">
                +
              </UButton>
            </div>
            
            <div class="space-x-2">
              <UButton @click="counterStore.reset" variant="subtle" size="xs">
                Reset
              </UButton>
              <UButton @click="counterStore.incrementBy(5)" variant="subtle" size="xs">
                +5
              </UButton>
            </div>
            
            <div class="text-sm text-muted">
              <p>Double: {{ counterStore.doubleCount }}</p>
              <p>Is Even: {{ counterStore.isEven ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">User Store Demo (Authentication)</h3>
          </template>
          
          <div class="space-y-4">
            <div v-if="!userStore.isLoggedIn" class="text-center space-y-3">
              <p class="text-muted text-sm mb-3">Login as different roles to test permissions:</p>
              <div class="space-x-2">
                <UButton @click="demoLogin('PLAYER')" variant="outline" size="sm" color="info">
                  Login as Player
                </UButton>
                <UButton @click="demoLogin('ORGANIZER')" variant="outline" size="sm" color="warning">  
                  Login as Organizer
                </UButton>
                <UButton @click="demoLogin('ADMIN')" variant="outline" size="sm" color="error">
                  Login as Admin
                </UButton>
              </div>
            </div>
            
            <div v-else class="space-y-3">
              <div class="text-center">
                <div class="text-lg font-semibold">{{ userStore.nickname }}</div>
                <div class="text-sm text-muted">{{ userStore.fullName }}</div>
                <UBadge 
                  :color="userStore.isAdmin ? 'error' : userStore.isOrganizer ? 'warning' : 'info'"
                  variant="subtle"
                  size="sm"
                  class="mt-1"
                >
                  {{ userStore.currentUserRole }}
                </UBadge>
              </div>
              
              <div class="text-xs space-y-1">
                <div class="flex justify-between">
                  <span class="text-muted">Phone:</span>
                  <span>{{ userStore.currentUser?.phone }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Can Manage Users:</span>
                  <span>{{ userStore.canManageUsers ? '✅' : '❌' }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Can Manage System:</span>
                  <span>{{ userStore.canManageSystem ? '✅' : '❌' }}</span>
                </div>
              </div>
              
              <div class="text-center pt-2">
                <UButton @click="userStore.logout" variant="outline" size="sm" color="neutral">
                  Logout
                </UButton>
              </div>
            </div>
          </div>
        </UCard>

        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold">Stack Information</h3>
          </template>
          
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted">Nuxt UI:</span>
              <span class="font-medium">v3.2.0</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">Tailwind CSS:</span>
              <span class="font-medium">v4</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">Pinia:</span>
              <span class="font-medium">✅ Ready (Counter + User)</span>
            </div>
            <div class="flex justify-between">
              <span class="text-muted">Prisma:</span>
              <span class="font-medium">⚡ Next</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </UContainer>
</template>

<style scoped>
.container {
  max-width: 1200px;
}
</style> 