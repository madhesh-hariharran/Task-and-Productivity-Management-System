import { useContext } from 'react'
import { AuthContext } from './AuthContext'
import type { AuthContextType } from '../types/auth'

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext)
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider")      //to check if useAuth is used only in a component which is a child of AuthProvider
    }
    return ctx
}