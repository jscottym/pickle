<script setup lang="ts">
import TextBase from './base.vue';
import { createBaseTextProps } from './types';

const props = defineProps({
  ...createBaseTextProps({
    as: 'h3',
    variant: 'heading-subsection',
  }),
});
</script>

<template>
  <TextBase v-bind="props">
    <slot />
  </TextBase>
</template>
