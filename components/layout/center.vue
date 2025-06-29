<script setup lang="ts">
import { useTwMerge } from '@/composables/useTwMerge';

interface Props {
  horizontal?: boolean;
  vertical?: boolean;
  wide?: boolean;
  tall?: boolean;
  fill?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: undefined,
  vertical: undefined,
  wide: false,
  tall: false,
  fill: false,
  class: '',
});

const { cn } = useTwMerge();

const getFlexClasses = () => {
  const classes = ['flex'];

  if (props.fill || props.wide) classes.push('w-full');
  if (props.fill || props.tall) classes.push('h-full');

  // If neither horizontal nor vertical are explicitly set, center both ways
  if (props.horizontal === undefined && props.vertical === undefined) {
    classes.push('items-center', 'justify-center');
  } else {
    // If horizontal is explicitly set to true, or vertical is not set/false
    if (
      props.horizontal === true ||
      (props.horizontal === undefined && props.vertical === false)
    ) {
      classes.push('justify-center');
    }

    // If vertical is explicitly set to true, or horizontal is not set/false
    if (
      props.vertical === true ||
      (props.vertical === undefined && props.horizontal === false)
    ) {
      classes.push('items-center');
    }
  }

  return classes;
};
</script>

<template>
  <div :class="cn(getFlexClasses(), props.class)">
    <slot />
  </div>
</template>
