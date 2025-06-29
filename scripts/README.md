# Scripts

This directory contains utility scripts for managing the application.

## Quick Setup

To set up the entire database with sample data:

```bash
# Install dependencies
pnpm install

# Set up database, formats, and seed data
pnpm run db:setup
```

This will:

1. Create/run database migrations
2. Create the doubles moneyball event format
3. Seed the database with sample users, events, and registrations

## Individual Scripts

### Database Scripts

```bash
# Generate Prisma client after schema changes
pnpm run db:generate

# Create and run database migrations
pnpm run db:migrate

# Seed database with sample data
pnpm run db:seed

# Complete setup (migrate + formats + seed)
pnpm run db:setup
```

### Create Event Formats

```bash
# Create the doubles moneyball format
pnpm run create-formats
```

## Sample Data Created

The seed script creates:

### Users

- **Scott Martinau** (Admin) - Phone: +14804441111
- **Sarah Johnson** (Organizer) - Phone: +14805551001
- **Mike Chen** (Organizer) - Phone: +14805551002
- **16+ Players** with various phone numbers

### Events

1. **Upcoming Event** - "Weekend Doubles Moneyball Tournament" (next week)
   - 16 confirmed players, 3 on waitlist
   - Status: PLANNED
2. **Active Event** - "Today's Doubles Tournament" (in progress)
   - Currently running with sample games
   - Status: ACTIVE
3. **Past Event** - "Last Week's Doubles Championship" (finished)
   - Completed tournament with results
   - Status: FINISHED

### Location & Courts

- **Desert Ridge Sports Complex** with 4 courts
- Sample address and Google location ID

### Features Demonstrated

- ✅ **Registration system** with confirmed/waitlist logic
- ✅ **RSVP functionality** (IN/MAYBE/OUT status)
- ✅ **Event management** permissions
- ✅ **Game scheduling** and scoring
- ✅ **Multi-phase tournaments**
- ✅ **Flexible event formats**

## Event Format: Doubles Moneyball Round Robin

**Structure:**

- 16 players (8 teams of 2)
- Phase 1: Random partner assignment + Round Robin
- Phase 2: Single elimination bracket
- Games to 11 points straight up

**Configuration includes:**

- Team structure and player counts
- Phase definitions with seeding strategies
- Scoring rules and advancement criteria
- Tournament format specifications

## Testing the Application

After running the seed script, you can:

1. **Browse Events** - Visit `/events` to see all event states
2. **View Event Details** - Click any event to see registration info
3. **RSVP** - Register for upcoming events (mock authentication)
4. **Manage Games** - Access game management for active events
5. **Score Games** - Enter scores for in-progress games

## Authentication Note

The current implementation uses mock authentication for testing. In production, this would integrate with Firebase Auth using the `firebaseUserId` field in the User model.
