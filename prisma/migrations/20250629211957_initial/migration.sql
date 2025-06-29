-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PLAYER', 'ORGANIZER', 'ADMIN');

-- CreateEnum
CREATE TYPE "EventStatus" AS ENUM ('PLANNED', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RegistrationStatus" AS ENUM ('INVITED', 'MAYBE', 'OUT', 'IN', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "PhaseStatus" AS ENUM ('PLANNED', 'ACTIVE', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED', 'POSTPONED');

-- CreateEnum
CREATE TYPE "SeedingStrategy" AS ENUM ('RANDOM', 'PREVIOUS_PHASE', 'SEEDING_BUCKET', 'MANUAL', 'RATING_BASED', 'WINS_LOSSES');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "firebaseUserId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "first" TEXT NOT NULL,
    "last" TEXT NOT NULL,
    "nickname" TEXT,
    "email" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'PLAYER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "googleLocationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courts" (
    "id" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_formats" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "playerCounts" JSONB NOT NULL,
    "config" JSONB NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_formats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "shareKey" TEXT NOT NULL,
    "minPlayers" INTEGER NOT NULL,
    "maxPlayers" INTEGER NOT NULL,
    "playersCanOrganize" BOOLEAN NOT NULL DEFAULT false,
    "status" "EventStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizerId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "eventFormatId" TEXT NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrations" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "RegistrationStatus" NOT NULL DEFAULT 'INVITED',
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phases" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "seedingStrategy" "SeedingStrategy" NOT NULL,
    "seedingConfig" JSONB,
    "status" "PhaseStatus" NOT NULL DEFAULT 'PLANNED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "phases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "phase_seeding" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "phase_seeding_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "games" (
    "id" TEXT NOT NULL,
    "phaseId" TEXT NOT NULL,
    "courtId" TEXT,
    "name" TEXT,
    "startTime" TIMESTAMP(3),
    "endTime" TIMESTAMP(3),
    "status" "GameStatus" NOT NULL DEFAULT 'SCHEDULED',
    "result" JSONB,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_players" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "position" INTEGER,

    CONSTRAINT "game_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "order" INTEGER,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeding_buckets" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "config" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seeding_buckets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeding_bucket_items" (
    "id" TEXT NOT NULL,
    "seedingBucketId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "seed" INTEGER NOT NULL,
    "rating" DOUBLE PRECISION,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,

    CONSTRAINT "seeding_bucket_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EventManager" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventManager_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebaseUserId_key" ON "users"("firebaseUserId");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "events_shareKey_key" ON "events"("shareKey");

-- CreateIndex
CREATE UNIQUE INDEX "registrations_eventId_userId_key" ON "registrations"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "phases_eventId_order_key" ON "phases"("eventId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "phase_seeding_phaseId_userId_key" ON "phase_seeding"("phaseId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "phase_seeding_phaseId_seed_key" ON "phase_seeding"("phaseId", "seed");

-- CreateIndex
CREATE UNIQUE INDEX "game_players_gameId_userId_key" ON "game_players"("gameId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "seeding_bucket_items_seedingBucketId_userId_key" ON "seeding_bucket_items"("seedingBucketId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "seeding_bucket_items_seedingBucketId_seed_key" ON "seeding_bucket_items"("seedingBucketId", "seed");

-- CreateIndex
CREATE INDEX "_EventManager_B_index" ON "_EventManager"("B");

-- AddForeignKey
ALTER TABLE "courts" ADD CONSTRAINT "courts_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_eventFormatId_fkey" FOREIGN KEY ("eventFormatId") REFERENCES "event_formats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phases" ADD CONSTRAINT "phases_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_seeding" ADD CONSTRAINT "phase_seeding_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phase_seeding" ADD CONSTRAINT "phase_seeding_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_phaseId_fkey" FOREIGN KEY ("phaseId") REFERENCES "phases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "games" ADD CONSTRAINT "games_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "courts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_players" ADD CONSTRAINT "game_players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "games"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeding_bucket_items" ADD CONSTRAINT "seeding_bucket_items_seedingBucketId_fkey" FOREIGN KEY ("seedingBucketId") REFERENCES "seeding_buckets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seeding_bucket_items" ADD CONSTRAINT "seeding_bucket_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventManager" ADD CONSTRAINT "_EventManager_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventManager" ADD CONSTRAINT "_EventManager_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
