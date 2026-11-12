import { apiRequest } from "./client"

export function getCourses({
    page = 1,
    pageSize = 16,
    search,
    authorIds,
    topics,
    contextTopicId,
    tags,
    includeDescendants,
    difficulties,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (search) {
        params.set("search", search)
    }

    authorIds?.forEach((id) => {
        params.append("author_ids", id)
    })

    if (topics) {
        params.set("topics", topics)
    }

    if (contextTopicId) {
        params.set("topic_id", contextTopicId)
    }

    if (tags) {
        params.set("tags", tags)
    }

    if (includeDescendants !== undefined) {
        params.set("include_descendants", String(includeDescendants))
    }

    difficulties?.forEach((difficulty) => {
        params.append("difficulties", difficulty)
    })

    return apiRequest(`/courses/?${params.toString()}`)
}

export function getCourse(courseId) {
    return apiRequest(`/courses/${courseId}`)
}

export function getCourseProgress(token, courseId) {
    return apiRequest(`/courses/${courseId}/progress`, {
        method: "GET",
        token,
    })
}