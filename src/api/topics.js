import { apiRequest } from "./client"

export function getTopics() {
    return apiRequest("/topics/")
}

export function getUserTopics(token) {
    return apiRequest("/users/me/topics", { token })
}

export function updateUserTopics(token, topicIds) {
    return apiRequest("/users/me/topics/", {
        method: "PUT",
        token,
        body: {
            topic_ids: topicIds,
        }
    })
}