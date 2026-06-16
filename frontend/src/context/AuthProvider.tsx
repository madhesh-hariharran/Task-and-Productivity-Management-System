import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile, UserRole } from "../types/auth"
import { AuthContext } from './AuthContext'
import { getCurrentUser } from "../api/auth"
import { getToken, removeToken } from "../utils/token"

export function AuthProvider({children}: {children: ReactNode}){
    const [user, setUser] = useState<UserProfile | null>(null)
    const [role, setRole] = useState<UserRole | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // On mount: if a token exists hydrate user+role from /auth/me
    // This handles page refresh — context is empty after refresh but token is in localStorage

    useEffect(() => {
        async function hydrate() {
            const token = getToken()
            if (!token){
                setIsLoading(false)
                return
            }
            try {
                const profile = await getCurrentUser()
                setUser(profile)
                setRole(profile.role)

            }
            catch {
                // token is invalid or expired, remove it
                removeToken()
            }
            finally {
                setIsLoading(false)
            }
        }
        hydrate()
    }, [])

    // Listen for the 401 event fired by api/client.ts when a token expires mid-session
    // Can't import clearAuth directly into client.ts — that would be a circular dependency
    useEffect(() => {
        function handleForcedLogout() {
            setUser(null)
            setRole(null)
        }
        window.addEventListener('auth:logout', handleForcedLogout)
        return () => window.removeEventListener('auth:logout', handleForcedLogout)
    }, [])

    function setAuth(profile: UserProfile) {
        setUser(profile)
        setRole(profile.role)
    }

    function clearAuth() {
        setUser(null)
        setRole(null)
        removeToken()
    }

    return (
        <AuthContext.Provider value={{user, role, isLoading, setAuth, clearAuth}}>
            {children}
        </AuthContext.Provider>
    )

}

