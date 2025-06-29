<script setup lang="ts">

</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 dark:bg-gray-900">
    <div
      class="transition-all duration-200 min-w-full"
    >
      <AppNav />
      <main class="main-content w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<style>
:root {
  --nav-z-index: 40;
  --ui-header-height: 3rem;

  /* Layout padding variables - xs (320px+) */
  --layout-padding-top: 0.75rem; /* 12px */
  --layout-padding-right: 0.75rem; /* 12px */
  --layout-padding-bottom: 0.75rem; /* 12px */
  --layout-padding-left: 0.75rem; /* 12px */

  --reka-select-trigger-width: 100%;
}

/* sm (640px+) */
@media (min-width: 640px) {
  :root {
    --layout-padding-top: 1rem; /* 16px */
    --layout-padding-right: 1rem; /* 16px */
    --layout-padding-bottom: 1rem; /* 16px */
    --layout-padding-left: 1rem; /* 16px */
  }
}

/* md (768px+) */
@media (min-width: 768px) {
  :root {
    --layout-padding-top: 1.25rem; /* 20px */
    --layout-padding-right: 1.5rem; /* 24px */
    --layout-padding-bottom: 1.25rem; /* 20px */
    --layout-padding-left: 1.5rem; /* 24px */
  }
}

/* lg (1024px+) */
@media (min-width: 1024px) {
  :root {
    --ui-header-height: 3.5rem;

    --layout-padding-top: 1.5rem; /* 24px */
    --layout-padding-right: 2rem; /* 32px */
    --layout-padding-bottom: 1.5rem; /* 24px */
    --layout-padding-left: 2rem; /* 32px */
  }
}

/* xl (1280px+) */
@media (min-width: 1280px) {
  :root {
    --layout-padding-top: 2rem; /* 32px */
    --layout-padding-right: 2.5rem; /* 40px */
    --layout-padding-bottom: 2rem; /* 32px */
    --layout-padding-left: 2.5rem; /* 40px */
  }
}

/* 2xl (1536px+) */
@media (min-width: 1536px) {
  :root {
    --layout-padding-top: 2rem; /* 32px */
    --layout-padding-right: 3rem; /* 48px */
    --layout-padding-bottom: 2rem; /* 32px */
    --layout-padding-left: 3rem; /* 48px */
  }
}

.main-content {
  padding-top: var(--layout-padding-top);
  padding-right: var(--layout-padding-right);
  padding-bottom: var(--layout-padding-bottom);
  padding-left: var(--layout-padding-left);
}

.max-w-viewport {
  max-width: calc(
    100vw - var(--layout-padding-left) - var(--layout-padding-right)
  );
}
</style>
