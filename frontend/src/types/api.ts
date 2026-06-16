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