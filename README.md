# Pickle - Event Management App

A Nuxt.js application for managing pickle/sports events with Firebase phone authentication.

## Features

- 🔐 Firebase Phone Authentication with SMS verification
- 👥 User management with roles (Player, Organizer, Admin)
- 📱 Beautiful UI with Nuxt UI Pro components
- 🗄️ PostgreSQL database with Prisma ORM
- 🎯 PIN input verification using Nuxt UI Pro PinInput component

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Firebase project with Phone Authentication enabled

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up your environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in your Firebase and database configuration:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/pickle"

   # Firebase
   FIREBASE_API_KEY="your-api-key"
   FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_APP_ID="your-app-id"
   FIREBASE_STORAGE_BUCKET="your-project-id.appspot.com"
   FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
   ```

4. Set up the database:
   ```bash
   pnpm run db:setup
   ```

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Phone Authentication:
   - Go to Authentication > Sign-in method
   - Enable Phone authentication
   - Add your domain to authorized domains
3. **Set up test phone numbers for development**:
   - In Authentication > Sign-in method > Phone
   - Open "Phone numbers for testing" accordion
   - Add test numbers like `+1 650-555-3434` with verification code `123456`
4. Get your Firebase config from Project Settings > General

### Development

Start the development server:

```bash
pnpm run dev
```

Visit `http://localhost:3000`

#### Development Mode Features

The app automatically enables development mode when running `pnpm run dev`:

- **App verification disabled**: reCAPTCHA is automatically bypassed for testing
- **Test phone numbers**: Use fictional phone numbers for SMS-free testing
- **Automatic fake reCAPTCHA**: No need to solve CAPTCHA during development

#### Testing Phone Authentication

Use these test phone numbers in development:

- `+1 650-555-3434` with verification code `123456`
- `+1 555-123-4567` with verification code `654321`

**Note**: These must be configured in your Firebase Console under Authentication > Sign-in method > Phone numbers for testing.

## Authentication Flow

1. **Phone Input**: User enters their phone number
2. **SMS Verification**: Firebase sends SMS with 6-digit code
3. **PIN Input**: User enters verification code using Nuxt UI Pro PinInput
4. **User Creation**: System finds or creates user in database
5. **Profile Setup**: New users complete their profile information

## Phone Authentication Features

- ✅ E.164 phone number formatting
- ✅ SMS verification with 6-digit PIN input
- ✅ Resend verification code with timer
- ✅ Invisible reCAPTCHA with development mode bypass
- ✅ Error handling with user-friendly messages
- ✅ Automatic user creation/linking in database
- ✅ Auth state persistence
- ✅ Protected routes with middleware
- ✅ Test phone numbers for development

## Troubleshooting

### Debug Page

Visit `/debug-firebase` to check your Firebase configuration and test authentication components.

### Common Issues

1. **"Cannot read properties of undefined (reading 'appVerificationDisabledForTesting')"**

   - This should be automatically resolved in development mode
   - Check that your Firebase environment variables are set correctly

2. **SMS not received**

   - Use test phone numbers in development (see Firebase Console setup)
   - Ensure Phone authentication is enabled in Firebase Console
   - Check Firebase usage quotas

3. **reCAPTCHA errors**
   - Development mode automatically bypasses reCAPTCHA
   - Ensure your domain is added to Firebase authorized domains
   - Check browser console for additional error details

## Database Schema

The User model includes:

- `firebaseUserId`: Links to Firebase Auth user
- `phone`: E.164 formatted phone number
- `first`, `last`, `nickname`: User profile information
- `role`: PLAYER, ORGANIZER, or ADMIN
- `email`: Optional email address

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run db:setup` - Set up database with migrations and seed data
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:seed` - Seed database with sample data

## Tech Stack

- **Framework**: Nuxt 3
- **UI**: Nuxt UI Pro
- **Database**: PostgreSQL + Prisma
- **Authentication**: Firebase Auth (Phone)
- **Styling**: Tailwind CSS
- **State Management**: Pinia

## Project Structure

```
├── components/
│   ├── app/           # App-specific components
│   ├── layout/        # Layout components
│   ├── shared/        # Shared components
│   └── text/          # Typography components
├── composables/
│   └── useFirebaseAuth.ts  # Phone auth composable (renamed to avoid conflicts)
├── middleware/
│   ├── auth.ts        # Protected route middleware
│   └── guest.ts       # Guest-only middleware
├── pages/
│   ├── login.vue      # Phone auth login page
│   ├── profile/       # Profile pages
│   └── ...
├── server/api/auth/   # Authentication API endpoints
├── stores/            # Pinia stores
└── prisma/           # Database schema and migrations
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
