<script setup lang="ts">
import TextBase from './base.vue';
import { createBaseTextProps } from './types';

const props = defineProps({
  ...createBaseTextProps({
    as: 'p',
    variant: 'body',
  }),
});
</script>

<template>
  <TextBase v-bind="props">
    <slot />
  </TextBase>
</template>
