import { createContext, useContext, useState, useEffect } from 'react'
import { authApi, setAuthToken } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setAuthToken(token)
      authApi.me()
        .then(res => setUser(res.data.user))
        .catch(() => {
          localStorage.removeItem('token')
          setAuthToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const signup = async (name, email, password) => {
    const res = await authApi.signup({ name, email, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
    return user
  }

  const login = async (email, password) => {
    const res = await authApi.login({ email, password })
    const { token, user } = res.data
    localStorage.setItem('token', token)
    setAuthToken(token)
    setUser(user)
    return user
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
