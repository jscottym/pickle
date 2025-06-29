<script setup lang="ts">
const { data: events } = await useFetch('/api/events')

const upcomingEvents = computed(() => 
  events.value?.filter(e => e.status === 'PLANNED') || []
)

const activeEvents = computed(() => 
  events.value?.filter(e => e.status === 'ACTIVE') || []
)

const pastEvents = computed(() => 
  events.value?.filter(e => e.status === 'FINISHED') || []
)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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
      <div class="flex items-center justify-between">
        <TextHeadingPage>All Events</TextHeadingPage>
        <UButton to="/events/create" color="green" v-if="false">
          Create Event
        </UButton>
      </div>

      <!-- Active Events -->
      <div v-if="activeEvents.length > 0">
        <TextHeadingSection class="mb-4">🔥 Active Events</TextHeadingSection>
        <LayoutGrid cols="1" gap="4">
          <AppCard 
            v-for="event in activeEvents" 
            :key="event.id"
            class="border-l-4 border-green-500 hover:shadow-lg transition-shadow cursor-pointer"
            @click="$router.push(`/events/${event.id}`)"
          >
            <LayoutColumn gap="3">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <TextHeadingSubsection>{{ event.name }}</TextHeadingSubsection>
                  <div class="flex items-center gap-4 mt-2">
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                      {{ formatDate(event.date) }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-clock" class="w-4 h-4" />
                      {{ formatTime(event.startTime) }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
                      {{ event.location?.name }}
                    </div>
                  </div>
                </div>
                <UBadge color="green" variant="solid">LIVE</UBadge>
              </div>
              <TextBodySmall class="text-gray-600">{{ event.eventFormat?.name }}</TextBodySmall>
            </LayoutColumn>
          </AppCard>
        </LayoutGrid>
      </div>

      <!-- Upcoming Events -->
      <div>
        <TextHeadingSection class="mb-4">📅 Upcoming Events</TextHeadingSection>
        <LayoutGrid cols="1" gap="4" v-if="upcomingEvents.length > 0">
          <AppCard 
            v-for="event in upcomingEvents" 
            :key="event.id"
            class="border-l-4 border-blue-500 hover:shadow-lg transition-shadow cursor-pointer"
            @click="$router.push(`/events/${event.id}`)"
          >
            <LayoutColumn gap="3">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <TextHeadingSubsection>{{ event.name }}</TextHeadingSubsection>
                  <div class="flex items-center gap-4 mt-2">
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                      {{ formatDate(event.date) }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-clock" class="w-4 h-4" />
                      {{ formatTime(event.startTime) }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
                      {{ event.location?.name }}
                    </div>
                  </div>
                </div>
                <UBadge color="blue" variant="solid">{{ event.status }}</UBadge>
              </div>
              <div class="flex items-center justify-between">
                <TextBodySmall class="text-gray-600">{{ event.eventFormat?.name }}</TextBodySmall>
                <TextBodySmall class="text-gray-500">
                  {{ event._count?.registrations || 0 }}/{{ event.maxPlayers }} players
                </TextBodySmall>
              </div>
            </LayoutColumn>
          </AppCard>
        </LayoutGrid>
        <AppCard v-else>
          <TextBodySmall class="text-gray-500 text-center py-8">
            No upcoming events scheduled
          </TextBodySmall>
        </AppCard>
      </div>

      <!-- Past Events -->
      <div v-if="pastEvents.length > 0">
        <TextHeadingSection class="mb-4">🏆 Past Events</TextHeadingSection>
        <LayoutGrid cols="1" gap="4">
          <AppCard 
            v-for="event in pastEvents" 
            :key="event.id"
            class="border-l-4 border-gray-400 hover:shadow-lg transition-shadow cursor-pointer opacity-75"
            @click="$router.push(`/events/${event.id}`)"
          >
            <LayoutColumn gap="3">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <TextHeadingSubsection>{{ event.name }}</TextHeadingSubsection>
                  <div class="flex items-center gap-4 mt-2">
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-calendar" class="w-4 h-4" />
                      {{ formatDate(event.date) }}
                    </div>
                    <div class="flex items-center gap-1 text-sm text-gray-600">
                      <Icon name="i-heroicons-map-pin" class="w-4 h-4" />
                      {{ event.location?.name }}
                    </div>
                  </div>
                </div>
                <UBadge color="gray" variant="solid">FINISHED</UBadge>
              </div>
              <TextBodySmall class="text-gray-600">{{ event.eventFormat?.name }}</TextBodySmall>
            </LayoutColumn>
          </AppCard>
        </LayoutGrid>
      </div>
    </LayoutColumn>
  </LayoutContainer>
</template> 