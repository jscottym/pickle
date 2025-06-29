import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { firebaseUserId, phone, email } = body

    if (!firebaseUserId || !phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'firebaseUserId and phone are required'
      })
    }

    // Try to find existing user by Firebase ID
    let user = await prisma.user.findUnique({
      where: { firebaseUserId }
    })

    if (!user) {
      // Try to find by phone number (in case user exists but wasn't linked to Firebase)
      user = await prisma.user.findUnique({
        where: { phone }
      })

      if (user) {
        // Link existing user to Firebase
        user = await prisma.user.update({
          where: { id: user.id },
          data: { 
            firebaseUserId,
            email: email || user.email,
            updatedAt: new Date()
          }
        })
      } else {
        // Create new user - we'll need to prompt for first/last name
        // For now, create with placeholder data that can be updated later
        user = await prisma.user.create({
          data: {
            firebaseUserId,
            phone,
            email,
            first: 'New',
            last: 'User',
            nickname: null,
            role: 'PLAYER'
          }
        })
      }
    }

    // Return user data (excluding sensitive fields)
    return {
      id: user.id,
      firebaseUserId: user.firebaseUserId,
      first: user.first,
      last: user.last,
      nickname: user.nickname,
      phone: user.phone,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }
  } catch (error) {
    console.error('Error in user authentication:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to authenticate user'
    })
  }
}) 