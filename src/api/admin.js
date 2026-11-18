import { apiRequest } from "./client"

export function getAdminUsers({
    page = 1,
    pageSize = 20,
    sortBy,
    sortOrder,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (sortBy) {
        params.set("sort_by", sortBy)
    }

    if (sortOrder) {
        params.set("sort_order", sortOrder)
    }

    return apiRequest(`/admin/users/?${params.toString()}`, {
        token,
    })
}

export function assignUserAsAuthor(userId, token) {
    return apiRequest(`/admin/users/${userId}/role`, {
        method: "PATCH",
        token,
    })
}

export function getAdminCourses({
    page = 1,
    pageSize = 20,
    sortBy,
    sortOrder,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (sortBy) {
        params.set("sort_by", sortBy)
    }

    if (sortOrder) {
        params.set("sort_order", sortOrder)
    }

    return apiRequest(`/admin/courses/?${params.toString()}`, {
        token,
    })
}

export function getAdminLessons({
    page = 1,
    pageSize = 20,
    sortBy,
    sortOrder,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (sortBy) {
        params.set("sort_by", sortBy)
    }

    if (sortOrder) {
        params.set("sort_order", sortOrder)
    }

    return apiRequest(`/admin/lessons/?${params.toString()}`, {
        token,
    })
}

export function getAdminTopics({
    page = 1,
    pageSize = 20,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    return apiRequest(`/admin/topics/?${params.toString()}`, {
        token,
    })
}

export function createAdminTopic(topicData, token) {
    return apiRequest("/admin/topics/", {
        method: "POST",
        body: topicData,
        token,
    })
}

export function updateAdminTopic(topicId, topicData, token) {
    return apiRequest(`/admin/topics/${topicId}`, {
        method: "PATCH",
        body: topicData,
        token,
    })
}

export function deleteAdminTopic(topicId, token) {
    return apiRequest(`/admin/topics/${topicId}`, {
        method: "DELETE",
        token,
    })
}

export function getAdminTagCategories({
    page = 1,
    pageSize = 20,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    return apiRequest(`/admin/tag-categories/?${params.toString()}`, {
        token,
    })
}

export function createAdminTagCategory(categoryData, token) {
    return apiRequest("/admin/tag-categories/", {
        method: "POST",
        body: categoryData,
        token,
    })
}

export function updateAdminTagCategory(categoryId, categoryData, token) {
    return apiRequest(`/admin/tag-categories/${categoryId}`, {
        method: "PATCH",
        body: categoryData,
        token,
    })
}

export function deleteAdminTagCategory(categoryId, token) {
    return apiRequest(`/admin/tag-categories/${categoryId}`, {
        method: "DELETE",
        token,
    })
}

export function getAdminTags({
    page = 1,
    pageSize = 20,
    tagCategoryId,
    token,
} = {}) {
    const params = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    })

    if (tagCategoryId) {
        params.set("tag_category_id", tagCategoryId)
    }

    return apiRequest(`/admin/tags/?${params.toString()}`, {
        token,
    })
}

export function createAdminTag(tagData, token) {
    return apiRequest("/admin/tags/", {
        method: "POST",
        body: tagData,
        token,
    })
}

export function updateAdminTag(tagId, tagData, token) {
    return apiRequest(`/admin/tags/${tagId}`, {
        method: "PATCH",
        body: tagData,
        token,
    })
}

export function deleteAdminTag(tagId, token) {
    return apiRequest(`/admin/tags/${tagId}`, {
        method: "DELETE",
        token,
    })
}