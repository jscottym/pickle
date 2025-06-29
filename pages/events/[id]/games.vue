<script setup lang="ts">
const route = useRoute()
const { currentUser } = useUserStore()
const eventId = route.params.id as string

// Fetch event and games data
const { data: event } = await useFetch(`/api/events/${eventId}`)
const { data: games } = await useFetch(`/api/events/${eventId}/games`)

// Check permissions
const canManageEvent = computed(() => {
  if (!currentUser || !event.value) return false
  return currentUser.role === 'ADMIN' || 
         event.value.organizerId === currentUser.id ||
         event.value.managers?.some(m => m.id === currentUser.id)
})

// Filter games by status
const activeGames = computed(() => 
  games.value?.filter(g => g.status === 'IN_PROGRESS') || []
)
const scheduledGames = computed(() => 
  games.value?.filter(g => g.status === 'SCHEDULED') || []
)
const finishedGames = computed(() => 
  games.value?.filter(g => g.status === 'FINISHED') || []
)

// Scoring state
const scoringGame = ref(null)
const scoreForm = ref({
  team1Score: 0,
  team2Score: 0,
  notes: ''
})

const startScoring = (game) => {
  scoringGame.value = game
  scoreForm.value = {
    team1Score: 0,
    team2Score: 0,
    notes: ''
  }
}

const submitScore = async () => {
  if (!scoringGame.value) return
  
  try {
    await $fetch(`/api/games/${scoringGame.value.id}/score`, {
      method: 'POST',
      body: {
        result: {
          team1Score: scoreForm.value.team1Score,
          team2Score: scoreForm.value.team2Score,
          winner: scoreForm.value.team1Score > scoreForm.value.team2Score ? 'team1' : 'team2'
        },
        notes: scoreForm.value.notes
      }
    })
    
    // Refresh games data
    await refreshCookie('games')
    scoringGame.value = null
  } catch (error) {
    console.error('Failed to submit score:', error)
  }
}

const startGame = async (gameId: string) => {
  try {
    await $fetch(`/api/games/${gameId}/start`, {
      method: 'POST'
    })
    await refreshCookie('games')
  } catch (error) {
    console.error('Failed to start game:', error)
  }
}

const formatPlayerNames = (players) => {
  return players.map(p => p.user.nickname || `${p.user.first} ${p.user.last}`).join(' & ')
}

// Mock function to get teams from players (in real app this would be based on game format)
const getTeams = (players) => {
  const team1 = players.slice(0, 2)
  const team2 = players.slice(2, 4)
  return { team1, team2 }
}
</script>

<template>
  <LayoutContainer>
    <LayoutColumn gap="6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <TextHeadingPage>Game Management</TextHeadingPage>
          <TextBody class="text-gray-600">{{ event?.name }}</TextBody>
        </div>
        <UButton :to="`/events/${eventId}`" color="gray" variant="outline">
          Back to Event
        </UButton>
      </div>

      <!-- Permission Check -->
      <div v-if="!canManageEvent" class="text-center py-8">
        <TextBody class="text-red-600">You don't have permission to manage this event.</TextBody>
      </div>

      <div v-else>
        <!-- Active Games -->
        <div v-if="activeGames.length > 0">
          <TextHeadingSection class="mb-4">🔥 Games in Progress</TextHeadingSection>
          <LayoutGrid cols="1" gap="4">
            <AppCard 
              v-for="game in activeGames" 
              :key="game.id"
              class="border-l-4 border-green-500"
            >
              <LayoutColumn gap="4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <TextHeadingSubsection>{{ game.name || 'Game' }}</TextHeadingSubsection>
                    <div class="mt-2">
                      <template v-if="game.players.length === 4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="p-3 bg-blue-50 rounded">
                            <TextBodySmall class="text-blue-600 font-semibold">Team 1</TextBodySmall>
                            <TextBody>{{ formatPlayerNames(getTeams(game.players).team1) }}</TextBody>
                          </div>
                          <div class="p-3 bg-red-50 rounded">
                            <TextBodySmall class="text-red-600 font-semibold">Team 2</TextBodySmall>
                            <TextBody>{{ formatPlayerNames(getTeams(game.players).team2) }}</TextBody>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <TextBody>{{ formatPlayerNames(game.players) }}</TextBody>
                      </template>
                    </div>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span v-if="game.court">Court: {{ game.court.name }}</span>
                      <span v-if="game.startTime">
                        Started: {{ new Date(game.startTime).toLocaleTimeString() }}
                      </span>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <UBadge color="green" variant="solid">In Progress</UBadge>
                  </div>
                </div>
                
                <div class="flex gap-2">
                  <UButton @click="startScoring(game)" color="blue">
                    Enter Score
                  </UButton>
                </div>
              </LayoutColumn>
            </AppCard>
          </LayoutGrid>
        </div>

        <!-- Scheduled Games -->
        <div v-if="scheduledGames.length > 0">
          <TextHeadingSection class="mb-4">📅 Scheduled Games</TextHeadingSection>
          <LayoutGrid cols="1" gap="4">
            <AppCard 
              v-for="game in scheduledGames" 
              :key="game.id"
              class="border-l-4 border-blue-500"
            >
              <LayoutColumn gap="4">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <TextHeadingSubsection>{{ game.name || 'Game' }}</TextHeadingSubsection>
                    <div class="mt-2">
                      <template v-if="game.players.length === 4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div class="p-3 bg-blue-50 rounded">
                            <TextBodySmall class="text-blue-600 font-semibold">Team 1</TextBodySmall>
                            <TextBody>{{ formatPlayerNames(getTeams(game.players).team1) }}</TextBody>
                          </div>
                          <div class="p-3 bg-red-50 rounded">
                            <TextBodySmall class="text-red-600 font-semibold">Team 2</TextBodySmall>
                            <TextBody>{{ formatPlayerNames(getTeams(game.players).team2) }}</TextBody>
                          </div>
                        </div>
                      </template>
                      <template v-else>
                        <TextBody>{{ formatPlayerNames(game.players) }}</TextBody>
                      </template>
                    </div>
                    <div class="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span v-if="game.court">Court: {{ game.court.name }}</span>
                    </div>
                  </div>
                  <UBadge color="blue" variant="solid">Scheduled</UBadge>
                </div>
                
                <div class="flex gap-2">
                  <UButton @click="startGame(game.id)" color="green">
                    Start Game
                  </UButton>
                </div>
              </LayoutColumn>
            </AppCard>
          </LayoutGrid>
        </div>

        <!-- Finished Games -->
        <div v-if="finishedGames.length > 0">
          <TextHeadingSection class="mb-4">✅ Finished Games</TextHeadingSection>
          <LayoutGrid cols="1" gap="4">
            <AppCard 
              v-for="game in finishedGames" 
              :key="game.id"
              class="border-l-4 border-gray-400 opacity-75"
            >
              <LayoutColumn gap="3">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <TextHeadingSubsection>{{ game.name || 'Game' }}</TextHeadingSubsection>
                    <div class="mt-2">
                      <template v-if="game.result">
                        <div class="p-3 bg-gray-50 rounded">
                          <TextBodySmall class="font-semibold">Final Score</TextBodySmall>
                          <TextBody>
                            {{ game.result.team1Score }} - {{ game.result.team2Score }}
                            <span class="text-green-600 font-semibold ml-2">
                              ({{ game.result.winner === 'team1' ? 'Team 1' : 'Team 2' }} wins)
                            </span>
                          </TextBody>
                        </div>
                      </template>
                    </div>
                  </div>
                  <UBadge color="gray" variant="solid">Finished</UBadge>
                </div>
              </LayoutColumn>
            </AppCard>
          </LayoutGrid>
        </div>

        <!-- No Games -->
        <AppCard v-if="games?.length === 0">
          <TextBodySmall class="text-gray-500 text-center py-8">
            No games have been created for this event yet.
          </TextBodySmall>
        </AppCard>
      </div>
    </LayoutColumn>

    <!-- Scoring Modal -->
    <UModal v-model="scoringGame" :ui="{ width: 'max-w-md' }">
      <div class="p-6" v-if="scoringGame">
        <TextHeadingSubsection class="mb-4">Enter Game Score</TextHeadingSubsection>
        
        <LayoutColumn gap="4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Team 1 Score</label>
              <UInput 
                v-model.number="scoreForm.team1Score" 
                type="number"
                min="0"
                class="w-full"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2">Team 2 Score</label>
              <UInput 
                v-model.number="scoreForm.team2Score" 
                type="number"
                min="0"
                class="w-full"
              />
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Notes (optional)</label>
            <UTextarea 
              v-model="scoreForm.notes" 
              placeholder="Add any notes about the game..."
              class="w-full"
            />
          </div>
          
          <div class="flex gap-2 justify-end">
            <UButton @click="scoringGame = null" color="gray" variant="outline">
              Cancel
            </UButton>
            <UButton @click="submitScore" color="green">
              Submit Score
            </UButton>
          </div>
        </LayoutColumn>
      </div>
    </UModal>
  </LayoutContainer>
</template> 