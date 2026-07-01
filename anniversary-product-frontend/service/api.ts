const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function request<T>(
    url: string,
    options: RequestInit = {}
): Promise<T> {
    const isFormData = options.body instanceof FormData;
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...options.headers,
        },
        cache: "no-store",
        ...options,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Request failed");
    }

    return response.json();
}

export const api = {
    get: <T>(url: string) => request<T>(url),

    post: <T>(url: string, body: any) =>
        request<T>(url, {
            method: "POST",
            body: JSON.stringify(body),
        }),
    put: <T>(url: string, body: any) =>
    request<T>(url, {
        method: "PUT",
        body: JSON.stringify(body),
    }),
    postForm: <T>(url: string, formData: FormData) =>
        request<T>(url, {
            method: "POST",
            body: formData,
        }),

    delete: <T>(url: string, body?: any) =>
        request<T>(url, {
            method: "DELETE",
            body: body ? JSON.stringify(body) : undefined,
        }),
};