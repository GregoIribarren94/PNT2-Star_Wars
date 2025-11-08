"use client"

import { useAuth } from '../contexts/AuthProvider'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isAuthenticated, loading, router])

  if (loading) return <p>Cargando...</p>
  if (!isAuthenticated) return null
  
  return children
}