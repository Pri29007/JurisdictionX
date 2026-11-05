import { createContext, useContext, useState } from 'react'

// Demo auth: role switching only. Swap for Cognito (Person 2) later.
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [role, setRoleState] = useState(() => localStorage.getItem('jx-role') || 'citizen')
  const setRole = (r) => {
    localStorage.setItem('jx-role', r)
    setRoleState(r)
  }
  return <AuthContext.Provider value={{ role, setRole }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
export const HOME = { citizen: '/citizen', department: '/department', admin: '/admin' }
