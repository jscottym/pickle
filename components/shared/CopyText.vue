<script setup lang="ts">
// use vueuse useClipboard and create a copyText function

import { useClipboard } from '@vueuse/core';

const props = defineProps({
  text: {
    type: String,
    required: true,
  },
  copyLabel: {
    type: String,
    required: false,
    default: 'Copy',
  },
  copiedLabel: {
    type: String,
    required: false,
    default: 'Copied',
  },
  icon: Boolean,
});

const { copy } = useClipboard();
// change the icon to a checkbox for 2 seconds, then back to the copy icon
const copying = ref(false);
const buttonIcon = computed(() =>
  !copying.value
    ? 'material-symbols:content-copy'
    : 'heroicons-solid:check-circle'
);

const copyText = async () => {
  await copy(props.text);
  copying.value = true;
  setTimeout(() => {
    copying.value = false;
  }, 2000);
};
</script>

<template>
  <UButton
    class="text-xs"
    :leading-icon="buttonIcon"
    variant="soft"
    @click="copyText"
  >
    <template v-if="!icon && (copyLabel || copiedLabel)">
      {{ copying ? copiedLabel || 'Copied' : copyLabel || 'Copy' }}
    </template>
  </UButton>
</template>

<style scoped lang="scss"></style>
