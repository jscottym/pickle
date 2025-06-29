<script setup lang="ts">
import { useFetch } from '#app'

const route = useRoute()
const { currentUser, isLoggedIn } = useUserStore()

const eventId = route.params.id as string

// Fetch event details
const { data: event } = await useFetch(`/api/events/${eventId}`)
const { data: registrations } = await useFetch(`/api/events/${eventId}/registrations`)

const confirmedRegistrations = computed(() => 
  registrations.value?.filter(r => r.status === 'IN' && r.confirmed) || []
)

const waitlistRegistrations = computed(() => 
  registrations.value?.filter(r => r.status === 'IN' && !r.confirmed) || []
)

const maybeRegistrations = computed(() => 
  registrations.value?.filter(r => r.status === 'MAYBE') || []
)

const outRegistrations = computed(() => 
  registrations.value?.filter(r => r.status === 'OUT') || []
)

const currentUserRegistration = computed(() => 
  registrations.value?.find(r => r.userId === currentUser?.id)
)

const availableSpots = computed(() => 
  event.value ? event.value.maxPlayers - confirmedRegistrations.value.length : 0
)

const canRegister = computed(() => 
  isLoggedIn && !currentUserRegistration.value && event.value?.status === 'PLANNED'
)

const canManageEvent = computed(() => {
  if (!currentUser || !event.value) return false
  return currentUser.role === 'ADMIN' || 
         event.value.organizerId === currentUser.id ||
         event.value.managers?.some(m => m.id === currentUser.id)
})

// RSVP Actions
const rsvpStatus = ref('')
const isSubmitting = ref(false)

const submitRSVP = async (status: string) => {
  if (!isLoggedIn || isSubmitting.value) return
  
  isSubmitting.value = true
  try {
    await $fetch(`/api/events/${eventId}/rsvp`, {
      method: 'POST',
      body: { status }
    })
    
    // Refresh data
    await refreshCookie('registrations')
    rsvpStatus.value = status
  } catch (error) {
    console.error('RSVP failed:', error)
  } finally {
    isSubmitting.value = false
  }
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<template>
  <LayoutContainer>
    <LayoutColumn gap="6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <TextHeadingPage>{{ event?.name }}</TextHeadingPage>
        <UBadge 
          :color="event?.status === 'PLANNED' ? 'blue' : event?.status === 'ACTIVE' ? 'green' : 'gray'"
          variant="solid"
        >
          {{ event?.status }}
        </UBadge>
      </div>

      <!-- Event Info -->
      <AppCard v-if="event">
        <LayoutColumn gap="4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <TextBodySmall class="text-gray-500">Date</TextBodySmall>
              <TextBody>{{ formatDate(event.date) }}</TextBody>
            </div>
            <div>
              <TextBodySmall class="text-gray-500">Time</TextBodySmall>
              <TextBody>{{ formatTime(event.startTime) }} - {{ formatTime(event.endTime) }}</TextBody>
            </div>
            <div>
              <TextBodySmall class="text-gray-500">Location</TextBodySmall>
              <TextBody>{{ event.location?.name }}</TextBody>
              <TextBodySmall v-if="event.location?.address" class="text-gray-500">
                {{ event.location.address }}
              </TextBodySmall>
            </div>
            <div>
              <TextBodySmall class="text-gray-500">Format</TextBodySmall>
              <TextBody>{{ event.eventFormat?.name }}</TextBody>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <div>
              <TextBodySmall class="text-gray-500">Confirmed Players</TextBodySmall>
              <TextHeadingSubsection>{{ confirmedRegistrations.length }}/{{ event.maxPlayers }}</TextHeadingSubsection>
            </div>
            <div>
              <TextBodySmall class="text-gray-500">Waitlist</TextBodySmall>
              <TextHeadingSubsection>{{ waitlistRegistrations.length }}</TextHeadingSubsection>
            </div>
            <div>
              <TextBodySmall class="text-gray-500">Available Spots</TextBodySmall>
              <TextHeadingSubsection 
                :class="availableSpots === 0 ? 'text-red-500' : 'text-green-500'"
              >
                {{ availableSpots }}
              </TextHeadingSubsection>
            </div>
          </div>
        </LayoutColumn>
      </AppCard>

      <!-- RSVP Section -->
      <AppCard v-if="isLoggedIn">
        <LayoutColumn gap="4">
          <TextHeadingSubsection>Your Registration</TextHeadingSubsection>
          
          <div v-if="currentUserRegistration" class="p-4 rounded-lg bg-gray-50">
            <div class="flex items-center justify-between">
              <div>
                <TextBody class="font-semibold">
                  Status: {{ currentUserRegistration.status }}
                  <span v-if="currentUserRegistration.status === 'IN'">
                    ({{ currentUserRegistration.confirmed ? 'Confirmed' : 'Waitlist' }})
                  </span>
                </TextBody>
                <TextBodySmall class="text-gray-500">
                  Registered {{ new Date(currentUserRegistration.createdAt).toLocaleDateString() }}
                </TextBodySmall>
              </div>
              <UBadge 
                :color="currentUserRegistration.confirmed ? 'green' : 'yellow'"
                v-if="currentUserRegistration.status === 'IN'"
              >
                {{ currentUserRegistration.confirmed ? 'Confirmed' : 'Waitlist' }}
              </UBadge>
            </div>
          </div>

          <div v-if="canRegister || currentUserRegistration">
            <TextBodySmall class="text-gray-600 mb-3">
              {{ canRegister ? 'Register for this event:' : 'Update your registration:' }}
            </TextBodySmall>
            
            <div class="flex gap-2 flex-wrap">
              <UButton 
                @click="submitRSVP('IN')"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                color="green"
                :variant="currentUserRegistration?.status === 'IN' ? 'solid' : 'outline'"
              >
                I'm In {{ availableSpots === 0 ? '(Waitlist)' : '' }}
              </UButton>
              
              <UButton 
                @click="submitRSVP('MAYBE')"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                color="yellow"
                :variant="currentUserRegistration?.status === 'MAYBE' ? 'solid' : 'outline'"
              >
                Maybe
              </UButton>
              
              <UButton 
                @click="submitRSVP('OUT')"
                :loading="isSubmitting"
                :disabled="isSubmitting"
                color="red"
                :variant="currentUserRegistration?.status === 'OUT' ? 'solid' : 'outline'"
              >
                Can't Make It
              </UButton>
            </div>
          </div>
        </LayoutColumn>
      </AppCard>

      <!-- Registration Lists -->
      <LayoutRow gap="4">
        <!-- Confirmed Players -->
        <AppCard class="flex-1">
          <LayoutColumn gap="3">
            <TextHeadingSubsection>Confirmed Players ({{ confirmedRegistrations.length }})</TextHeadingSubsection>
            <div v-if="confirmedRegistrations.length === 0" class="text-gray-500 text-sm">
              No confirmed players yet
            </div>
            <div v-else class="space-y-2">
              <div 
                v-for="reg in confirmedRegistrations" 
                :key="reg.id"
                class="flex items-center justify-between p-2 bg-green-50 rounded"
              >
                <span>{{ reg.user.nickname || `${reg.user.first} ${reg.user.last}` }}</span>
                <UBadge color="green" size="xs">Confirmed</UBadge>
              </div>
            </div>
          </LayoutColumn>
        </AppCard>

        <!-- Waitlist -->
        <AppCard class="flex-1" v-if="waitlistRegistrations.length > 0">
          <LayoutColumn gap="3">
            <TextHeadingSubsection>Waitlist ({{ waitlistRegistrations.length }})</TextHeadingSubsection>
            <div class="space-y-2">
              <div 
                v-for="(reg, index) in waitlistRegistrations" 
                :key="reg.id"
                class="flex items-center justify-between p-2 bg-yellow-50 rounded"
              >
                <span>#{{ index + 1 }} {{ reg.user.nickname || `${reg.user.first} ${reg.user.last}` }}</span>
                <UBadge color="yellow" size="xs">Waitlist</UBadge>
              </div>
            </div>
          </LayoutColumn>
        </AppCard>
      </LayoutRow>

      <!-- Maybe/Out Lists (Collapsible) -->
      <LayoutRow gap="4" v-if="maybeRegistrations.length > 0 || outRegistrations.length > 0">
        <AppCard class="flex-1" v-if="maybeRegistrations.length > 0">
          <LayoutColumn gap="3">
            <TextHeadingSubsection>Maybe ({{ maybeRegistrations.length }})</TextHeadingSubsection>
            <div class="space-y-1">
              <div 
                v-for="reg in maybeRegistrations" 
                :key="reg.id"
                class="text-sm text-gray-600"
              >
                {{ reg.user.nickname || `${reg.user.first} ${reg.user.last}` }}
              </div>
            </div>
          </LayoutColumn>
        </AppCard>

        <AppCard class="flex-1" v-if="outRegistrations.length > 0">
          <LayoutColumn gap="3">
            <TextHeadingSubsection>Can't Make It ({{ outRegistrations.length }})</TextHeadingSubsection>
            <div class="space-y-1">
              <div 
                v-for="reg in outRegistrations" 
                :key="reg.id"
                class="text-sm text-gray-400"
              >
                {{ reg.user.nickname || `${reg.user.first} ${reg.user.last}` }}
              </div>
            </div>
          </LayoutColumn>
        </AppCard>
      </LayoutRow>

      <!-- Event Management (Organizers Only) -->
      <AppCard v-if="canManageEvent">
        <LayoutColumn gap="4">
          <TextHeadingSubsection>Event Management</TextHeadingSubsection>
          <LayoutRow gap="2">
            <UButton 
              v-if="event?.status === 'PLANNED'"
              :to="`/events/${eventId}/manage`"
              color="blue"
            >
              Manage Event
            </UButton>
            
            <UButton 
              v-if="event?.status === 'ACTIVE'"
              :to="`/events/${eventId}/games`"
              color="green"
            >
              Manage Games
            </UButton>

            <UButton 
              v-if="event?.status === 'PLANNED' && confirmedRegistrations.length >= event?.minPlayers"
              color="green"
              variant="solid"
            >
              Start Event
            </UButton>
          </LayoutRow>
        </LayoutColumn>
      </AppCard>
    </LayoutColumn>
  </LayoutContainer>
</template> 