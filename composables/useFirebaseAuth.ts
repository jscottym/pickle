import { getApp } from 'firebase/app'
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
  type User as FirebaseUser
} from 'firebase/auth'

interface UserData {
  id: string
  firebaseUserId: string
  first: string
  last: string
  nickname: string | null
  phone: string
  email: string | null
  role: 'PLAYER' | 'ORGANIZER' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export const usePhoneAuth = () => {
  const userStore = useUserStore()
  const recaptchaVerifier = ref<RecaptchaVerifier | null>(null)
  
  // Use VueFire's current user for auth state watching
  const currentUser = useCurrentUser()

  // Get the underlying Firebase Auth instance
  const getFirebaseAuth = () => {
    try {
      // Use the Firebase app initialized by VueFire
      const app = getApp()
      return getAuth(app)
    } catch (error) {
      console.error('Error getting Firebase Auth instance:', error)
      return null
    }
  }

  // Setup development mode (disable app verification for testing)
  const setupDevelopmentMode = () => {
    if (import.meta.client && import.meta.dev) {
      const auth = getFirebaseAuth()
      if (auth) {
        try {
          // For Firebase v9+, we need to use connectAuthEmulator or just skip this
          // The appVerificationDisabledForTesting property doesn't exist in newer versions
          console.log('🔧 Development mode: Using production reCAPTCHA (Firebase v9+)')
        } catch (error) {
          console.warn('Development mode setup:', error)
        }
      }
    }
  }

  // Initialize reCAPTCHA - simplified for development mode
  const initializeRecaptcha = () => {
    if (import.meta.client && !recaptchaVerifier.value) {
      // Get the underlying Firebase Auth instance
      const auth = getFirebaseAuth()
      if (!auth) {
        throw new Error('Firebase auth not initialized. Please check your Firebase configuration.')
      }
      
      // Setup development mode first
      setupDevelopmentMode()
      
      // Wait for DOM to be ready and get the element
      let recaptchaContainer = document.getElementById('recaptcha-container')
      if (!recaptchaContainer) {
        // If container doesn't exist, create it dynamically
        const container = document.createElement('div')
        container.id = 'recaptcha-container'
        container.style.display = 'none'
        document.body.appendChild(container)
        recaptchaContainer = container
      }
      
      try {
        // Create RecaptchaVerifier for Firebase v10
        // Pass the actual DOM element instead of string ID
        recaptchaVerifier.value = new RecaptchaVerifier(auth, recaptchaContainer, {
          size: 'invisible',
          callback: () => {
            console.log('reCAPTCHA solved')
          },
          'expired-callback': () => {
            console.log('reCAPTCHA expired')
          }
        })
        
        console.log('RecaptchaVerifier initialized successfully')
      } catch (error) {
        console.error('Error initializing RecaptchaVerifier:', error)
        console.error('Error details:', error)
        throw new Error('Failed to initialize reCAPTCHA verifier')
      }
    }
  }

  // Format phone number to E.164 format
  const formatPhoneNumber = (phone: string): string => {
    // In development mode, allow test numbers
    if (import.meta.dev && phone.includes('555')) {
      // Ensure test numbers are properly formatted
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length === 10) {
        return `+1${cleaned}`
      }
      if (cleaned.length === 11 && cleaned.startsWith('1')) {
        return `+${cleaned}`
      }
      return phone.startsWith('+') ? phone : `+${cleaned}`
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '')
    
    // If it starts with 1 and has 11 digits, it's already in the right format
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`
    }
    
    // If it has 10 digits, assume it's US and add +1
    if (cleaned.length === 10) {
      return `+1${cleaned}`
    }
    
    // If it already starts with +, return as is
    if (phone.startsWith('+')) {
      return phone
    }
    
    // Otherwise, assume it needs + prefix
    return `+${cleaned}`
  }

  // Sign in with phone number
  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      // Get the underlying Firebase Auth instance
      const auth = getFirebaseAuth()
      if (!auth) {
        throw new Error('Firebase auth not initialized. Please check your Firebase configuration.')
      }
      
      console.log('Initializing reCAPTCHA...')
      initializeRecaptcha()
      
      if (!recaptchaVerifier.value) {
        throw new Error('reCAPTCHA not initialized')
      }

      const formattedPhone = formatPhoneNumber(phoneNumber)
      console.log('Sending SMS to:', formattedPhone)
      
      // Show development mode info
      if (import.meta.dev && formattedPhone.includes('555')) {
        console.log('🔧 Using test phone number in development mode')
      }
      
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.value
      )
      
      console.log('SMS sent successfully')
      return confirmationResult
    } catch (error: any) {
      console.error('Error sending phone verification:', error)
      
      // Reset reCAPTCHA on error
      if (recaptchaVerifier.value) {
        recaptchaVerifier.value.clear()
        recaptchaVerifier.value = null
      }
      
      throw new Error(getErrorMessage(error))
    }
  }

  // Verify phone code
  const verifyPhoneCode = async (confirmationResult: ConfirmationResult, code: string) => {
    try {
      const result = await confirmationResult.confirm(code)
      return result
    } catch (error: any) {
      console.error('Error verifying phone code:', error)
      throw new Error(getErrorMessage(error))
    }
  }

  // Sign out using the underlying Firebase Auth
  const signOut = async () => {
    try {
      const auth = getFirebaseAuth()
      if (!auth) {
        throw new Error('Firebase auth not initialized')
      }
      await auth.signOut()
      userStore.logout()
    } catch (error: any) {
      console.error('Error signing out:', error)
      throw new Error(getErrorMessage(error))
    }
  }

  // Create or find user in database
  const createOrFindUser = async (firebaseUser: FirebaseUser): Promise<UserData> => {
    try {
      const response = await $fetch<UserData>('/api/auth/user', {
        method: 'POST',
        body: {
          firebaseUserId: firebaseUser.uid,
          phone: firebaseUser.phoneNumber,
          email: firebaseUser.email
        }
      })
      
      return response
    } catch (error: any) {
      console.error('Error creating/finding user:', error)
      throw new Error('Failed to create user account')
    }
  }

  // Get error message from Firebase error
  const getErrorMessage = (error: any): string => {
    const errorCode = error.code
    
    switch (errorCode) {
      case 'auth/invalid-phone-number':
        return 'Invalid phone number format'
      case 'auth/too-many-requests':
        return 'Too many requests. Please try again later'
      case 'auth/invalid-verification-code':
        return 'Invalid verification code'
      case 'auth/code-expired':
        return 'Verification code has expired'
      case 'auth/missing-phone-number':
        return 'Phone number is required'
      case 'auth/quota-exceeded':
        return 'SMS quota exceeded. Please try again later'
      case 'auth/captcha-check-failed':
        return 'reCAPTCHA verification failed. Please try again'
      default:
        return error.message || 'An unexpected error occurred'
    }
  }

  // Watch for auth state changes using VueFire's currentUser
  const setupAuthListener = () => {
    watch(currentUser, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // User is signed in, get or create user data
          const userData = await createOrFindUser(firebaseUser)
          userStore.login(userData)
        } catch (error) {
          console.error('Error handling auth state change:', error)
          userStore.logout()
        }
      } else {
        // User is signed out
        userStore.logout()
      }
    }, { immediate: true })
  }

  return {
    signInWithPhone,
    verifyPhoneCode,
    signOut,
    createOrFindUser,
    setupAuthListener,
    formatPhoneNumber,
    currentUser: readonly(currentUser)
  }
} 