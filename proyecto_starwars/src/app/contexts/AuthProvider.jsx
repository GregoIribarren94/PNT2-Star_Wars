'use client'
import { useRouter } from 'next/navigation'
import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // 🔹 Verifica si hay sesión guardada al cargar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const userStorage = localStorage.getItem("user")
      const isAuthStorage = localStorage.getItem("isAuthenticated")
      if (userStorage && isAuthStorage === "true") {
        setUser(JSON.parse(userStorage))
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
  }, [])

  // 🔐 LOGIN
  const login = async (userData) => {
    try {
      setLoading(true)
      const resp = await fetch("https://690b87c26ad3beba00f55bf7.mockapi.io/users")
      const data = await resp.json()
      const userFind = data.find(
        u => u.email === userData.email && u.password === userData.password
      )

      if (userFind) {
        setUser(userFind)
        setIsAuthenticated(true)
        localStorage.setItem("user", JSON.stringify(userFind))
        localStorage.setItem("isAuthenticated", "true")
        router.push("/")
      } else {
        alert("❌ Usuario o contraseña incorrectos")
      }
    } catch (error) {
      console.error("Error en login:", error)
      alert("Error al conectar con el servidor")
    } finally {
      setLoading(false)
    }
  }

  // 🆕 REGISTER
  const register = async (newUser) => {
    try {
      setLoading(true)
      const resp = await fetch("https://690b87c26ad3beba00f55bf7.mockapi.io/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })

      if (!resp.ok) throw new Error("Error al registrar el usuario")

      const data = await resp.json()
      setUser(data)
      setIsAuthenticated(true)
      localStorage.setItem("user", JSON.stringify(data))
      localStorage.setItem("isAuthenticated", "true")
      router.push("/")
    } catch (error) {
      console.error("Error en registro:", error)
      alert("No se pudo registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  // 🚪 LOGOUT
  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("isAuthenticated")
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
