export type UserRole = 'manager' | 'worker' | 'personal'

export type RegisterPayload = {
    username: string
    email: string
    password: string
    role: UserRole
    phone_number?: string
}

export type LoginPayload = {
    email: string //since oauth2 uses username and password in formdata email = username
    password: string
}

export type TokenResponse = {
    access_token: string
    token_type: string
}

export type UserProfile = {
    id: number
    username: string
    email: string
    role: UserRole
    phone_number: string | null
    company_domain: string |null
    created_at: string
}