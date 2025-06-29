<script setup lang="ts">
// Example usage of Pinia store
const counterStore = useCounterStore()

// Page meta
useSeoMeta({
  title: 'Pickle - Nuxt UI v3 + Pinia + Prisma',
  description: 'A modern stack with Nuxt UI v3, Tailwind CSS v4, Pinia, and Prisma'
})
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
              <span class="font-medium">✅ Ready</span>
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