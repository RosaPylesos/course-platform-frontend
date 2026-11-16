import { apiRequest } from "./client"

export function getLesson(token, courseId, lessonId) {
  return apiRequest(`/courses/${courseId}/lessons/${lessonId}`, {
    method: "GET",
    token,
  })
}

export function startLesson(token, courseId, lessonId) {
  return apiRequest(`/courses/${courseId}/lessons/${lessonId}/start`, {
    method: "POST",
    token,
  })
}

export function completeLesson(token, courseId, lessonId) {
  return apiRequest(`/courses/${courseId}/lessons/${lessonId}/complete`, {
    method: "PATCH",
    token,
  })
}

export function getCourseLessons(courseId, token) {
    return apiRequest(`/courses/${courseId}/lessons/`, { token })
}

export function createLesson(courseId, { name, description }, token) {
    return apiRequest(`/courses/${courseId}/lessons/`, {
        method: "POST",
        token,
        body: {
            name,
            description: description || null,
            content: {
                version: 1,
                blocks: [],
            },
        },
    })
}

export function updateLesson(
    courseId, 
    lessonId, 
    { name, description, content }, 
    token
) {
    return apiRequest(`/courses/${courseId}/lessons/${lessonId}`, {
        method: "PATCH",
        token,
        body: {
            name,
            description: description || null,
            ...(content !== undefined && { content })
        },
    })
}

export function deleteLesson(courseId, lessonId, token) {
    return apiRequest(`/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
        token,
    })
}

export function reorderCourseLessons(courseId, lessonIds, token) {
    return apiRequest(`/courses/${courseId}/lessons/reorder`, {
        method: "PATCH",
        token,
        body: {
            lesson_ids: lessonIds,
        },
    })
}