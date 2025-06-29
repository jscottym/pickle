import prisma from '../lib/prisma'

const doublesMoneyballFormat = {
  name: "Doubles Moneyball Round Robin",
  playerCounts: [16], // 8 teams × 2 players each
  description: "8-team doubles format with random partner assignment, round robin, then single elimination",
  config: {
    teams: 8,
    playersPerTeam: 2,
    partnerAssignment: "random", // Partners randomly assigned each phase
    phases: [
      {
        order: 1,
        name: "Round Robin",
        type: "round_robin",
        seedingStrategy: "RANDOM",
        partnerAssignment: "random",
        matchups: {
          type: "all_play_all", // Each team plays every other team once
          expectedGames: 28 // 8 teams choose 2 = 28 total games
        },
        scoring: {
          gameType: "straight_up",
          pointsToWin: 11,
          winBy: 1, // Win by 1 (straight up)
          trackStats: ["wins", "losses", "points_for", "points_against", "point_differential"]
        },
        advancement: {
          allAdvance: true,
          seedingCriteria: ["wins", "point_differential", "points_for"] // Tiebreaker order
        }
      },
      {
        order: 2,
        name: "Single Elimination",
        type: "single_elimination",
        seedingStrategy: "PREVIOUS_PHASE",
        partnerAssignment: "keep_pairs", // Keep same partners from phase 1
        bracket: {
          size: 8,
          rounds: 3, // Quarterfinals, Semifinals, Finals
          thirdPlace: false
        },
        scoring: {
          gameType: "straight_up", 
          pointsToWin: 11,
          winBy: 1,
          trackStats: ["wins", "losses", "points_for", "points_against"]
        }
      }
    ],
    rules: [
      "Partners are randomly assigned at the start of Phase 1",
      "Round Robin: All teams play each other once",
      "Games are played to 11 points straight up (win by 1)",
      "Phase 2 seeding based on: (1) Wins, (2) Point differential, (3) Points scored",
      "Same partners continue to Phase 2",
      "Single elimination bracket with 8 teams",
      "Championship and consolation games to 11 straight up"
    ]
  }
}

async function createDoublesMoneyballFormat() {
  try {
    console.log('Creating Doubles Moneyball Round Robin format...')
    
    // Check if format already exists
    const existingFormat = await prisma.eventFormat.findFirst({
      where: { name: doublesMoneyballFormat.name }
    })
    
    if (existingFormat) {
      console.log('Format already exists. Updating...')
      const updatedFormat = await prisma.eventFormat.update({
        where: { id: existingFormat.id },
        data: doublesMoneyballFormat
      })
      console.log('Format updated:', updatedFormat.name)
      return updatedFormat
    } else {
      const newFormat = await prisma.eventFormat.create({
        data: doublesMoneyballFormat
      })
      console.log('Format created:', newFormat.name)
      return newFormat
    }
  } catch (error) {
    console.error('Error creating format:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the script if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createDoublesMoneyballFormat()
    .then(() => {
      console.log('✅ Doubles Moneyball format creation completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ Error:', error)
      process.exit(1)
    })
}

export { createDoublesMoneyballFormat, doublesMoneyballFormat }
