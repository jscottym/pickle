import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { first, last, nickname } = body

    // In a real app, you'd want to verify the user is authenticated
    // and get their user ID from the Firebase token
    // For now, we'll assume authentication is handled by middleware

    if (!first || !last) {
      throw createError({
        statusCode: 400,
        statusMessage: 'First and last names are required'
      })
    }

    // For now, we'll get the user from the request
    // In production, you'd verify the Firebase token
    const { firebaseUserId: userFirebaseId } = body

    if (!userFirebaseId) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    const user = await prisma.user.update({
      where: { firebaseUserId: userFirebaseId },
      data: {
        first,
        last,
        nickname: nickname || null,
        updatedAt: new Date()
      }
    })

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
    console.error('Error updating user profile:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update profile'
    })
  }
}) 