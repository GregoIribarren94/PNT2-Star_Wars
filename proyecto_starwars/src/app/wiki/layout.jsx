'use client'
import ProtectedRoute from '../contexts/ProtectedRoute'

export default function WikiLayout({ children }) {
  return (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  )
}