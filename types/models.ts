// User model matching backend
export interface User {
    id?: string | number
    email: string
    password?: string
    role?: string
    enabled?: boolean
    locked?: boolean
    createdAt?: string
    updatedAt?: string
    emailVerified?: boolean
}

// Company model matching backend
export interface Company extends User {
    companyName: string
    contactName?: string
    companySize?: string
    industry?: string
    website?: string
}

// SocialMedia model matching backend
export interface SocialMedia {
    id?: number
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string
}

// ContentCreator model matching backend
export interface ContentCreator extends User {
    firstName: string
    lastName: string
    username?: string
    contentType?: string
    bio?: string
    socialMedia?: SocialMedia
}

// PasswordResetToken model matching backend
export interface PasswordResetToken {
    id?: number
    token: string
    user: User
    expiryDate: string
}

