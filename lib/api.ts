import { setCookie, getCookie, deleteCookie } from "./cookie-utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const API_PREFIX = "/api";

// Cookie names
const TOKEN_COOKIE = "auth_token";
const USER_ROLE_COOKIE = "user_role";
const USER_ROLE_RAW_COOKIE = "user_role_raw";
const USER_TYPE_COOKIE = "user_type";
const USER_IS_CONTENT_CREATOR = "user_is_content_creator";
const USER_IS_COMPANY = "user_is_company";

// Helper function to get storage value
const getStorageValue = (key: string): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem(key) || sessionStorage.getItem(key);
    }
    return null;
};

// Helper function to set storage value
const setStorageValue = (key: string, value: string, rememberMe: boolean): void => {
    if (typeof window !== "undefined") {
        if (rememberMe) {
            localStorage.setItem(key, value);
        } else {
            sessionStorage.setItem(key, value);
        }
    }
};

// Cookie-based auth token management
export const getAuthToken = (): string | null => {
    const tokenFromCookie = getCookie(TOKEN_COOKIE);
    if (tokenFromCookie) return tokenFromCookie;

    return getStorageValue("token");
};

export const setAuthToken = (token: string, rememberMe = false): void => {
    const cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
    };

    setCookie(TOKEN_COOKIE, token, cookieOptions);
    setStorageValue("token", token, rememberMe);

    console.log("Auth token set successfully");
};

export const setUserRole = (role: string, rawRole: string, rememberMe = false, isContentCreator = false): void => {
    const cookieOptions = {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        expires: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
    };

    if (isContentCreator) {
        role = "ROLE_CONTENT_CREATOR";
        rawRole = "CONTENT_CREATOR";
    } else if (!role.includes("COMPANY")) {
        role = "ROLE_COMPANY";
        rawRole = "COMPANY";
    }

    const normalizedRole = role.toUpperCase();
    const normalizedRawRole = rawRole.toUpperCase();
    const userType = isContentCreator ? "CONTENT_CREATOR" : "COMPANY";

    setCookie(USER_ROLE_COOKIE, normalizedRole, cookieOptions);
    setCookie(USER_ROLE_RAW_COOKIE, normalizedRawRole, cookieOptions);
    setCookie(USER_TYPE_COOKIE, userType, cookieOptions);
    setCookie(USER_IS_CONTENT_CREATOR, isContentCreator ? "true" : "false", cookieOptions);
    setCookie(USER_IS_COMPANY, !isContentCreator ? "true" : "false", cookieOptions);

    setStorageValue("userRole", normalizedRole, rememberMe);
    setStorageValue("userRoleRaw", normalizedRawRole, rememberMe);
    setStorageValue("userType", userType, rememberMe);
    setStorageValue("userIsContentCreator", isContentCreator ? "true" : "false", rememberMe);
    setStorageValue("userIsCompany", !isContentCreator ? "true" : "false", rememberMe);

    console.log("User role set successfully:", normalizedRole, "Raw role:", normalizedRawRole);
    console.log("User type:", userType, "isContentCreator:", isContentCreator);
};

export const getUserRole = (): string | null => {
    const userType = getCookie(USER_TYPE_COOKIE);
    if (userType === "CONTENT_CREATOR") return "ROLE_CONTENT_CREATOR";
    if (userType === "COMPANY") return "ROLE_COMPANY";

    const isCreator = getCookie(USER_IS_CONTENT_CREATOR);
    if (isCreator === "true") return "ROLE_CONTENT_CREATOR";

    const isCompany = getCookie(USER_IS_COMPANY);
    if (isCompany === "true") return "ROLE_COMPANY";

    const roleFromCookie = getCookie(USER_ROLE_COOKIE);
    if (roleFromCookie) return roleFromCookie;

    return getStorageValue("userRole");
};

export const getUserRoleRaw = (): string | null => {
    const userType = getCookie(USER_TYPE_COOKIE);
    if (userType === "CONTENT_CREATOR") return "CONTENT_CREATOR";
    if (userType === "COMPANY") return "COMPANY";

    const isCreator = getCookie(USER_IS_CONTENT_CREATOR);
    if (isCreator === "true") return "CONTENT_CREATOR";

    const isCompany = getCookie(USER_IS_COMPANY);
    if (isCompany === "true") return "COMPANY";

    const rawRoleFromCookie = getCookie(USER_ROLE_RAW_COOKIE);
    if (rawRoleFromCookie) return rawRoleFromCookie;

    return getStorageValue("userRoleRaw");
};

export const isContentCreator = (): boolean => {
    const userType = getCookie(USER_TYPE_COOKIE);
    if (userType === "CONTENT_CREATOR") return true;
    if (userType === "COMPANY") return false;

    const isCreator = getCookie(USER_IS_CONTENT_CREATOR);
    if (isCreator === "true") return true;

    const isCompany = getCookie(USER_IS_COMPANY);
    if (isCompany === "true") return false;

    const role = getCookie(USER_ROLE_COOKIE);
    if (role) {
        if (role.toUpperCase().includes("COMPANY")) return false;
        if (role.toUpperCase().includes("CONTENT") || role.toUpperCase().includes("CREATOR")) return true;
    }

    const rawRole = getCookie(USER_ROLE_RAW_COOKIE);
    if (rawRole) {
        if (rawRole.toUpperCase().includes("COMPANY")) return false;
        if (rawRole.toUpperCase().includes("CONTENT") || rawRole.toUpperCase().includes("CREATOR")) return true;
    }

    const userTypeStorage = getStorageValue("userType");
    if (userTypeStorage === "CONTENT_CREATOR") return true;
    if (userTypeStorage === "COMPANY") return false;

    const isCreatorStorage = getStorageValue("userIsContentCreator");
    if (isCreatorStorage === "true") return true;

    const isCompanyStorage = getStorageValue("userIsCompany");
    if (isCompanyStorage === "true") return false;

    const roleStorage = getStorageValue("userRole");
    if (roleStorage) {
        if (roleStorage.toUpperCase().includes("COMPANY")) return false;
        if (roleStorage.toUpperCase().includes("CONTENT") || roleStorage.toUpperCase().includes("CREATOR")) return true;
    }

    const rawRoleStorage = getStorageValue("userRoleRaw");
    if (rawRoleStorage) {
        if (rawRoleStorage.toUpperCase().includes("COMPANY")) return false;
        if (rawRoleStorage.toUpperCase().includes("CONTENT") || rawRoleStorage.toUpperCase().includes("CREATOR")) return true;
    }

    return false;
};

export const isCompany = (): boolean => {
    return !isContentCreator();
};

export const clearAuthToken = (): void => {
    deleteCookie(TOKEN_COOKIE);
    deleteCookie(USER_ROLE_COOKIE);
    deleteCookie(USER_ROLE_RAW_COOKIE);
    deleteCookie(USER_TYPE_COOKIE);
    deleteCookie(USER_IS_CONTENT_CREATOR);
    deleteCookie(USER_IS_COMPANY);

    if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userRoleRaw");
        localStorage.removeItem("userType");
        localStorage.removeItem("userIsContentCreator");
        localStorage.removeItem("userIsCompany");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("userRole");
        sessionStorage.removeItem("userRoleRaw");
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("userIsContentCreator");
        sessionStorage.removeItem("userIsCompany");
    }

    console.log("Auth tokens cleared successfully");
};

// Standardized API response type
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T | null;
    timestamp?: string;
}

// Define the ApiConfig interface that was missing
export interface ApiConfig extends RequestInit {
    params?: Record<string, any>;
}

// Improved API request function
export const apiRequest = async <T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> => {
    const token = getAuthToken();
    const fullUrl = `${API_URL}${url}`;

    console.log(`API Request to: ${fullUrl}`, { method: options.method || "GET", headers: options.headers });

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
    };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

        const response = await fetch(fullUrl, {
            ...options,
            headers,
            credentials: "include",
            method: options.method || "GET",
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        console.log(`Response status: ${response.status}`);

        if (!response.ok) {
            if (response.status === 401) {
                clearAuthToken();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
                throw new Error("Unauthorized, redirecting to login");
            }

            const errorData = await response.json().catch(() => ({}));
            console.error("API Error:", errorData);

            if (response.status === 403) {
                return {
                    success: false,
                    message: errorData.message || "Zugriff verweigert. Sie haben keine Berechtigung für diese Aktion.",
                    data: null,
                    timestamp: new Date().toISOString(),
                };
            }

            return {
                success: false,
                message: errorData.message || `Fehler: ${response.status} - ${response.statusText}`,
                data: null,
                timestamp: new Date().toISOString(),
            };
        }

        const data = await response.json();
        console.log("API Response data:", data);
        return { success: true, data, timestamp: new Date().toISOString() };
    } catch (error) {
        console.error("API Request failed:", error);
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            return {
                success: false,
                message: "Verbindung zum Server fehlgeschlagen. Bitte überprüfe deine Internetverbindung oder versuche es später erneut.",
                data: null,
                timestamp: new Date().toISOString(),
            };
        }
        return {
            success: false,
            message: error instanceof Error ? error.message : "Ein unbekannter Fehler ist aufgetreten",
            data: null,
            timestamp: new Date().toISOString(),
        };
    }
};

// Axios-like helper functions
const api = {
    getAuthToken,
    setAuthToken,
    setUserRole,
    getUserRole,
    getUserRoleRaw,
    isContentCreator,
    isCompany,
    clearAuthToken,

    get: async <T>(url: string, config: ApiConfig = {}): Promise<ApiResponse<T>> => {
        const { params, ...rest } = config;
        const queryParams = params ? new URLSearchParams(params).toString() : "";
        const queryUrl = queryParams ? `${url}?${queryParams}` : url;
        return apiRequest<T>(queryUrl, { ...rest, method: "GET" });
    },

    post: async <T>(url: string, data: unknown, config: ApiConfig = {}): Promise<ApiResponse<T>> => {
        return apiRequest<T>(url, {
            ...config,
            method: "POST",
            body: JSON.stringify(data),
        });
    },

    put: async <T>(url: string, data: unknown, config: ApiConfig = {}): Promise<ApiResponse<T>> => {
        return apiRequest<T>(url, {
            ...config,
            method: "PUT",
            body: JSON.stringify(data),
        });
    },

    delete: async <T>(url: string, config: ApiConfig = {}): Promise<ApiResponse<T>> => {
        return apiRequest<T>(url, { ...config, method: "DELETE" });
    },
};

export default api;