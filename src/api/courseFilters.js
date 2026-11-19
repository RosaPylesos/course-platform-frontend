import { apiRequest } from "./client"

export function getCourseFilters({ topicId } = {}) {

    const params = new URLSearchParams()

    if (topicId) {
        params.set("topic_id", topicId)
    }
    
    const query = params.toString()

    return apiRequest(
        `/courses/filters${query ? `?${query}`: ""}`
    )
}