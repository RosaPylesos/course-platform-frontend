import { apiRequest } from "./client"

export function getCourseFilters() {
    return apiRequest("/courses/filters")
}