import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        location: {
          select: {
            id: true,
            name: true,
            address: true
          }
        },
        eventFormat: {
          select: {
            id: true,
            name: true,
            description: true
          }
        },
        organizer: {
          select: {
            id: true,
            first: true,
            last: true,
            nickname: true
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
      },
      orderBy: [
        { date: 'desc' },
        { startTime: 'desc' }
      ]
    })

    return events
  } catch (error) {
    console.error('Error fetching events:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch events'
    })
  }
}) 