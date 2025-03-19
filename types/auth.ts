export enum UserRole {
    COMPANY = "COMPANY",
    CONTENT_CREATOR = "CONTENT_CREATOR",
}

export interface LoginRequest {
    email: string
    password: string
    rememberMe?: boolean
    role?: string
    isCompany?: boolean
    isContentCreator?: boolean
}

export interface LoginResponse {
    token: string
    user: {
        id: string
        email: string
        role: string
        [key: string]: any
    }
}

export interface RegistrationRequest {
    email: string
    password: string
    firstName?: string
    lastName?: string
    companyName?: string
    contactName?: string
    companySize?: string
    industry?: string
    website?: string
    username?: string
    contentType?: string
    bio?: string
    socialMedia?: {
        instagram?: string
        youtube?: string
        tiktok?: string
        twitter?: string
    }
    termsAgreed: boolean
    role?: string
    userType?: string
    isCompany?: boolean
    isContentCreator?: boolean
}

export interface RegistrationResponse {
    success: boolean
    message?: string
}

export interface PasswordResetRequest {
    token: string
    password: string
    confirmPassword: string
    email?: string
}

export interface VerifyEmailRequest {
    email: string
    code: string
}

export interface AuthState {
    user: any | null
    isAuthenticated: boolean
    loading: boolean
    error: string | null
}

