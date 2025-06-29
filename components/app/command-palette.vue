<script setup lang="ts">
const { commandGroups } = useNavigation();

const isOpen = ref(false);
const searchTerm = ref('');

// Keyboard shortcut to open command palette
defineShortcuts({
  meta_k: {
    usingInput: true,
    handler: () => {
      isOpen.value = !isOpen.value;
    },
  },
});
</script>

<template>
  <UModal v-model="isOpen" :ui="{ width: 'w-full max-w-2xl' }">
    <UButton
      label="Search..."
      color="neutral"
      variant="subtle"
      icon="i-heroicons-magnifying-glass"
      trailing-icon="i-heroicons-command-line"
      class="justify-between w-full"
      @click="isOpen = true"
    />

    <template #content>
      <div class="p-0">
        <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-semibold">Command Palette</h3>
          <p class="text-sm text-gray-500 mt-1">
            Search for commands, navigate to pages, or perform actions
          </p>
        </div>

        <UCommandPalette
          v-model:search-term="searchTerm"
          :groups="commandGroups"
          placeholder="Type a command or search..."
          class="h-80 border-0"
          @update:model-value="isOpen = false"
        />
      </div>
    </template>
  </UModal>
</template>
