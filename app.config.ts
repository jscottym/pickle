export default defineAppConfig({
  ui: {
    dropdownMenu: {
      slots: {
        content: 'min-w-32 bg-default shadow-lg rounded-md ring ring-default overflow-hidden flex flex-col'
      }
    },
    formField: {
      slots: {
        root: 'w-full'
      }
    },
    input: {
      slots: {
        root: 'w-full',
      }
    },
    textarea: {
      slots: {
        base: 'w-full'
      }
    },
    select: {
      slots: {
        base: 'w-full'
      }
    },
    selectMenu: {
      slots: {
        base: 'w-full'
      }
    },
    badge: {
      slots: {
        base: 'font-medium inline-flex items-center',
        label: 'truncate',
        leadingIcon: 'shrink-0',
        leadingAvatar: 'shrink-0',
        leadingAvatarSize: '',
        trailingIcon: 'shrink-0'
      },
      variants: {
        buttonGroup: {
          horizontal: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]',
          vertical: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]'
        },
        color: {
          primary: '',
          secondary: '',
          success: '',
          info: '',
          warning: '',
          error: '',
          neutral: '',
          // Custom role colors
          crimson: '',
          ruby: '',
          rose: '',
          pink: '',
          fuchsia: '',
          purple: '',
          violet: '',
          indigo: '',
          blue: '',
          cyan: '',
          teal: '',
          emerald: '',
          green: '',
          lime: '',
          yellow: '',
          amber: '',
          orange: '',
          red: '',
          slate: '',
          gray: '',
          zinc: '',
          stone: ''
        },
        variant: {
          solid: '',
          outline: '',
          soft: '',
          subtle: ''
        },
        size: {
          xs: {
            base: 'text-[8px]/3 px-1 py-0.5 gap-1 rounded-sm',
            leadingIcon: 'size-3',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-3'
          },
          sm: {
            base: 'text-[10px]/3 px-1.5 py-1 gap-1 rounded-sm',
            leadingIcon: 'size-3',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-3'
          },
          md: {
            base: 'text-xs px-2 py-1 gap-1 rounded-md',
            leadingIcon: 'size-4',
            leadingAvatarSize: '3xs',
            trailingIcon: 'size-4'
          },
          lg: {
            base: 'text-sm px-2 py-1 gap-1.5 rounded-md',
            leadingIcon: 'size-5',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-5'
          },
          xl: {
            base: 'text-base px-2.5 py-1 gap-1.5 rounded-md',
            leadingIcon: 'size-6',
            leadingAvatarSize: '2xs',
            trailingIcon: 'size-6'
          }
        },
        square: {
          true: ''
        }
      },
      compoundVariants: [
        // Standard colors
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-primary text-inverted'
        },
        {
          color: 'primary',
          variant: 'outline',
          class: 'text-primary ring ring-inset ring-primary/50'
        },
        {
          color: 'primary',
          variant: 'soft',
          class: 'bg-primary/10 text-primary'
        },
        {
          color: 'primary',
          variant: 'subtle',
          class: 'bg-primary/10 text-primary ring ring-inset ring-primary/25'
        },
        {
          color: 'neutral',
          variant: 'solid',
          class: 'text-inverted bg-inverted'
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'ring ring-inset ring-accented text-default bg-default'
        },
        {
          color: 'neutral',
          variant: 'soft',
          class: 'text-default bg-elevated'
        },
        {
          color: 'neutral',
          variant: 'subtle',
          class: 'ring ring-inset ring-accented text-default bg-elevated'
        },
        // Custom role colors
        {
          color: 'crimson',
          variant: 'subtle',
          class: 'bg-red-50 text-red-700 ring ring-inset ring-red-600/20'
        },
        {
          color: 'ruby',
          variant: 'subtle',
          class: 'bg-red-100 text-red-800 ring ring-inset ring-red-700/30'
        },
        {
          color: 'rose',
          variant: 'subtle',
          class: 'bg-rose-50 text-rose-700 ring ring-inset ring-rose-600/20'
        },
        {
          color: 'pink',
          variant: 'subtle',
          class: 'bg-pink-50 text-pink-700 ring ring-inset ring-pink-600/20'
        },
        {
          color: 'fuchsia',
          variant: 'subtle',
          class: 'bg-fuchsia-50 text-fuchsia-700 ring ring-inset ring-fuchsia-600/20'
        },
        {
          color: 'purple',
          variant: 'subtle',
          class: 'bg-purple-50 text-purple-700 ring ring-inset ring-purple-600/20'
        },
        {
          color: 'violet',
          variant: 'subtle',
          class: 'bg-violet-50 text-violet-700 ring ring-inset ring-violet-600/20'
        },
        {
          color: 'indigo',
          variant: 'subtle',
          class: 'bg-indigo-50 text-indigo-700 ring ring-inset ring-indigo-600/20'
        },
        {
          color: 'blue',
          variant: 'subtle',
          class: 'bg-blue-50 text-blue-700 ring ring-inset ring-blue-600/20'
        },
        {
          color: 'cyan',
          variant: 'subtle',
          class: 'bg-cyan-50 text-cyan-700 ring ring-inset ring-cyan-600/20'
        },
        {
          color: 'teal',
          variant: 'subtle',
          class: 'bg-teal-50 text-teal-700 ring ring-inset ring-teal-600/20'
        },
        {
          color: 'emerald',
          variant: 'subtle',
          class: 'bg-emerald-50 text-emerald-700 ring ring-inset ring-emerald-600/20'
        },
        {
          color: 'green',
          variant: 'subtle',
          class: 'bg-green-50 text-green-700 ring ring-inset ring-green-600/20'
        },
        {
          color: 'lime',
          variant: 'subtle',
          class: 'bg-lime-50 text-lime-700 ring ring-inset ring-lime-600/20'
        },
        {
          color: 'yellow',
          variant: 'subtle',
          class: 'bg-yellow-50 text-yellow-700 ring ring-inset ring-yellow-600/20'
        },
        {
          color: 'amber',
          variant: 'subtle',
          class: 'bg-amber-50 text-amber-700 ring ring-inset ring-amber-600/20'
        },
        {
          color: 'orange',
          variant: 'subtle',
          class: 'bg-orange-50 text-orange-700 ring ring-inset ring-orange-600/20'
        },
        {
          color: 'red',
          variant: 'subtle',
          class: 'bg-red-50 text-red-700 ring ring-inset ring-red-600/20'
        },
        {
          color: 'slate',
          variant: 'subtle',
          class: 'bg-slate-100 text-slate-700 ring ring-inset ring-slate-600/20'
        },
        {
          color: 'gray',
          variant: 'subtle',
          class: 'bg-gray-100 text-gray-700 ring ring-inset ring-gray-600/20'
        },
        {
          color: 'zinc',
          variant: 'subtle',
          class: 'bg-zinc-100 text-zinc-700 ring ring-inset ring-zinc-600/20'
        },
        {
          color: 'stone',
          variant: 'subtle',
          class: 'bg-stone-100 text-stone-700 ring ring-inset ring-stone-600/20'
        },
        // Size and square combinations
        {
          size: 'xs',
          square: true,
          class: 'p-0.5'
        },
        {
          size: 'sm',
          square: true,
          class: 'p-1'
        },
        {
          size: 'md',
          square: true,
          class: 'p-1'
        },
        {
          size: 'lg',
          square: true,
          class: 'p-1'
        },
        {
          size: 'xl',
          square: true,
          class: 'p-1'
        }
      ],
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md'
      }
    }
  }
}) 