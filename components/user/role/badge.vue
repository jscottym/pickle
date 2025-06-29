<script lang="ts" setup>

interface Props {
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
});

const user = useUserStore();

const roleBadge = computed(() => {
  if (!user.currentUserRole) {
    return {
      text: 'Unknown',
      color: 'neutral',
    };
  }

  const roleType = user.currentUserRole;

  switch (roleType) {
    case 'PLAYER':
      return {
        text: 'Player',
        color: 'primary',
      };
    case 'ORGANIZER':
      return {
        text: 'Organizer',
        color: 'primary',
      };
    case 'ADMIN':
      return {
        text: 'Admin',
        color: 'primary',
      };
    default:
      return {
        text: 'Unknown',
        color: 'neutral',
      };
  }
});
</script>

<template>
  <UBadge
    :size="size"
    :color="roleBadge.color as any"
    variant="subtle"
    class="text-nowrap"
  >
    {{ roleBadge.text }}
  </UBadge>
</template>
