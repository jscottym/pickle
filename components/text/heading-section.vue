<script setup lang="ts">
import TextBase from './base.vue';
import { createBaseTextProps } from './types';

const props = defineProps({
  ...createBaseTextProps({
    as: 'h2',
    variant: 'heading-section',
  }),
});
</script>

<template>
  <TextBase v-bind="props">
    <slot />
  </TextBase>
</template>
