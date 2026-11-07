import { apiRequest } from "./client"

export function registerUser(userData) {
    return apiRequest("/users/register", {
        method: "POST",
        body: userData,
    })
}

export function loginUser(credentials) {
    return apiRequest("/users/login", {
        method: "POST",
        body: credentials,
    })
}

export function getCurrentUser(token) {
    return apiRequest("/users/me", {
        token,
    })
}

export function updateUserProfile(token, userData) {
    return apiRequest("/users/me", {
        method: "PATCH",
        token,
        body: userData,
    })
}