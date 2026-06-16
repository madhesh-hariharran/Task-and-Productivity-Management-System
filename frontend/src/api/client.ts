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
        const isAuthRequest = error.config?.url?.includes('/auth/')

        if (error.response?.status === 401 && !isAuthRequest) {
            // Remove token from storage, then fire a custom event so AuthContext
            // can clear its state without needing to be imported here
            // (importing context here would create a circular dependency)
            removeToken()
            window.dispatchEvent(new Event('auth:logout'))
        }
        return Promise.reject(error)
    }
)

export default client