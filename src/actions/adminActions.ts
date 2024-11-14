"use server"

import { currentUser } from "@clerk/nextjs/server"
import prisma from "@/lib/db"
import { revalidatePath } from "next/cache"

interface UserResponse {
  id: string
  role: string
  createdAt: string
  email: string | null
  username: string | null
  imageUrl: string | null
  firstName: string | null
  lastName: string | null
}

type PrismaUserResult = {
  id: string
  role: string
  createdAt: Date
}

type ClerkUser = {
  id: string
  email_addresses: Array<{ email_address: string }>
  username: string | null
  image_url: string | null
  first_name: string | null
  last_name: string | null
}

export async function getUsers(): Promise<UserResponse[]> {
  try {
    const user = await currentUser()
    if (!user) throw new Error("Non authentifié")

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    if (dbUser?.role !== "admin") throw new Error("Non autorisé")

    const result = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        role: true,
        createdAt: true
      }
    }) as PrismaUserResult[]

    // Récupération des utilisateurs Clerk
    const response = await fetch(
      'https://api.clerk.com/v1/users',
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs Clerk')
    }

    const clerkUsers = await response.json() as ClerkUser[]

    return result.map(prismaUser => {
      const clerkUserInfo = clerkUsers.find(clerkUser => clerkUser.id === prismaUser.id)
      
      return {
        id: prismaUser.id,
        role: prismaUser.role,
        createdAt: prismaUser.createdAt.toISOString(),
        email: clerkUserInfo?.email_addresses[0]?.email_address || null,
        username: clerkUserInfo?.username || null,
        imageUrl: clerkUserInfo?.image_url || null,
        firstName: clerkUserInfo?.first_name || null,
        lastName: clerkUserInfo?.last_name || null
      }
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error)
    throw error
  }
}

export async function deleteUser(userId: string): Promise<{ success: boolean }> {
  try {
    const user = await currentUser()
    if (!user) throw new Error("Non authentifié")

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    if (dbUser?.role !== "admin") throw new Error("Non autorisé")

    if (userId === user.id) {
      throw new Error("Vous ne pouvez pas supprimer votre propre compte")
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath('/secret')
    
    return { success: true }
  } catch (error) {
    console.error("Erreur lors de la suppression:", error)
    throw new Error(error instanceof Error ? error.message : "Erreur lors de la suppression")
  }
}

export async function checkAdminStatus(): Promise<boolean> {
  try {
    const user = await currentUser()
    if (!user) return false

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id }
    })

    return dbUser?.role === "admin"
    
  } catch (error) {
    console.error("Erreur lors de la vérification du statut admin:", error)
    return false
  }
} 