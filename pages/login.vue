<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-md">
      <UCard>
        <template #header>
          <div class="text-center">
            <AppLogo class="mx-auto mb-4" />
            <h2 class="text-2xl font-bold">Sign in to your account</h2>
          </div>
        </template>

        <div class="space-y-6">
          <!-- Phone Number Input -->
          <div v-if="step === 'phone'">
            <UFormGroup label="Phone Number" required>
              <UInput
                v-model="phoneNumber"
                type="tel"
                placeholder="+1 (555) 123-4567"
                :disabled="isLoading"
              />
            </UFormGroup>
            
            <UButton
              :loading="isLoading"
              :disabled="!phoneNumber"
              @click="sendVerificationCode"
              class="w-full mt-4"
            >
              Send Verification Code
            </UButton>
          </div>

          <!-- PIN Input for SMS Verification -->
          <div v-if="step === 'verification'">
            <div class="text-center mb-6">
              <p class="text-sm text-gray-600">
                Enter the 6-digit code sent to {{ phoneNumber }}
              </p>
            </div>

            <div class="flex justify-center mb-6">
              <UPinInput
                v-model="verificationCode"
                :length="6"
                type="number"
                placeholder="○"
                @complete="verifyCode"
              />
            </div>

            <div class="flex space-x-3">
              <UButton
                variant="outline"
                @click="goBack"
                :disabled="isLoading"
                class="flex-1"
              >
                Back
              </UButton>
              
              <UButton
                :loading="isLoading"
                :disabled="verificationCode.length !== 6"
                @click="verifyCode"
                class="flex-1"
              >
                Verify
              </UButton>
            </div>

            <div class="text-center mt-4">
              <UButton
                variant="ghost"
                size="sm"
                :disabled="isResendDisabled"
                @click="resendCode"
              >
                {{ isResendDisabled ? `Resend in ${resendTimer}s` : 'Resend Code' }}
              </UButton>
            </div>
          </div>

          <!-- Error Display -->
          <UAlert
            v-if="error"
            color="red"
            variant="soft"
            :description="error"
            :close-button="{ color: 'red' }"
            @close="error = ''"
          />
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFirebaseAuth } from '~/composables/useFirebaseAuth'

definePageMeta({
  layout: 'blank',
  middleware: 'guest'
})

const { signInWithPhone, verifyPhoneCode } = useFirebaseAuth()
const userStore = useUserStore()
const router = useRouter()

// Reactive state
const step = ref<'phone' | 'verification'>('phone')
const phoneNumber = ref('')
const verificationCode = ref<string[]>([])
const isLoading = ref(false)
const error = ref('')
const confirmationResult = ref<any>(null)

// Resend timer
const resendTimer = ref(0)
const isResendDisabled = computed(() => resendTimer.value > 0)

// Start resend timer
const startResendTimer = () => {
  resendTimer.value = 60
  const timer = setInterval(() => {
    resendTimer.value--
    if (resendTimer.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// Send verification code
const sendVerificationCode = async () => {
  if (!phoneNumber.value) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    const result = await signInWithPhone(phoneNumber.value)
    confirmationResult.value = result
    step.value = 'verification'
    startResendTimer()
  } catch (err: any) {
    error.value = err.message || 'Failed to send verification code'
  } finally {
    isLoading.value = false
  }
}

// Verify the code
const verifyCode = async () => {
  if (!confirmationResult.value || verificationCode.value.length !== 6) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    const code = verificationCode.value.join('')
    const userCredential = await verifyPhoneCode(confirmationResult.value, code)
    
    // User is now authenticated with Firebase
    // The user store will be updated automatically by the Firebase auth state listener
    await router.push('/')
  } catch (err: any) {
    error.value = err.message || 'Invalid verification code'
    verificationCode.value = []
  } finally {
    isLoading.value = false
  }
}

// Resend verification code
const resendCode = async () => {
  if (isResendDisabled.value) return
  
  error.value = ''
  isLoading.value = true
  
  try {
    const result = await signInWithPhone(phoneNumber.value)
    confirmationResult.value = result
    verificationCode.value = []
    startResendTimer()
  } catch (err: any) {
    error.value = err.message || 'Failed to resend verification code'
  } finally {
    isLoading.value = false
  }
}

// Go back to phone input
const goBack = () => {
  step.value = 'phone'
  verificationCode.value = []
  error.value = ''
  confirmationResult.value = null
}

// Redirect if already logged in
onMounted(() => {
  if (userStore.isLoggedIn) {
    router.push('/')
  }
})
</script> 