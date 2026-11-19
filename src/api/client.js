const API_URL = import.meta.env.VITE_API_URL

export async function apiRequest(
    endpoint,
    {
        method = "GET",
        body,
        token,
        headers = {},
    } = {}
) {
    const response = await fetch(`${API_URL}${endpoint}`,
        {
            method,
            headers: {
                "Content-Type": "application/json",
                ...(token && {
                    Authorization: `Bearer ${token}`,
                }),
                ...headers,
            },
            ...(body !== undefined && {
                body: JSON.stringify(body),
            }),
        })

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        throw new Error(
            data?.detail || `Ошибка запроса: ${response.status}`
        )
    }

    return data
}

    