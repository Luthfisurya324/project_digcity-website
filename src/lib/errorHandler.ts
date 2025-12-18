/**
 * Error Handler Utility untuk DIGCITY
 * Menyediakan error handling yang konsisten dan bersih di console
 */

// Konfigurasi development mode
const isDevelopment = import.meta.env.DEV

// Warna untuk console (hanya di development)
const styles = {
    error: 'color: #ef4444; font-weight: bold;',
    warn: 'color: #f59e0b; font-weight: bold;',
    info: 'color: #3b82f6; font-weight: bold;',
    success: 'color: #22c55e; font-weight: bold;',
    dim: 'color: #6b7280;',
}

interface SupabaseError {
    code?: string
    message?: string
    details?: string | null
    hint?: string | null
}

interface FormattedError {
    module: string
    action: string
    code?: string
    message: string
    hint?: string
}

/**
 * Format error dari Supabase menjadi format yang bersih
 */
export function formatSupabaseError(
    module: string,
    action: string,
    error: unknown
): FormattedError {
    const supaError = error as SupabaseError

    return {
        module,
        action,
        code: supaError?.code,
        message: supaError?.message || 'Unknown error',
        hint: supaError?.hint || undefined,
    }
}

/**
 * Log error dengan format yang rapi
 */
export function logError(
    module: string,
    action: string,
    error: unknown,
    showDetails: boolean = false
): void {
    if (!isDevelopment) return

    const formatted = formatSupabaseError(module, action, error)

    // Header dengan emoji dan module
    console.groupCollapsed(
        `%c⚠️ ${formatted.module}%c → ${formatted.action}`,
        styles.error,
        styles.dim
    )

    // Info error
    console.log('%cCode:%c', styles.info, '', formatted.code || 'N/A')
    console.log('%cMessage:%c', styles.info, '', formatted.message)

    if (formatted.hint) {
        console.log('%cHint:%c', styles.warn, '', formatted.hint)
    }

    // Detail lengkap (opsional)
    if (showDetails && error) {
        console.log('%cDetails:%c', styles.dim, '', error)
    }

    console.groupEnd()
}

/**
 * Log warning dengan format yang rapi
 */
export function logWarning(
    module: string,
    action: string,
    message: string
): void {
    if (!isDevelopment) return

    console.log(
        `%c⚡ ${module}%c → ${action}: ${message}`,
        styles.warn,
        styles.dim
    )
}

/**
 * Log info dengan format yang rapi
 */
export function logInfo(
    module: string,
    action: string,
    message: string
): void {
    if (!isDevelopment) return

    console.log(
        `%cℹ️ ${module}%c → ${action}: ${message}`,
        styles.info,
        styles.dim
    )
}

/**
 * Log success dengan format yang rapi
 */
export function logSuccess(
    module: string,
    action: string,
    message: string
): void {
    if (!isDevelopment) return

    console.log(
        `%c✅ ${module}%c → ${action}: ${message}`,
        styles.success,
        styles.dim
    )
}

/**
 * Wrapper untuk API calls dengan error handling yang konsisten
 */
export async function safeApiCall<T>(
    module: string,
    action: string,
    apiCall: () => Promise<T>,
    fallback?: T
): Promise<T | undefined> {
    try {
        return await apiCall()
    } catch (error) {
        logError(module, action, error)
        return fallback
    }
}

/**
 * Known error codes yang bisa diabaikan (tidak perlu log detail)
 */
const SILENT_ERROR_CODES = [
    'PGRST205', // Table not found - biasa untuk fitur yang belum diaktifkan
    '42P01',    // Relation does not exist
]

/**
 * Cek apakah error harus di-log atau diabaikan
 */
export function shouldLogError(error: unknown): boolean {
    const supaError = error as SupabaseError
    if (supaError?.code && SILENT_ERROR_CODES.includes(supaError.code)) {
        return false
    }
    return true
}

/**
 * Log error hanya jika bukan error yang diketahui/expected
 */
export function logErrorIfNeeded(
    module: string,
    action: string,
    error: unknown
): void {
    if (shouldLogError(error)) {
        logError(module, action, error)
    }
}
