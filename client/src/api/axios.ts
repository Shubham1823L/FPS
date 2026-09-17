import axios, { type AxiosRequestConfig } from 'axios'
import type { ApiSuccess } from '@/types/api.types'


const baseURL = import.meta.env.VITE_API_BASE_URL + "/api"



export const rawAxios = axios.create({
    baseURL,
    withCredentials: true,
})

type ApiAxiosInstance = {
    get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiSuccess<T>>
    post<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>
    put<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>
    put<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
    patch<T>(
        url: string,
        body?: unknown,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
    delete<T>(
        url: string,
        config?: AxiosRequestConfig
    ): Promise<ApiSuccess<T>>,
}

export const api = rawAxios as ApiAxiosInstance