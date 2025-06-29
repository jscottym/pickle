# Pickle

A modern Nuxt application with the latest stack:

- **Nuxt UI Pro v3** - Premium UI components with Tailwind CSS v4
- **Pinia** - State management for Vue
- **Prisma** - Next-generation ORM for database access

## Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
# Create .env file with:
DATABASE_URL="postgresql://username:password@localhost:5432/pickle_db?schema=public"

# Optional: If you have a Nuxt UI Pro license
NUXT_UI_PRO_LICENSE="your-license-key-here"
```

3. Initialize Prisma (first time setup):

```bash
# This will be handled automatically when you run dev for the first time
pnpm dev
```

## Development

Start the development server:

```bash
pnpm dev
```

## Stack Details

### Nuxt UI Pro v3

- Latest version with Tailwind CSS v4 integration
- Premium components for rapid development
- Built-in dark mode support

### Pinia

- Composition API-based stores
- TypeScript support
- DevTools integration

### Prisma

- Type-safe database access
- Auto-generated client
- Migration management

## VS Code Setup

The project includes VS Code settings for optimal development experience:

- Tailwind CSS IntelliSense
- Nuxt UI Pro class attribute support
- Disabled Prettier (formatting handled by Tailwind CSS IntelliSense)

Install recommended extensions:

- Tailwind CSS IntelliSense
- Volar (Vue Language Features)
- TypeScript Vue Plugin (Volar)

Look at the [Nuxt 3 documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
