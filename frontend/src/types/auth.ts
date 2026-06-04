export type RegisterPayload = {
    username: string
    email: string
    password: string
}

export type LoginPayload = {
    email: string //since oauth2 uses username and password in formdata email = username
    password: string
}

export type TokenResponse = {
    access_token: string
    token_type: string
}