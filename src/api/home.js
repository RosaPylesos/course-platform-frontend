import { apiRequest } from "./client"

export function getHomePage(token) {
    return apiRequest("/home/", { token })
}