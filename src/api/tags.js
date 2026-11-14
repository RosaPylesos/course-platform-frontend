import { apiRequest } from "./client"

export function getTagCategories() {
    return apiRequest("/tag-categories/")
}

export function addCourseTag(courseId, tagId, token) {
    return apiRequest(`/courses/${courseId}/tags/${tagId}`, {
        method: "POST",
        token,
    })
}

export function removeCourseTag(courseId, tagId, token) {
    return apiRequest(`/courses/${courseId}/tags/${tagId}`, {
        method: "DELETE",
        token,
    })
}