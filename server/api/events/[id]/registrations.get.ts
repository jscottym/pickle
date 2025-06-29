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
    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: {
        user: {
          select: {
            id: true,
            first: true,
            last: true,
            nickname: true,
            role: true
          }
        }
      },
      orderBy: [
        { confirmed: 'desc' }, // Confirmed first
        { createdAt: 'asc' }   // Then by registration time (for waitlist order)
      ]
    })

    return registrations
  } catch (error) {
    console.error('Error fetching registrations:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch registrations'
    })
  }
}) 