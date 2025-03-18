// Aktualisierte Typdefinitionen für die Authentifizierung

// Benutzerrolle als Enum
export enum UserRole {
    COMPANY = "COMPANY",
    CONTENT_CREATOR = "CONTENT_CREATOR",
    ADMIN = "ADMIN",
}

// Benutzer-Interface
export interface User {
    id: string
    email: string
    firstName?: string
    lastName?: string
    role?: UserRole | string // Erlaubt sowohl Enum als auch String
    enabled: boolean
    createdAt: string
    updatedAt?: string
    companyName?: string
    companySize?: string
    contactName?: string
    industry?: string
    website?: string
}

// Login-Anfrage
export interface LoginRequest {
    email: string
    password: string
    rememberMe?: boolean
    role?: UserRole | string // Hinzugefügt für explizite Rollenangabe
    isContentCreator?: boolean // Hinzugefügt für explizites Content-Creator-Flag
}

// Registrierungs-Anfrage
export interface RegistrationRequest {
    email: string
    password: string
    firstName: string
    lastName: string
    companyName?: string
    companySize?: string
    contactName?: string
    industry?: string
    website?: string
    role?: UserRole | string
    userType?: string
    isContentCreator?: boolean
}

// Passwort-Reset-Anfrage
export interface PasswordResetRequest {
    token: string
    password: string
    confirmPassword: string
}

// Authentifizierungs-Antwort
export interface AuthResponse {
    success: boolean
    message?: string
    data?: {
        token?: string
        user?: User
        redirectTo?: string
    }
    timestamp?: string
}

