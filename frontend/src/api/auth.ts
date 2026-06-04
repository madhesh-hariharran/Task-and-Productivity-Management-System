import client from "./client";
import type { RegisterPayload, LoginPayload } from "../types/auth";

export async function registerUser(userData: RegisterPayload){
    const response = await client.post('/auth/register', userData)
    return response.data
}

export async function loginUser(loginData: LoginPayload){
    const formData = new URLSearchParams()
    formData.append("username", loginData.email)
    formData.append("password", loginData.password)
    
    const response = await client.post('/auth/login', formData, {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    return response.data
}

export async function getCurrentUser() {
    const response = await client.get("/auth/me");
    return response.data;
}