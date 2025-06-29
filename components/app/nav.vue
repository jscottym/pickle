<script setup lang="ts">
export type UserMenuItem = {
  key?: string
  label: string
  description?: string
  icon: string
  to?: string
  onClick?: () => void
  children?: UserMenuItem[]
  disabled?: boolean
  tooltip?: any
  active?: boolean
}

export type CommandItem = {
  id: string
  label: string
  description?: string
  icon: string
  onSelect?: () => void
  onClick?: () => void
  to?: string
  items?: CommandItem[]
}

const router = useRouter();
const route = useRoute();
const { isLoggedIn, currentUser, currentUserRole } =
  storeToRefs(useUserStore());

// Command Palette
const isSearchOpen = ref(false);
const search = ref('');
const commandPaletteSelection = ref(undefined);

// Navigation Items based on user role
const navigationItems = computed((): UserMenuItem[] => {
  if (!isLoggedIn.value || !currentUserRole.value) {
    return [];
  }

  const commonItems: UserMenuItem[] = [
    {
      label: 'Dashboard',
      description: 'View your dashboard',
      icon: 'i-heroicons-squares-2x2',
      to: '/',
      active: route.path === '/'
    }
  ];

  const playerItems: UserMenuItem[] = [
    {
      label: 'Live',
      description: 'Your current live event',
      icon: 'i-heroicons-play-circle',
      to: '/live',
      active: route.path.startsWith('/live')
    },
    {
      label: 'Upcoming',
      description: 'Events you have joined',
      icon: 'i-heroicons-clock',
      to: '/upcoming',
      active: route.path.startsWith('/upcoming')
    },
    {
      label: 'Past Events',
      description: 'Your event history',
      icon: 'i-heroicons-archive-box',
      to: '/past-events',
      active: route.path.startsWith('/past-events')
    }
  ];

  const organizerItems: UserMenuItem[] = [
    {
      label: 'Events',
      description: 'Manage your events and tournaments',
      icon: 'i-heroicons-calendar-days',
      to: '/events',
      active: route.path.startsWith('/events')
    }
  ];

  const adminItems: UserMenuItem[] = [
    {
      label: 'Players',
      description: 'Manage all players in the system',
      icon: 'i-heroicons-users',
      to: '/players',
      active: route.path.startsWith('/players')
    },
    {
      label: 'Reports',
      description: 'View system reports and statistics',
      icon: 'i-heroicons-chart-bar',
      to: '/reports',
      active: route.path.startsWith('/reports')
    }
  ];

  switch (currentUserRole.value) {
    case 'PLAYER':
      return [
        ...commonItems,
        ...playerItems
      ];

    case 'ORGANIZER':
      return [
        ...commonItems,
        ...playerItems,
        ...organizerItems
      ];

    case 'ADMIN':
      return [
        ...commonItems,
        ...playerItems,
        ...organizerItems,
        ...adminItems
      ];

    default:
      return commonItems;
  }
});

// User menu items for dropdowns
const userMenuItems = computed(() => {
  if (!isLoggedIn.value) {
    return [];
  }

  const menuItems: UserMenuItem[] = [
    {
      label: 'Profile',
      description: 'View and edit your profile',
      icon: 'i-heroicons-user-circle',
      to: '/profile'
    },
    {
      label: 'Settings',
      description: 'Account settings and preferences',
      icon: 'i-heroicons-cog-6-tooth',
      to: '/settings'
    },
    {
      label: 'Log out',
      description: 'Sign out of your account',
      icon: 'i-heroicons-arrow-right-on-rectangle',
      onClick: () => {
        const userStore = useUserStore();
        userStore.logout();
        router.push('/');
      }
    }
  ];

  return [menuItems];
});

// User menu items for mobile navigation
const userNavigationItems = computed(() => {
  return userMenuItems.value[0] || [];
});

// Command palette groups
const commandGroups = computed(() => {
  const groups: any[] = [];
  
  if (navigationItems.value.length > 0) {
    groups.push({
      id: 'navigation',
      label: 'Navigation',
      items: navigationItems.value.map(item => ({
        id: item.label.toLowerCase().replace(/\s+/g, '-'),
        label: item.label,
        description: item.description,
        icon: item.icon,
        to: item.to,
        onSelect: item.onClick
      }))
    });
  }

  if (userNavigationItems.value.length > 0) {
    groups.push({
      id: 'user',
      label: 'User',
      items: userNavigationItems.value.map(item => ({
        id: item.label.toLowerCase().replace(/\s+/g, '-'),
        label: item.label,
        description: item.description,
        icon: item.icon,
        to: item.to,
        onSelect: item.onClick
      }))
    });
  }

  return groups;
});

defineShortcuts({
  meta_k: {
    usingInput: false,
    handler: () => {
      isSearchOpen.value = !isSearchOpen.value;
    },
  },
});

function closeCommandPalette() {
  isSearchOpen.value = false;
}

watch(commandPaletteSelection, (newValue) => {
  if (newValue) {
    handleCommandPaletteSelection(newValue);
  }
});

async function handleCommandPaletteSelection(item: CommandItem) {
  if (typeof item.onSelect === 'function') {
    await item.onSelect();
  } else if (typeof item.onClick === 'function') {
    item.onClick();
  } else if (typeof item.to === 'string') {
    router.push(item.to);
  }

  closeCommandPalette();
}

const mobileNavigationItems = computed(() => {
  return navigationItems.value.map((item) => {
    if (item.children && item.children.length > 0) {
      return {
        ...item,
        defaultOpen: true,
      };
    }
    return item;
  });
});
</script>

<template>
  <div
    class="sticky transition-all duration-200 bg-muted"
  >
    <UHeader
      :toggle="{
        color: 'primary',
        variant: 'subtle',
        class: 'rounded-full',
      }"
      :ui="{
        left: 'lg:flex-none lg:h-fit',
        right: 'lg:flex-none lg:h-fit',
      }"
      mode="modal"
    >
      <template #left>
        <LayoutRow class="h-fit">
          <AppLogo @click="router.push('/')" />
          <UTooltip text="Search for anything" :kbds="['meta', 'K']">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-magnifying-glass"
              aria-label="Search"
              @click="isSearchOpen = true"
            />
          </UTooltip>
        </LayoutRow>
      </template>

      <UNavigationMenu
        v-if="navigationItems.length > 0"
        :items="navigationItems"
        highlight
        highlight-color="primary"
      />

      <template #right>
        <template v-if="isLoggedIn">
          <LayoutRow gap="4" align-y="center" class="hidden lg:flex">
            <UDropdownMenu :items="userMenuItems" class="hidden sm:flex">
              <LayoutRow
                :wrap="false"
                class="cursor-pointer min-w-auto hover:bg-elevated rounded-md px-2 py-1 transition-colors"
              >
                <template v-if="currentUser">
                  <UserRoleDetails
                    :user-role="currentUserRole"
                    :user="currentUser"
                    size="md"
                  />
                </template>
                <template v-else>
                  <UAvatar size="sm" icon="i-heroicons-user" />
                  <TextBodySmall class="ml-2" color="light"
                    >Account Issue</TextBodySmall
                  >
                </template>
                <UIcon
                  name="i-heroicons-chevron-down-20-solid"
                  class="ml-1 flex-shrink-0 text-muted"
                />
              </LayoutRow>
            </UDropdownMenu>
          </LayoutRow>
        </template>
      </template>

      <template #body>
        <UNavigationMenu
          :items="mobileNavigationItems"
          orientation="vertical"
          class="-mx-2.5"
          highlight
          highlight-color="primary"
        />

        <!-- Mobile User Profile Section -->
        <template v-if="isLoggedIn">
          <USeparator class="my-4" />
          <LayoutColumn>
            <template v-if="currentUserRole">
              <UserRoleDetails
                :user-role="currentUserRole"
                :user="currentUser"
                size="lg"
                badge-placement="bottom"
              />
            </template>
            <template v-else>
              <LayoutRow gap="3" align-y="center" class="p-3">
                <UAvatar size="md" icon="i-heroicons-user" />
                <LayoutColumn gap="1">
                  <TextBodySmall bold color="dark">Account Issue</TextBodySmall>
                  <TextBodyTiny color="light"
                    >User not found in system</TextBodyTiny
                  >
                </LayoutColumn>
              </LayoutRow>
            </template>
            <UNavigationMenu
              :items="userNavigationItems"
              orientation="vertical"
              class="-mx-2.5"
            />
          </LayoutColumn>
        </template>
      </template>
    </UHeader>

    <!-- Command Palette Modal -->
    <UModal
      v-model:open="isSearchOpen"
      title="Search"
      description="Search for anything"
    >
      <template #content>
        <UCommandPalette
          v-model:search-term="search"
          v-model="commandPaletteSelection"
          :groups="commandGroups"
          placeholder="Search..."
          @update:open="!$event && closeCommandPalette()"
        />
      </template>
    </UModal>
  </div>
</template>
