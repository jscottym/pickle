import prisma from '../lib/prisma'
import { doublesMoneyballFormat } from './create-doubles-moneyball-format'

// Sample user data
const sampleUsers = [
  {
    firebaseUserId: 'scott-martinau-firebase-id',
    phone: '+14804441111',
    first: 'Scott',
    last: 'Martinau',
    nickname: 'ScottM',
    email: 'scott@example.com',
    role: 'ADMIN' as const
  },
  {
    firebaseUserId: 'organizer-1-firebase-id',
    phone: '+14805551001',
    first: 'Sarah',
    last: 'Johnson',
    nickname: 'SarahJ',
    email: 'sarah@example.com',
    role: 'ORGANIZER' as const
  },
  {
    firebaseUserId: 'organizer-2-firebase-id',
    phone: '+14805551002',
    first: 'Mike',
    last: 'Chen',
    nickname: 'MikeC',
    email: 'mike@example.com',
    role: 'ORGANIZER' as const
  },
  // Players
  {
    firebaseUserId: 'player-1-firebase-id',
    phone: '+14805552001',
    first: 'Alex',
    last: 'Rodriguez',
    nickname: 'A-Rod',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-2-firebase-id',
    phone: '+14805552002',
    first: 'Emma',
    last: 'Wilson',
    nickname: 'Em',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-3-firebase-id',
    phone: '+14805552003',
    first: 'James',
    last: 'Brown',
    nickname: 'JB',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-4-firebase-id',
    phone: '+14805552004',
    first: 'Lisa',
    last: 'Davis',
    nickname: 'LisaD',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-5-firebase-id',
    phone: '+14805552005',
    first: 'David',
    last: 'Miller',
    nickname: 'Dave',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-6-firebase-id',
    phone: '+14805552006',
    first: 'Rachel',
    last: 'Garcia',
    nickname: 'Rach',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-7-firebase-id',
    phone: '+14805552007',
    first: 'Tom',
    last: 'Anderson',
    nickname: 'Tommy',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-8-firebase-id',
    phone: '+14805552008',
    first: 'Kelly',
    last: 'Thompson',
    nickname: 'KT',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-9-firebase-id',
    phone: '+14805552009',
    first: 'Chris',
    last: 'Lee',
    nickname: 'ChrisL',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-10-firebase-id',
    phone: '+14805552010',
    first: 'Amanda',
    last: 'White',
    nickname: 'Mandy',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-11-firebase-id',
    phone: '+14805552011',
    first: 'Ryan',
    last: 'Taylor',
    nickname: 'RT',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-12-firebase-id',
    phone: '+14805552012',
    first: 'Jessica',
    last: 'Martinez',
    nickname: 'Jess',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-13-firebase-id',
    phone: '+14805552013',
    first: 'Kevin',
    last: 'Wilson',
    nickname: 'Kev',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-14-firebase-id',
    phone: '+14805552014',
    first: 'Nicole',
    last: 'Johnson',
    nickname: 'Nikki',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-15-firebase-id',
    phone: '+14805552015',
    first: 'Mark',
    last: 'Davis',
    nickname: 'MD',
    role: 'PLAYER' as const
  },
  // Extra players for waitlist testing
  {
    firebaseUserId: 'player-16-firebase-id',
    phone: '+14805552016',
    first: 'Lauren',
    last: 'Smith',
    nickname: 'LSmith',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-17-firebase-id',
    phone: '+14805552017',
    first: 'Jason',
    last: 'Brown',
    nickname: 'JBrown',
    role: 'PLAYER' as const
  },
  {
    firebaseUserId: 'player-18-firebase-id',
    phone: '+14805552018',
    first: 'Megan',
    last: 'Jones',
    nickname: 'Meg',
    role: 'PLAYER' as const
  }
]

// Sample location
const sampleLocation = {
  name: 'Desert Ridge Sports Complex',
  address: '21202 N Cave Creek Rd, Phoenix, AZ 85024',
  googleLocationId: 'ChIJ123456789'
}

// Sample courts
const sampleCourts = [
  { name: 'Court 1' },
  { name: 'Court 2' },
  { name: 'Court 3' },
  { name: 'Court 4' }
]

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    console.log('🧹 Cleaning existing data...')
    await prisma.registration.deleteMany()
    await prisma.phaseSeeding.deleteMany()
    await prisma.gamePlayer.deleteMany()
    await prisma.team.deleteMany()
    await prisma.game.deleteMany()
    await prisma.phase.deleteMany()
    await prisma.event.deleteMany()
    await prisma.court.deleteMany()
    await prisma.location.deleteMany()
    await prisma.eventFormat.deleteMany()
    await prisma.user.deleteMany()

    // Create users
    console.log('👥 Creating users...')
    const users = await Promise.all(
      sampleUsers.map(userData =>
        prisma.user.create({ data: userData })
      )
    )
    console.log(`Created ${users.length} users`)

    // Create location
    console.log('📍 Creating location...')
    const location = await prisma.location.create({
      data: sampleLocation
    })

    // Create courts
    console.log('🏟️ Creating courts...')
    const courts = await Promise.all(
      sampleCourts.map(courtData =>
        prisma.court.create({
          data: {
            ...courtData,
            locationId: location.id
          }
        })
      )
    )
    console.log(`Created ${courts.length} courts`)

    // Create event format
    console.log('📋 Creating event format...')
    const eventFormat = await prisma.eventFormat.create({
      data: doublesMoneyballFormat
    })

    // Find Scott (admin/organizer)
    const scott = users.find((u: any) => u.first === 'Scott')!
    const sarah = users.find((u: any) => u.first === 'Sarah')!

    // Create upcoming event
    console.log('🎾 Creating upcoming event...')
    const upcomingEvent = await prisma.event.create({
      data: {
        name: 'Weekend Doubles Moneyball Tournament',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 9 AM
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 PM
        minPlayers: 12,
        maxPlayers: 16,
        playersCanOrganize: false,
        status: 'PLANNED',
        organizerId: scott.id,
        locationId: location.id,
        eventFormatId: eventFormat.id
      }
    })

    // Add Sarah as event manager
    await prisma.event.update({
      where: { id: upcomingEvent.id },
      data: {
        managers: {
          connect: { id: sarah.id }
        }
      }
    })

    // Create registrations - first 16 confirmed, rest waitlisted
    console.log('📝 Creating registrations...')
    const playersAndScott = [scott, ...users.filter((u: any) => u.role === 'PLAYER')]
    
    for (let i = 0; i < playersAndScott.length; i++) {
      const user = playersAndScott[i]
      const isConfirmed = i < 16 // First 16 are confirmed
      const status = Math.random() > 0.1 ? 'IN' : (Math.random() > 0.5 ? 'MAYBE' : 'OUT')
      
      await prisma.registration.create({
        data: {
          eventId: upcomingEvent.id,
          userId: user.id,
          status: status as any,
          confirmed: isConfirmed && status === 'IN'
        }
      })
    }

    // Create past event with results
    console.log('🏆 Creating past event with results...')
    const pastEvent = await prisma.event.create({
      data: {
        name: 'Last Week\'s Doubles Championship',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last week
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000),
        minPlayers: 12,
        maxPlayers: 16,
        status: 'FINISHED',
        organizerId: sarah.id,
        locationId: location.id,
        eventFormatId: eventFormat.id
      }
    })

    // Create phases for past event
    const roundRobinPhase = await prisma.phase.create({
      data: {
        eventId: pastEvent.id,
        name: 'Round Robin',
        order: 1,
        seedingStrategy: 'RANDOM',
        status: 'FINISHED'
      }
    })

    const eliminationPhase = await prisma.phase.create({
      data: {
        eventId: pastEvent.id,
        name: 'Single Elimination',
        order: 2,
        seedingStrategy: 'PREVIOUS_PHASE',
        status: 'FINISHED'
      }
    })

    // Add some sample registrations for past event
    const pastEventPlayers = users.slice(0, 16) // First 16 users
    for (const user of pastEventPlayers) {
      await prisma.registration.create({
        data: {
          eventId: pastEvent.id,
          userId: user.id,
          status: 'IN',
          confirmed: true
        }
      })
    }

    // Create active event (in progress)
    console.log('⚡ Creating active event...')
    const activeEvent = await prisma.event.create({
      data: {
        name: 'Today\'s Doubles Tournament',
        date: new Date(), // Today
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
        endTime: new Date(Date.now() + 6 * 60 * 60 * 1000), // Ends in 6 hours
        minPlayers: 12,
        maxPlayers: 16,
        status: 'ACTIVE',
        organizerId: scott.id,
        locationId: location.id,
        eventFormatId: eventFormat.id
      }
    })

    // Create phases for active event
    const activeRoundRobin = await prisma.phase.create({
      data: {
        eventId: activeEvent.id,
        name: 'Round Robin',
        order: 1,
        seedingStrategy: 'RANDOM',
        status: 'ACTIVE'
      }
    })

    await prisma.phase.create({
      data: {
        eventId: activeEvent.id,
        name: 'Single Elimination',
        order: 2,
        seedingStrategy: 'PREVIOUS_PHASE',
        status: 'PLANNED'
      }
    })

    // Add registrations for active event
    const activeEventPlayers = users.slice(2, 18) // Different mix of users
    for (const user of activeEventPlayers) {
      await prisma.registration.create({
        data: {
          eventId: activeEvent.id,
          userId: user.id,
          status: 'IN',
          confirmed: true
        }
      })
    }

    // Create some sample games for the active event
    console.log('🎮 Creating sample games...')
    const sampleGame = await prisma.game.create({
      data: {
        phaseId: activeRoundRobin.id,
        courtId: courts[0].id,
        name: 'Round Robin Game 1',
        status: 'IN_PROGRESS',
        startTime: new Date(Date.now() - 30 * 60 * 1000) // Started 30 min ago
      }
    })

    // Add players to the game
    await prisma.gamePlayer.createMany({
      data: [
        { gameId: sampleGame.id, userId: activeEventPlayers[0].id, position: 1 },
        { gameId: sampleGame.id, userId: activeEventPlayers[1].id, position: 2 },
        { gameId: sampleGame.id, userId: activeEventPlayers[2].id, position: 3 },
        { gameId: sampleGame.id, userId: activeEventPlayers[3].id, position: 4 }
      ]
    })

    console.log('✅ Database seeded successfully!')
    console.log(`
    📊 Summary:
    - ${users.length} users created (including Scott as admin)
    - 1 location with ${courts.length} courts
    - 1 event format (Doubles Moneyball)
    - 3 events: 1 upcoming, 1 past (finished), 1 active (in progress)
    - Multiple registrations with confirmed/waitlist scenarios
    - Sample games and phases for testing
    
    🔑 Key Users:
    - Scott Martinau (Admin): ${scott.phone}
    - Sarah Johnson (Organizer): ${sarah.phone}
    `)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('🎉 Seeding completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error)
      process.exit(1)
    })
}

export { seedDatabase }
