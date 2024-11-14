import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { User } from "@prisma/client";

export async function initUser(): Promise<User | null> {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Chercher ou créer l'utilisateur dans notre base de données
  const user = await prisma.user.upsert({
    where: { id: clerkUser.id },
    update: {},
    create: {
      id: clerkUser.id,
      role: "member", // Par défaut, tous les nouveaux utilisateurs sont des membres
    },
  });

  return user;
}

export async function isAdmin(): Promise<boolean> {
  const user = await initUser();
  return user?.role === "admin";
} 