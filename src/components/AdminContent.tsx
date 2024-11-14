"use client"

import { useEffect, useState } from "react"
import { checkAdminStatus } from "@/actions/adminActions"

export default function AdminContent({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const status = await checkAdminStatus()
        setIsAdmin(status)
      } catch (error) {
        console.error("Erreur de vérification admin:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }
    
    checkAdmin()
  }, [])

  if (loading) {
    return <div className="animate-pulse">Chargement...</div>
  }

  if (!isAdmin) return null
  
  return <>{children}</>
} 