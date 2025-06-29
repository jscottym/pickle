<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
      <UCard>
        <template #header>
          <div class="text-center">
            <h2 class="text-2xl font-bold">Complete Your Profile</h2>
            <p class="text-gray-600 mt-2">
              Please tell us your name to get started
            </p>
          </div>
        </template>

        <UForm
          :state="formData"
          :schema="schema"
          @submit="onSubmit"
          class="space-y-4"
        >
          <UFormGroup label="First Name" name="first" required>
            <UInput
              v-model="formData.first"
              placeholder="Enter your first name"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UFormGroup label="Last Name" name="last" required>
            <UInput
              v-model="formData.last"
              placeholder="Enter your last name"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UFormGroup label="Nickname (Optional)" name="nickname">
            <UInput
              v-model="formData.nickname"
              placeholder="How should we call you?"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UButton
            type="submit"
            :loading="isLoading"
            class="w-full"
          >
            Complete Setup
          </UButton>
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
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
  layout: 'blank',
  middleware: 'auth'
})

const userStore = useUserStore()
const router = useRouter()

const schema = z.object({
  first: z.string().min(1, 'First name is required'),
  last: z.string().min(1, 'Last name is required'),
  nickname: z.string().optional()
})

const formData = reactive({
  first: '',
  last: '',
  nickname: ''
})

const isLoading = ref(false)
const error = ref('')

const onSubmit = async () => {
  error.value = ''
  isLoading.value = true

  try {
    await userStore.updateProfile({
      first: formData.first,
      last: formData.last,
      nickname: formData.nickname || undefined
    })

    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Failed to update profile'
  } finally {
    isLoading.value = false
  }
}

// Redirect if profile is already set up
onMounted(() => {
  if (!userStore.needsProfileSetup) {
    router.push('/')
  }
})
</script> 