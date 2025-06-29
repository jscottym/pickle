<script setup lang="ts">
import { z } from 'zod'

const userStore = useUserStore()

const schema = z.object({
  first: z.string().min(1, 'First name is required'),
  last: z.string().min(1, 'Last name is required'),
  nickname: z.string().optional(),
  phone: z.string(),
  email: z.string().email().optional().or(z.literal(''))
})

const formData = reactive({
  first: '',
  last: '',
  nickname: '',
  phone: '',
  email: ''
})

const isLoading = ref(false)
const error = ref('')
const successMessage = ref('')

const roleColor = computed(() => {
  switch (userStore.currentUser?.role) {
    case 'ADMIN': return 'red'
    case 'ORGANIZER': return 'blue'
    default: return 'gray'
  }
})

const hasChanges = computed(() => {
  const current = userStore.currentUser
  if (!current) return false

  return (
    formData.first !== current.first ||
    formData.last !== current.last ||
    formData.nickname !== (current.nickname || '') ||
    formData.email !== (current.email || '')
  )
})

const resetForm = () => {
  const current = userStore.currentUser
  if (current) {
    formData.first = current.first
    formData.last = current.last
    formData.nickname = current.nickname || ''
    formData.phone = current.phone
    formData.email = current.email || ''
  }
}

const onSubmit = async () => {
  error.value = ''
  successMessage.value = ''
  isLoading.value = true

  try {
    await userStore.updateProfile({
      first: formData.first,
      last: formData.last,
      nickname: formData.nickname || undefined
    })

    successMessage.value = 'Profile updated successfully!'
  } catch (err: any) {
    error.value = err.message || 'Failed to update profile'
  } finally {
    isLoading.value = false
  }
}

// Initialize form with current user data
onMounted(() => {
  resetForm()
})

// Watch for user changes
watch(() => userStore.currentUser, () => {
  resetForm()
}, { immediate: true })
</script>

<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Profile</h1>
      <p class="text-gray-600 mt-2">Manage your account information</p>
    </div>

    <UCard>
      <template #header>
        <h2 class="text-xl font-semibold">Personal Information</h2>
      </template>

      <UForm
        :state="formData"
        :schema="schema"
        @submit="onSubmit"
        class="space-y-4"
      >
        <UFormField label="First Name" name="first" required>
          <UInput
            v-model="formData.first"
            placeholder="Enter your first name"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField label="Last Name" name="last" required>
          <UInput
            v-model="formData.last"
            placeholder="Enter your last name"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField label="Nickname" name="nickname">
          <UInput
            v-model="formData.nickname"
            placeholder="How should we call you?"
            :disabled="isLoading"
          />
        </UFormField>

        <UFormField label="Phone Number" name="phone">
          <UInput
            v-model="formData.phone"
            type="tel"
            disabled
            help="Phone number cannot be changed"
          />
        </UFormField>

        <UFormField label="Email" name="email">
          <UInput
            v-model="formData.email"
            type="email"
            placeholder="Enter your email (optional)"
            :disabled="isLoading"
          />
        </UFormField>

        <div class="flex justify-between items-center pt-4">
          <UBadge :color="roleColor" variant="soft">
            {{ userStore.currentUser?.role }}
          </UBadge>

          <div class="space-x-3">
            <UButton
              variant="outline"
              @click="resetForm"
              :disabled="isLoading"
            >
              Reset
            </UButton>
            
            <UButton
              type="submit"
              :loading="isLoading"
              :disabled="!hasChanges"
            >
              Save Changes
            </UButton>
          </div>
        </div>
      </UForm>

      <UAlert
        v-if="error"
        color="red"
        variant="soft"
        :description="error"
        :close-button="{ color: 'red' }"
        @close="error = ''"
        class="mt-4"
      />

      <UAlert
        v-if="successMessage"
        color="green"
        variant="soft"
        :description="successMessage"
        :close-button="{ color: 'green' }"
        @close="successMessage = ''"
        class="mt-4"
      />
    </UCard>
  </div>
</template> 