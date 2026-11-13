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