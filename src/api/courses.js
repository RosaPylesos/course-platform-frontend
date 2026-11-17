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

export function getMyCourses({
    page = 1,
    pageSize = 16,
    status,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (status) {
        params.set("status", status)
    }

    return apiRequest(`/courses/my?${params.toString()}`, {
        token,
    })
}

export function createCourse({
    topic_id,
    name,
    description,
    difficulty,
    thumbnail_path,
    token,
}) {
    return apiRequest("/courses/", {
        method: "POST",
        token,
        body: {
            topic_id,
            name,
            description: description || null,
            difficulty,
            thumbnail_path: thumbnail_path || null,
        },
    })
}

export function getMyCourse(courseId, token) {
    return apiRequest(`/courses/my/${courseId}`, {
        token,
    })
}

export function updateCourse({
    courseId,
    topic_id,
    name,
    description,
    difficulty,
    thumbnail_path,
    token,
}) {
    return apiRequest(`/courses/${courseId}`, {
        method: "PATCH",
        token,
        body: {
            topic_id,
            name,
            description: description || null,
            difficulty,
            thumbnail_path: thumbnail_path || null,
        },
    })
}

export function deleteCourse(courseId, token) {
    return apiRequest(`/courses/${courseId}`, {
        method: "DELETE",
        token,
    })
}

export function publishCourse(courseId, token) {
    return apiRequest(`/courses/${courseId}/publish`, {
        method: "POST",
        token,
    })
}

export function archiveCourse(courseId, token) {
    return apiRequest(`/courses/${courseId}/archive`, {
        method: "POST",
        token,
    })
}