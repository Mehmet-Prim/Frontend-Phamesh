// Cookie-Hilfsfunktionen

interface CookieOptions {
    secure?: boolean
    sameSite?: "strict" | "lax" | "none"
    expires?: Date
    maxAge?: number
    path?: string
}

export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === "undefined") return

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

    if (options.path) {
        cookieString += `; path=${options.path}`
    } else {
        cookieString += "; path=/"
    }

    if (options.secure) {
        cookieString += "; secure"
    }

    if (options.sameSite) {
        cookieString += `; samesite=${options.sameSite}`
    }

    if (options.expires) {
        cookieString += `; expires=${options.expires.toUTCString()}`
    }

    if (options.maxAge) {
        cookieString += `; max-age=${options.maxAge}`
    }

    document.cookie = cookieString
}

export function getCookie(name: string): string | null {
    if (typeof window === "undefined") return null

    const cookies = document.cookie.split(";")
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim()
        if (cookie.startsWith(`${encodeURIComponent(name)}=`)) {
            return decodeURIComponent(cookie.substring(name.length + 1))
        }
    }
    return null
}

export function deleteCookie(name: string, options: CookieOptions = {}): void {
    const deleteOptions = {
        ...options,
        expires: new Date(0),
    }
    setCookie(name, "", deleteOptions)
}

