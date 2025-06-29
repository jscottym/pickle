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
    const eventData = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        location: {
          include: {
            courts: true
          }
        },
        eventFormat: true,
        organizer: {
          select: {
            id: true,
            first: true,
            last: true,
            nickname: true,
            role: true
          }
        },
        managers: {
          select: {
            id: true,
            first: true,
            last: true,
            nickname: true,
            role: true
          }
        },
        phases: {
          orderBy: { order: 'asc' },
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
                  }
                },
                court: true
              }
            }
          }
        },
        _count: {
          select: {
            registrations: {
              where: {
                status: 'IN',
                confirmed: true
              }
            }
          }
        }
      }
    })

    if (!eventData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Event not found'
      })
    }

    return eventData
  } catch (error) {
    console.error('Error fetching event:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch event'
    })
  }
}) 