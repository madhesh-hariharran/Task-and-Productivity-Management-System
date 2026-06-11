import axios from 'axios'
import { getToken,removeToken } from '../utils/token'

const client = axios.create({
    baseURL: 'http://127.0.0.1:8000',
})

client.interceptors.request.use((config) => {
    const token = getToken()

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

client.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config?.url?.includes('/auth/login')

        if (error.response?.status === 401 && !isLoginRequest) {
            removeToken()
            window.location.href = "/login"
        }
        return Promise.reject(error)
    }
)

export default client