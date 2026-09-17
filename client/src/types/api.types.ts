export type ApiSuccess<T> = {
    status: number
    success: true,
    data: T,
    message: string
}

export type ApiError = {
    status:number,
    success: false,
    code: string,
    message: string
}