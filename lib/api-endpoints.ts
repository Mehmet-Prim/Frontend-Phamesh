// API Endpoints für die Kommunikation mit dem Backend

// Basis-URL für API-Anfragen
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

// Auth Endpoints
export const AUTH_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER_COMPANY: `${API_BASE_URL}/auth/register/company`,
    REGISTER_CONTENT_CREATOR: `${API_BASE_URL}/auth/register/content_creator`,
    VERIFY_EMAIL: `${API_BASE_URL}/auth/verify-email`,
    VERIFY_EMAIL_CODE: `${API_BASE_URL}/auth/verify-email-code`,
    VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
    RESEND_VERIFICATION: `${API_BASE_URL}/auth/resend-verification`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    ME: `${API_BASE_URL}/auth/me`,
}

// Company Endpoints
export const COMPANY_ENDPOINTS = {
    PROFILE: `${API_BASE_URL}/company/profile`,
    DASHBOARD: `${API_BASE_URL}/company/dashboard`,
    UPDATE_PROFILE: `${API_BASE_URL}/company/profile`,
    SEARCH: `${API_BASE_URL}/company/search`,
    BY_INDUSTRY: `${API_BASE_URL}/company/industry`,
    ALL: `${API_BASE_URL}/company`,
}

// Content Creator Endpoints
export const CONTENT_CREATOR_ENDPOINTS = {
    PROFILE: `${API_BASE_URL}/content-creator/profile`,
    DASHBOARD: `${API_BASE_URL}/content-creator/dashboard`,
    UPDATE_PROFILE: `${API_BASE_URL}/content-creator/profile`,
    UPDATE_SOCIAL_MEDIA: `${API_BASE_URL}/content-creator/social-media`,
    SEARCH: `${API_BASE_URL}/content-creator/search`,
    BY_CONTENT_TYPE: `${API_BASE_URL}/content-creator/content-type`,
    FEATURED: `${API_BASE_URL}/content-creator/featured`,
    BY_SOCIAL_MEDIA: `${API_BASE_URL}/content-creator/social-media`,
    ALL: `${API_BASE_URL}/content-creator`,
    RESEND_VERIFICATION: `${API_BASE_URL}/content-creator/resend-verification`,
    VERIFY_EMAIL_CODE: `${API_BASE_URL}/content-creator/verify-email-code`,
}

// Chat Endpoints
export const CHAT_ENDPOINTS = {
    CONVERSATIONS: `${API_BASE_URL}/chat/conversations`,
    MESSAGES: (conversationId: number) => `${API_BASE_URL}/chat/conversations/${conversationId}/messages`,
    SEND: `${API_BASE_URL}/chat/send`,
    MARK_READ: (conversationId: number) => `${API_BASE_URL}/chat/conversations/${conversationId}/read`,
    UNREAD_COUNT: `${API_BASE_URL}/chat/unread-count`,
}

// WebSocket Endpoints
export const WEBSOCKET_ENDPOINTS = {
    CONNECT: `${API_BASE_URL}/ws`,
    CHAT_TOPIC: (userId: number) => `/user/${userId}/queue/messages`,
    SEND_ENDPOINT: "/app/chat.sendMessage",
}

