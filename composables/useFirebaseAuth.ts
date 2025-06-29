import {
    signOut as firebaseSignOut,
    onAuthStateChanged,
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

export const useFirebaseAuth = () => {
  const nuxtApp = useNuxtApp()
  const userStore = useUserStore()
  const recaptchaVerifier = ref<RecaptchaVerifier | null>(null)

  // Get Firebase auth instance safely
  const getAuth = () => {
    return nuxtApp.$auth
  }

  // Initialize reCAPTCHA
  const initializeRecaptcha = () => {
    if (process.client && !recaptchaVerifier.value) {
      recaptchaVerifier.value = new RecaptchaVerifier($auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          // Response expired
        }
      })
    }
  }

  // Format phone number to E.164 format
  const formatPhoneNumber = (phone: string): string => {
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
      initializeRecaptcha()
      
      if (!recaptchaVerifier.value) {
        throw new Error('reCAPTCHA not initialized')
      }

      const formattedPhone = formatPhoneNumber(phoneNumber)
      const confirmationResult = await signInWithPhoneNumber(
        $auth,
        formattedPhone,
        recaptchaVerifier.value
      )
      
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

  // Sign out
  const signOut = async () => {
    try {
      await firebaseSignOut($auth)
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

  // Setup auth state listener
  const setupAuthListener = () => {
    if (process.client) {
      onAuthStateChanged($auth, async (firebaseUser) => {
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
      })
    }
  }

  return {
    signInWithPhone,
    verifyPhoneCode,
    signOut,
    createOrFindUser,
    setupAuthListener,
    formatPhoneNumber
  }
} 