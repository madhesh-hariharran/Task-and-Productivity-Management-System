import type { AxiosErrorLike, PydanticErrorItem } from '../types/api'

// Extracts a clean, user-facing error message from any API error.
// Handles three shapes:
//   1. Backend returns detail as a plain string  → use it directly
//   2. Backend returns detail as a Pydantic array → use first item's msg, strip "Value error, " prefix
//   3. Anything else                              → use the fallback

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