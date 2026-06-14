// Shape of errors returned by Axios when the backend responds with an error
export type AxiosErrorLike = {
    response?: {
        data?: {
            detail?: unknown
        }
    }
}

// Pydantic validation error item shape (returned as array in detail)
export type PydanticErrorItem = {
    msg?: string
    loc?: (string | number)[]
    type?: string
}

// Helper to extract a clean error message from any API error
export function extractErrorMessage(err: unknown, fallback = "Something went wrong. Please try again."): string {
    const detail = (err as AxiosErrorLike)?.response?.data?.detail

    if (typeof detail === "string") {
        return detail
    }

    if (Array.isArray(detail)) {
        const first = detail[0] as PydanticErrorItem
        const raw = first?.msg ?? fallback
        // Pydantic prefixes ValueError messages with "Value error, " — strip it
        return raw.replace(/^Value error, \s*/i, "")
    }

    return fallback
}