<script setup lang="ts">
import { computed } from 'vue';

const attrs = useAttrs();
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  subtitle: {
    type: String,
    default: '',
  },
  titleIcon: {
    type: String,
    default: '',
  },
  wide: {
    type: Boolean,
    default: true,
  },
  tall: {
    type: Boolean,
    default: false,
  },
  showHeaderDivider: {
    type: Boolean,
    default: true,
  },
  showFooterDivider: {
    type: Boolean,
    default: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
});

const cardUi = computed(() => {
  const baseUi = {
    body: props.tall ? 'h-full' : '',
  };

  if (props.dense) {
    return {
      ...baseUi,
      header: 'p-1 sm:px-2',
      body: `p-1 sm:p-2 ${baseUi.body}`.trim(),
      footer: 'p-1 sm:px-2',
    };
  }

  return baseUi;
});
</script>

<template>
  <UCard :class="{ 'w-full': wide }" :ui="cardUi" v-bind="attrs">
    <template v-if="$slots.header || title || subtitle" #header>
      <slot name="header">
        <LayoutRow>
          <UIcon v-if="titleIcon" :name="titleIcon" class="h-6 w-6" />
          <LayoutColumn gap="0">
            <TextHeadingSubsection hide-if-empty :text="props.title" />
            <TextBodySmall hide-if-empty :text="props.subtitle" />
          </LayoutColumn>
        </LayoutRow>
      </slot>
    </template>

    <div :class="{ 'h-full': tall }">
      <slot />
    </div>

    <!-- Footer slot with optional leading divider -->
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>
