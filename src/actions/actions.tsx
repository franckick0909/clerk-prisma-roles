"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import CryptoJS from "crypto-js";

const encryptSecret = (text: string) => {
  return CryptoJS.AES.encrypt(text, process.env.ENCRYPTION_KEY!).toString();
};

const decryptSecret = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY!);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export async function createSecret(content: string) {
  try {
    // on récupère l'utilisateur connecté
    const user = await currentUser();
    // on vérifie si l'utilisateur existe
    if (!user?.id) {
      throw new Error("Utilisateur non autorisé");
    }
    // on chiffre le contenu avant de le stocker
    const encryptedContent = encryptSecret(content);
    // on crée ou met à jour le secret dans la base de données
    await prisma.secret.upsert({
      where: { id: user.id },
      update: { content: encryptedContent }, //  Recherche par userId
      create: { id: user.id, content: encryptedContent, user: { connect: { id: user.id } } }, // Si trouvé, met à jour
    });
    // on retourne un message de succès
    return { success: true, message: "Secret créé avec succès" };
  } catch (error) {
    // En cas d'erreur, on retourne un message d'erreur
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Une erreur inconnue s'est produite",
    };
  }
}

export async function getSecret() {
    try {
        const user = await currentUser();

        if (!user?.id) {
            throw new Error("Utilisateur non autorisé");
        }

        const secret = await prisma.secret.findUnique({
            where: { id: user.id }
        });

        // Déchiffre le contenu si un secret existe, sinon renvoie une chaine vide
        const decryptedContent = secret ? decryptSecret(secret.content) : "";
        return { success: true, content: decryptedContent }

    } catch (error) {
        // En cas d'erreur, on retourne un message d'erreur
        return { success: false, error: error instanceof Error ? error.message : "Une erreur inconnue s'est produite" };
    }
}
