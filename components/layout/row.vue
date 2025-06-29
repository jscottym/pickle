<!-- eslint-disable-next-line vue/multi-word-component-names -->
<script setup lang="ts">
import { useTwMerge } from '@/composables/useTwMerge';

type AlignX = 'left' | 'center' | 'right' | 'between' | 'around' | 'evenly';
type AlignY = 'top' | 'center' | 'bottom' | 'stretch';
type Gap =
  | '0'
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '8'
  | '10'
  | '12'
  | '16'
  | '20'
  | '24';

interface Props {
  gap?: Gap;
  alignX?: AlignX;
  alignY?: AlignY;
  wrap?: boolean;
  spread?: boolean;
  wide?: boolean;
  tall?: boolean;
  fill?: boolean;
  left?: boolean;
  center?: boolean;
  right?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  gap: '2',
  alignX: 'left',
  alignY: 'center',
  wrap: false,
  spread: false,
  wide: false,
  tall: false,
  fill: false,
  left: false,
  center: false,
  right: false,
  class: '',
});

const { cn } = useTwMerge();

const gapMap: Record<Gap, string> = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '5': 'gap-5',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
  '16': 'gap-16',
  '20': 'gap-20',
  '24': 'gap-24',
};

const getJustifyClass = () => {
  if (props.spread) return 'justify-between';
  if (props.left) return 'justify-start';
  if (props.center) return 'justify-center';
  if (props.right) return 'justify-end';
  switch (props.alignX) {
    case 'left':
      return 'justify-start';
    case 'center':
      return 'justify-center';
    case 'right':
      return 'justify-end';
    case 'between':
      return 'justify-between';
    case 'around':
      return 'justify-around';
    case 'evenly':
      return 'justify-evenly';
    default:
      return 'justify-start';
  }
};

const getItemsClass = () => {
  switch (props.alignY) {
    case 'top':
      return 'items-start';
    case 'center':
      return 'items-center';
    case 'bottom':
      return 'items-end';
    case 'stretch':
      return 'items-stretch';
    default:
      return 'items-center';
  }
};

const getSizeClass = () => {
  const classes = [];
  if (props.fill || props.wide) classes.push('w-full');
  if (props.fill || props.tall) classes.push('h-full');
  return classes;
};
</script>

<template>
  <div
    :class="
      cn(
        'flex flex-row',
        gapMap[gap],
        wrap ? 'flex-wrap' : 'flex-nowrap',
        getItemsClass(),
        getJustifyClass(),
        getSizeClass(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
