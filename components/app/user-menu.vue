<template>
  <UDropdown :items="items" :popper="{ placement: 'bottom-start' }">
    <UButton color="white" variant="ghost" trailing-icon="i-heroicons-chevron-down-20-solid">
      {{ userStore.displayName }}
    </UButton>

    <template #account="{ item }">
      <div class="text-left">
        <p>{{ userStore.fullName }}</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ userStore.currentUser?.phone }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
import { usePhoneAuth } from '~/composables/useFirebaseAuth'

const userStore = useUserStore()
const { signOut } = usePhoneAuth()

const items = [
  [{
    label: userStore.currentUser?.email || userStore.currentUser?.phone,
    slot: 'account',
    disabled: true
  }], [{
    label: 'Profile',
    icon: 'i-heroicons-user-circle',
    to: '/profile'
  }], [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    click: async () => {
      await signOut()
    }
  }]
]
</script> 