import { SignInButton, SignUpButton, SignOutButton } from "@clerk/nextjs";
import { SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import Link from "next/link";

export default async function Header() {
    const user = await currentUser();
    let userRole = "visiteur";
    
    if (user) {
        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });
        userRole = dbUser?.role || "member";
    }

    return (
        <header className="flex justify-between items-center p-4">
            <Link href="/">FK</Link>

            <ul className="flex gap-4">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/secret">Secret</Link></li>
                <li><Link href="/profile">Profile</Link></li>
                <li><Link href="/contact">Contact</Link></li>
            </ul>

            <SignedOut>
                <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                        <button type="button" className="text-white hover:bg-blue-600 bg-blue-500 px-4 py-2 rounded-md">
                            Se connecter
                        </button>
                    </SignInButton>
                    <SignUpButton mode="modal">
                        <button type="button" className="text-white hover:bg-blue-600 bg-blue-500 px-4 py-2 rounded-md">
                            S&apos;inscrire
                        </button>
                    </SignUpButton>
                </div>
            </SignedOut>

            <SignedIn>
                <div className="flex items-center gap-4">
                    <UserButton />
                    <span className={`px-2 py-1 rounded-md ${
                        userRole === "admin" 
                            ? "bg-violet-500 text-white" 
                            : "bg-sky-500 text-white"
                    }`}>
                        {userRole}
                    </span>
                    <SignOutButton>
                        <button type="button" className="text-white hover:bg-rose-600 bg-rose-500 px-4 py-2 rounded-md">
                            Déconnexion
                        </button>
                    </SignOutButton>
                </div>
            </SignedIn>
        </header>
    );
}
