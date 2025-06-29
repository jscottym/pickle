<script setup lang="ts">
const router = useRouter();
const goToLogin = () => {
  router.push('/login');
};

const navigationItems = [
  { label: 'Home', icon: 'i-heroicons-home', to: '#' },
  { label: 'About', icon: 'i-heroicons-information-circle', to: '#about' },
  { label: 'Services', icon: 'i-heroicons-briefcase', to: '#services' },
  { label: 'Contact', icon: 'i-heroicons-envelope', to: '#contact' },
];
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/" class="text-lg lg:text-2xl font-bold text-primary">
        <div class="whitespace-nowrap">True Impact</div>
      </NuxtLink>
    </template>

    <template #default>
      <UNavigationMenu
        :items="navigationItems"
        highlight
        highlight-color="primary"
      />
    </template>

    <template #right>
      <UButton color="primary" variant="solid" @click="goToLogin"
        >Login</UButton
      >
    </template>
  </UHeader>
  <UContainer class="py-8">
    <slot />
  </UContainer>
</template>
