import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { isAdmin } from '@/lib/auth'

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/profile', '/secret'])
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
  
  if (isAdminRoute(req)) {
    await auth.protect()
    const isUserAdmin = await isAdmin()
    if (!isUserAdmin) {
      throw new Error('Accès non autorisé')
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}