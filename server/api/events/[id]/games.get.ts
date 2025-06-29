import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')
  
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required'
    })
  }

  try {
    // Get all phases for the event
    const phases = await prisma.phase.findMany({
      where: { eventId },
      include: {
        games: {
          include: {
            players: {
              include: {
                user: {
                  select: {
                    id: true,
                    first: true,
                    last: true,
                    nickname: true
                  }
                }
              },
              orderBy: { position: 'asc' }
            },
            court: true,
            teams: {
              include: {
                players: {
                  include: {
                    user: {
                      select: {
                        id: true,
                        first: true,
                        last: true,
                        nickname: true
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Flatten all games from all phases
    const allGames = phases.flatMap(phase => 
      phase.games.map(game => ({
        ...game,
        phaseName: phase.name,
        phaseOrder: phase.order
      }))
    )

    return allGames
  } catch (error) {
    console.error('Error fetching games:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch games'
    })
  }
}) 