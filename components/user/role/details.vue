<script setup lang="ts">

interface Props {
  size?: 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
});

const user = useUserStore();

const badgeSize = computed(() => props.size === 'lg' ? 'sm' : 'xs');
</script>

<template>
  <UUser
    :name="user.fullName"
    :description="user.nickname"
    :avatar="{
      // src: 'https://i.pravatar.cc/150?u=john-doe',
      // icon: 'i-lucide-image'
      src: user.photoURL,
      icon: 'i-lucide-image'
    }"
  />
</template>
