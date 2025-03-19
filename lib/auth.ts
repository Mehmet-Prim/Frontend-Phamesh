import { jwtDecode } from "jwt-decode"

interface User {
    sub: string // email
    exp: number
    role: string
}

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
}

export const isAuthenticated = (): boolean => {
    const token = getToken()
    if (!token) return false

    try {
        const decoded = jwtDecode<User>(token)
        const currentTime = Date.now() / 1000

        return decoded.exp > currentTime
    } catch (error) {
        return false
    }
}

export const getUserRole = (): string | null => {
    const token = getToken()
    if (!token) return null

    try {
        const decoded = jwtDecode<User>(token)
        return decoded.role
    } catch (error) {
        return null
    }
}

export const getUserEmail = (): string | null => {
    const token = getToken()
    if (!token) return null

    try {
        const decoded = jwtDecode<User>(token)
        return decoded.sub
    } catch (error) {
        return null
    }
}

export const logout = () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

