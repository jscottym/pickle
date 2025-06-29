<script setup lang="ts">
import { useTwMerge } from '@/composables/useTwMerge';

type SpacingSize =
  | '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | '14'
  | '16'
  | '20'
  | '24'
  | '28'
  | '32'
  | '36'
  | '40'
  | '44'
  | '48'
  | '52'
  | '56'
  | '60'
  | '64'
  | '72'
  | '80'
  | '96'
  | 'px'
  | 'full'
  | 'screen'
  | 'min'
  | 'max'
  | 'fit';

interface Props {
  size?: SpacingSize;
  horizontal?: boolean;
  vertical?: boolean;
  wide?: boolean;
  tall?: boolean;
  fill?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  size: undefined,
  horizontal: false,
  vertical: false,
  wide: false,
  tall: false,
  fill: false,
  class: '',
});

const { cn } = useTwMerge();

const widthMap: Record<SpacingSize, string> = {
  '0': 'w-0',
  '0.5': 'w-0.5',
  '1': 'w-1',
  '1.5': 'w-1.5',
  '2': 'w-2',
  '2.5': 'w-2.5',
  '3': 'w-3',
  '3.5': 'w-3.5',
  '4': 'w-4',
  '5': 'w-5',
  '6': 'w-6',
  '7': 'w-7',
  '8': 'w-8',
  '9': 'w-9',
  '10': 'w-10',
  '11': 'w-11',
  '12': 'w-12',
  '14': 'w-14',
  '16': 'w-16',
  '20': 'w-20',
  '24': 'w-24',
  '28': 'w-28',
  '32': 'w-32',
  '36': 'w-36',
  '40': 'w-40',
  '44': 'w-44',
  '48': 'w-48',
  '52': 'w-52',
  '56': 'w-56',
  '60': 'w-60',
  '64': 'w-64',
  '72': 'w-72',
  '80': 'w-80',
  '96': 'w-96',
  px: 'w-px',
  full: 'w-full',
  screen: 'w-screen',
  min: 'w-min',
  max: 'w-max',
  fit: 'w-fit',
};

const heightMap: Record<SpacingSize, string> = {
  '0': 'h-0',
  '0.5': 'h-0.5',
  '1': 'h-1',
  '1.5': 'h-1.5',
  '2': 'h-2',
  '2.5': 'h-2.5',
  '3': 'h-3',
  '3.5': 'h-3.5',
  '4': 'h-4',
  '5': 'h-5',
  '6': 'h-6',
  '7': 'h-7',
  '8': 'h-8',
  '9': 'h-9',
  '10': 'h-10',
  '11': 'h-11',
  '12': 'h-12',
  '14': 'h-14',
  '16': 'h-16',
  '20': 'h-20',
  '24': 'h-24',
  '28': 'h-28',
  '32': 'h-32',
  '36': 'h-36',
  '40': 'h-40',
  '44': 'h-44',
  '48': 'h-48',
  '52': 'h-52',
  '56': 'h-56',
  '60': 'h-60',
  '64': 'h-64',
  '72': 'h-72',
  '80': 'h-80',
  '96': 'h-96',
  px: 'h-px',
  full: 'h-full',
  screen: 'h-screen',
  min: 'h-min',
  max: 'h-max',
  fit: 'h-fit',
};

const getSpacerClasses = () => {
  const classes = [];

  if (props.size) {
    if (props.horizontal) classes.push(widthMap[props.size]);
    else if (props.vertical) classes.push(heightMap[props.size]);
    else {
      classes.push(widthMap[props.size]);
      classes.push(heightMap[props.size]);
    }
  } else {
    classes.push('flex-1');
  }

  if (props.fill || props.wide) classes.push('w-full');
  if (props.fill || props.tall) classes.push('h-full');

  return classes;
};
</script>

<template>
  <div :class="cn(getSpacerClasses(), props.class)" />
</template>
