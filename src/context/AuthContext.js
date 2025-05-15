"use client"

import { createContext, useState, useEffect } from "react"
import { api } from "../api/api"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("authToken")

        if (token) {
          // Set the token in axios headers
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`

          // Fetch user data
          const response = await api.get("/user/profile")
          setCurrentUser(response.data)
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        // Clear invalid token
        localStorage.removeItem("authToken")
        api.defaults.headers.common["Authorization"] = ""
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  // Login function
  const login = async (email, password) => {
    try {
      setError(null)
      const response = await api.post("/auth/login", { email, password })
      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("authToken", token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Update state
      setCurrentUser(user)

      return user
    } catch (error) {
      setError(error.response?.data?.message || "Login failed")
      throw error
    }
  }

  // Register function
  const register = async (email, password) => {
    try {
      setError(null)
      const response = await api.post("/auth/register", { email, password })
      const { token, user } = response.data

      // Save token to localStorage
      localStorage.setItem("authToken", token)

      // Set token in axios headers
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`

      // Update state
      setCurrentUser(user)

      return user
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed")
      throw error
    }
  }

  // Logout function
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("authToken")

    // Remove token from axios headers
    api.defaults.headers.common["Authorization"] = ""

    // Update state
    setCurrentUser(null)
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setError(null)
      const response = await api.put("/user/profile", userData)
      setCurrentUser(response.data)
      return response.data
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update profile")
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
