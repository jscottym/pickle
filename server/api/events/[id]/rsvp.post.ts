import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const eventId = getRouterParam(event, 'id')
  const body = await readBody(event)
  
  if (!eventId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Event ID is required'
    })
  }

  if (!body.status || !['IN', 'MAYBE', 'OUT'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Valid status is required (IN, MAYBE, OUT)'
    })
  }

  // TODO: Get user from authentication/session
  // For now, we'll use a mock user ID - in real app this would come from auth
  const userId = body.userId || 'scott-martinau-firebase-id' // Mock for testing

  try {
    // Get event details
    const eventData = await prisma.event.findUnique({
      where: { id: eventId },
      select: { 
        maxPlayers: true, 
        status: true,
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

    if (eventData.status !== 'PLANNED') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Cannot register for events that are not in planned status'
      })
    }

    const confirmedCount = eventData._count.registrations
    const availableSpots = eventData.maxPlayers - confirmedCount
    
    // Determine if user should be confirmed or waitlisted
    let confirmed = false
    if (body.status === 'IN') {
      confirmed = availableSpots > 0
    }

    // Create or update registration
    const registration = await prisma.registration.upsert({
      where: {
        eventId_userId: {
          eventId,
          userId
        }
      },
      update: {
        status: body.status,
        confirmed: body.status === 'IN' ? confirmed : false,
        updatedAt: new Date()
      },
      create: {
        eventId,
        userId,
        status: body.status,
        confirmed: body.status === 'IN' ? confirmed : false
      },
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
    })

    // If someone changed from IN to OUT, promote someone from waitlist
    if (body.status === 'OUT') {
      await promoteFromWaitlist(eventId, eventData.maxPlayers)
    }

    return {
      success: true,
      registration,
      message: confirmed 
        ? 'Successfully registered!' 
        : body.status === 'IN'
          ? 'Added to waitlist - you\'ll be notified if a spot opens up'
          : 'Registration updated'
    }
  } catch (error) {
    console.error('Error updating registration:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update registration'
    })
  }
})

// Helper function to promote someone from waitlist
async function promoteFromWaitlist(eventId: string, maxPlayers: number) {
  try {
    // Get current confirmed count
    const confirmedCount = await prisma.registration.count({
      where: {
        eventId,
        status: 'IN',
        confirmed: true
      }
    })

    const availableSpots = maxPlayers - confirmedCount

    if (availableSpots > 0) {
      // Find the first person on the waitlist (oldest registration)
      const waitlistPerson = await prisma.registration.findFirst({
        where: {
          eventId,
          status: 'IN',
          confirmed: false
        },
        orderBy: { createdAt: 'asc' }
      })

      if (waitlistPerson) {
        await prisma.registration.update({
          where: { id: waitlistPerson.id },
          data: { confirmed: true }
        })
        
        // TODO: Send notification to promoted user
        console.log(`Promoted user ${waitlistPerson.userId} from waitlist`)
      }
    }
  } catch (error) {
    console.error('Error promoting from waitlist:', error)
  }
} 