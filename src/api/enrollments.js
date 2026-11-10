import { apiRequest } from "./client"

export function getEnrollments(token) {
    return apiRequest("/enrollments/", {
        method: "GET",
        token,
    })
}

export function getCourseEnrollmentStatus(token, courseId) {
    return apiRequest(`/enrollments/status/${courseId}`, {
        token,
    })
}

export function enrollInCourse(token, courseId) {
    return apiRequest("/enrollments/", {
        method: "POST",
        token,
        body: {
            course_id: courseId
        },
    })
}

export function cancelEnrollment(token, enrollmentId) {
    return apiRequest(`/enrollments/${enrollmentId}/cancel`, {
        method: "PATCH",
        token,
    })
}

export function restoreEnrollment(token, enrollmentId) {
    return apiRequest(`/enrollments/${enrollmentId}/restore`, {
        method: "PATCH",
        token,
    })
}