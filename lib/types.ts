// Update the types to match the backend models
export enum UserRole {
    COMPANY = "COMPANY",
    CONTENT_CREATOR = "CONTENT_CREATOR",
}

export enum MessageStatus {
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    READ = "READ",
}

export interface User {
    id: number
    email: string
    role: UserRole | string
    enabled: boolean
    createdAt: string
    updatedAt: string
}

export interface Company extends User {
    companyName: string
    contactName: string
    companySize: string
    industry: string
    website: string
}

export interface ContentCreator extends User {
    firstName: string
    lastName: string
    username: string
    contentType: string
    bio: string
    socialMedia: SocialMedia
}

export interface SocialMedia {
    id: number
    instagram: string
    youtube: string
    tiktok: string
    twitter: string
}

// Authentication DTOs
export interface LoginRequest {
    email: string
    password: string
    rememberMe: boolean
}

export interface LoginResponse {
    token: string
    user: User
}

export interface RegistrationRequest {
    // Common fields
    email: string
    password: string

    // Company fields
    companyName?: string
    contactName?: string
    companySize?: string
    industry?: string
    website?: string

    // Content Creator fields
    firstName?: string
    lastName?: string
    username?: string
    contentType?: string
    bio?: string

    // Social Media
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string

    // Terms agreement
    termsAgreed: boolean
}

export interface ForgotPasswordRequest {
    email: string
    role: UserRole | string
}

export interface PasswordResetRequest {
    email: string
    token: string
    password: string
    confirmPassword: string
}

export interface VerifyEmailRequest {
    email: string
    code: string
}

// Füge eine neue Schnittstelle für die Token-Verifizierung hinzu
export interface VerifyEmailTokenRequest {
    token: string
}

export interface VerifyOtpRequest {
    code: string
}

// Messaging DTOs
export interface Conversation {
    id: number
    company: Company
    contentCreator: ContentCreator
    lastMessage: string
    updatedAt: string
    unreadCompany: number
    unreadCreator: number
}

export interface ConversationDto {
    id: number
    companyId: number
    companyName: string
    contentCreatorId: number
    contentCreatorName: string
    lastMessage: string
    lastMessageTime: string
    unreadCount: number
}

export interface Message {
    id: number
    conversation: Conversation
    sender: User
    content: string
    sentAt: string
    deliveredAt: string | null
    readAt: string | null
    status: MessageStatus
}

export interface ChatMessageDto {
    id: number
    conversationId: number
    senderId: number
    senderName: string
    senderRole: string
    content: string
    sentAt: string
    status: string
}

export interface SendMessageRequest {
    recipientId: number
    content: string
}

// API Response wrapper
export interface ApiResponseWrapper<T> {
    success: boolean
    message: string
    data: T
    timestamp: string
}

