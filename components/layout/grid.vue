<script setup lang="ts">
import { useTwMerge } from '@/composables/useTwMerge';

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
type Columns =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12';

interface Props {
  cols?: Columns;
  colsSm?: Columns;
  colsMd?: Columns;
  colsLg?: Columns;
  colsXl?: Columns;
  gap?: Gap;
  gapX?: Gap;
  gapY?: Gap;
  autoRows?: 'auto' | 'min' | 'max' | 'fr';
  wide?: boolean;
  tall?: boolean;
  fill?: boolean;
  centered?: boolean;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  cols: '1',
  colsSm: undefined,
  colsMd: undefined,
  colsLg: undefined,
  colsXl: undefined,
  gap: '4',
  gapX: undefined,
  gapY: undefined,
  autoRows: 'auto',
  wide: false,
  tall: false,
  fill: false,
  centered: true,
  class: '',
});

const { cn } = useTwMerge();

const gridColsMap: Record<Columns, string> = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
  '6': 'grid-cols-6',
  '7': 'grid-cols-7',
  '8': 'grid-cols-8',
  '9': 'grid-cols-9',
  '10': 'grid-cols-10',
  '11': 'grid-cols-11',
  '12': 'grid-cols-12',
};

const gridColsSmMap: Record<Columns, string> = {
  '1': 'sm:grid-cols-1',
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-3',
  '4': 'sm:grid-cols-4',
  '5': 'sm:grid-cols-5',
  '6': 'sm:grid-cols-6',
  '7': 'sm:grid-cols-7',
  '8': 'sm:grid-cols-8',
  '9': 'sm:grid-cols-9',
  '10': 'sm:grid-cols-10',
  '11': 'sm:grid-cols-11',
  '12': 'sm:grid-cols-12',
};

const gridColsMdMap: Record<Columns, string> = {
  '1': 'md:grid-cols-1',
  '2': 'md:grid-cols-2',
  '3': 'md:grid-cols-3',
  '4': 'md:grid-cols-4',
  '5': 'md:grid-cols-5',
  '6': 'md:grid-cols-6',
  '7': 'md:grid-cols-7',
  '8': 'md:grid-cols-8',
  '9': 'md:grid-cols-9',
  '10': 'md:grid-cols-10',
  '11': 'md:grid-cols-11',
  '12': 'md:grid-cols-12',
};

const gridColsLgMap: Record<Columns, string> = {
  '1': 'lg:grid-cols-1',
  '2': 'lg:grid-cols-2',
  '3': 'lg:grid-cols-3',
  '4': 'lg:grid-cols-4',
  '5': 'lg:grid-cols-5',
  '6': 'lg:grid-cols-6',
  '7': 'lg:grid-cols-7',
  '8': 'lg:grid-cols-8',
  '9': 'lg:grid-cols-9',
  '10': 'lg:grid-cols-10',
  '11': 'lg:grid-cols-11',
  '12': 'lg:grid-cols-12',
};

const gridColsXlMap: Record<Columns, string> = {
  '1': 'xl:grid-cols-1',
  '2': 'xl:grid-cols-2',
  '3': 'xl:grid-cols-3',
  '4': 'xl:grid-cols-4',
  '5': 'xl:grid-cols-5',
  '6': 'xl:grid-cols-6',
  '7': 'xl:grid-cols-7',
  '8': 'xl:grid-cols-8',
  '9': 'xl:grid-cols-9',
  '10': 'xl:grid-cols-10',
  '11': 'xl:grid-cols-11',
  '12': 'xl:grid-cols-12',
};

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

const gapXMap: Record<Gap, string> = {
  '0': 'gap-x-0',
  '1': 'gap-x-1',
  '2': 'gap-x-2',
  '3': 'gap-x-3',
  '4': 'gap-x-4',
  '5': 'gap-x-5',
  '6': 'gap-x-6',
  '8': 'gap-x-8',
  '10': 'gap-x-10',
  '12': 'gap-x-12',
  '16': 'gap-x-16',
  '20': 'gap-x-20',
  '24': 'gap-x-24',
};

const gapYMap: Record<Gap, string> = {
  '0': 'gap-y-0',
  '1': 'gap-y-1',
  '2': 'gap-y-2',
  '3': 'gap-y-3',
  '4': 'gap-y-4',
  '5': 'gap-y-5',
  '6': 'gap-y-6',
  '8': 'gap-y-8',
  '10': 'gap-y-10',
  '12': 'gap-y-12',
  '16': 'gap-y-16',
  '20': 'gap-y-20',
  '24': 'gap-y-24',
};

const getGridCols = () => {
  const classes = [gridColsMap[props.cols]];

  if (props.colsSm) classes.push(gridColsSmMap[props.colsSm]);
  if (props.colsMd) classes.push(gridColsMdMap[props.colsMd]);
  if (props.colsLg) classes.push(gridColsLgMap[props.colsLg]);
  if (props.colsXl) classes.push(gridColsXlMap[props.colsXl]);

  return classes;
};

const getGapClasses = () => {
  const classes = [];
  if (props.gapX) classes.push(gapXMap[props.gapX]);
  if (props.gapY) classes.push(gapYMap[props.gapY]);
  if (props.gap) classes.push(gapMap[props.gap]);
  return classes;
};

const getAutoRowsClass = () => {
  switch (props.autoRows) {
    case 'auto':
      return 'auto-rows-auto';
    case 'min':
      return 'auto-rows-min';
    case 'max':
      return 'auto-rows-max';
    case 'fr':
      return 'auto-rows-fr';
    default:
      return 'auto-rows-auto';
  }
};

const getSizeClasses = () => {
  const classes = [];
  if (props.fill || props.wide) classes.push('w-full');
  if (props.fill || props.tall) classes.push('h-full');
  return classes;
};

const getCenteringClasses = () => {
  if (props.centered) {
    return ['mx-auto'];
  }
  return [];
};
</script>

<template>
  <div
    :class="
      cn(
        'grid',
        ...getGridCols(),
        ...getGapClasses(),
        getAutoRowsClass(),
        getSizeClasses(),
        ...getCenteringClasses(),
        props.class
      )
    "
  >
    <slot />
  </div>
</template>
