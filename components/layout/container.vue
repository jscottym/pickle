<script setup lang="ts">
import { useTwMerge } from '@/composables/useTwMerge';

type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type Padding = '0' | '2' | '4' | '6' | '8' | '12' | '16' | '20' | '24';

interface Props {
  size?: Size;
  padding?: Padding;
  center?: boolean;
  wide?: boolean;
  tall?: boolean;
  expandable?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  padding: undefined,
  center: true,
  wide: false,
  tall: false,
  expandable: false,
  class: '',
});

const { cn } = useTwMerge();

const paddingMap: Record<Padding, string> = {
  '0': 'px-0',
  '2': 'px-2',
  '4': 'px-4',
  '6': 'px-6',
  '8': 'px-8',
  '12': 'px-12',
  '16': 'px-16',
  '20': 'px-20',
  '24': 'px-24',
};

const getPaddingClass = () => {
  if (props.padding === undefined) {
    return '';
  }
  return paddingMap[props.padding];
};

const getMaxWidthClass = () => {
  if (props.expandable) {
    switch (props.size) {
      case 'sm':
        return 'min-w-2xl max-w-full'; // 42rem (672px) - closest to 640px
      case 'md':
        return 'min-w-3xl max-w-full'; // 48rem (768px) - exact match
      case 'lg':
        return 'min-w-5xl max-w-full'; // 64rem (1024px) - exact match
      case 'xl':
        return 'min-w-7xl max-w-full'; // 80rem (1280px) - exact match
      case '2xl':
        return 'min-w-7xl max-w-full'; // 80rem (1280px) - closest to 1536px
      case 'full':
        return 'w-full';
      default:
        return 'min-w-5xl max-w-full'; // 64rem (1024px) - lg default
    }
  }

  switch (props.size) {
    case 'sm':
      return 'max-w-2xl'; // 42rem (672px)
    case 'md':
      return 'max-w-3xl'; // 48rem (768px)
    case 'lg':
      return 'max-w-5xl'; // 64rem (1024px)
    case 'xl':
      return 'max-w-7xl'; // 80rem (1280px)
    case '2xl':
      return 'max-w-7xl'; // 80rem (1280px) - closest available
    case 'full':
      return 'max-w-full';
    default:
      return 'max-w-5xl'; // 64rem (1024px) - lg default
  }
};

const getSizeClasses = () => {
  const classes = [];
  if (props.wide && !props.expandable) classes.push('w-full');
  if (props.tall) classes.push('h-full');
  return classes;
};

const combinedClasses = computed(() => {
  return cn(
    getMaxWidthClass(),
    getPaddingClass(),
    props.center ? 'mx-auto' : '',
    !props.expandable ? 'w-full' : 'w-fit',
    getSizeClasses(),
    props.class
  );
});
</script>

<template>
  <div :class="combinedClasses">
    <slot />
  </div>
</template>
