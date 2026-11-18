import { apiRequest } from "./client"

export function getPublicTagCategories() {
    return apiRequest("/tag-categories/public/")
}