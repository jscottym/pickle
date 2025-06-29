<script setup lang="ts">
import { createBaseTextProps } from './types';

const props = defineProps(createBaseTextProps());
const slots = useSlots();

const hasContent = computed(() => {
  return props.text || slots.default;
});

const shouldHide = computed(() => {
  return props.hideIfEmpty && !hasContent.value;
});

const variantClasses = computed(() => {
  const getFontWeight = (defaultWeight: string) => {
    return props.bold ? 'font-bold' : defaultWeight;
  };

  switch (props.variant) {
    case 'heading-mega':
      return `text-6xl ${getFontWeight('font-normal')}`;
    case 'heading-mega-bold':
      return `text-6xl ${getFontWeight('font-black')}`;
    case 'heading-page':
      return `text-4xl ${getFontWeight('font-bold')}`;
    case 'heading-section':
      return `text-xl ${getFontWeight('font-bold')}`;
    case 'heading-subsection':
      return `text-lg ${getFontWeight('font-semibold')}`;
    case 'body':
      return `text-base ${getFontWeight('font-normal')}`;
    case 'body-large':
      return `text-lg ${getFontWeight('font-normal')}`;
    case 'body-small':
      return `text-sm ${getFontWeight('font-normal')}`;
    case 'body-tiny':
      return `text-xs ${getFontWeight('font-normal')}`;
    case 'code':
      return `text-sm font-mono bg-elevated px-1 py-0.5 rounded ${getFontWeight('font-normal')}`;
    default:
      return `text-base ${getFontWeight('font-normal')}`;
  }
});

const colorClasses = computed(() => {
  switch (props.color) {
    case 'primary':
      return 'text-primary';
    case 'success':
      return 'text-success';
    case 'error':
      return 'text-error';
    case 'light':
      return 'text-muted';
    case 'dark':
      return 'text-highlighted';
    default:
      return 'text-default';
  }
});

const alignClasses = computed(() => {
  if (props.centered) {
    return 'text-center';
  }

  switch (props.align) {
    case 'center':
      return 'text-center';
    case 'right':
      return 'text-right';
    case 'justify':
      return 'text-justify';
    default:
      return 'text-left';
  }
});

const marginClasses = computed(() => {
  if (!props.margin) return '';

  switch (props.variant) {
    case 'heading-mega':
      return 'mb-8';
    case 'heading-page':
      return 'mb-6';
    case 'heading-section':
      return 'mb-4';
    case 'heading-subsection':
      return 'mb-3';
    case 'body':
      return 'mb-4';
    case 'body-large':
      return 'mb-4';
    case 'body-small':
      return 'mb-2';
    case 'body-tiny':
      return 'mb-1';
    case 'code':
      return 'mb-2';
    default:
      return 'mb-2';
  }
});

const modifierClasses = computed(() => {
  const classes = [];

  if (props.truncate) classes.push('truncate');
  if (props.muted) classes.push('opacity-60');

  return classes.join(' ');
});

const allClasses = computed(() => {
  const baseClasses = [
    variantClasses.value,
    colorClasses.value,
    alignClasses.value,
    marginClasses.value,
    modifierClasses.value,
  ]
    .filter(Boolean)
    .join(' ');

  // Class prop overrides everything
  return props.class ? `${baseClasses} ${props.class}` : baseClasses;
});
</script>

<template>
  <component :is="as" v-if="!shouldHide" :class="allClasses">
    {{ text }}<slot />
  </component>
</template>
