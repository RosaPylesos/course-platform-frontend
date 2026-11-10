import { useEffect, useState, useCallback } from "react"
import { getEnrollments } from "@/api/enrollments"
import { useAuth } from "@/contexts/AuthContext"

import EnrollmentCard from "@/components/learning/EnrollmentCard"
import { Button } from "@/components/ui/button"

function MyLearningPage() {

    const { user, token, loading: authLoading } = useAuth()

    const [enrollments, setEnrollments] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [activeTab, setActiveTab] = useState("active")

    const tabs = [
        {
            value: "active",
            label: "Активные",
        },
        {
            value: "completed",
            label: "Завершённые",
        },
        {
            value: "cancelled",
            label: "Отменённые",
        },
    ]

    const loadEnrollments = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true)
            }

            setError("")

            const data = await getEnrollments(token)
            console.log("Обновлённые записи:", data)
            setEnrollments(data)
        } catch (err) {
            setError(err.message)
        } finally {
            if (showLoading) {
                setLoading(false)
            }
        }
    }, [token])

    useEffect(() => {
        if (authLoading) return

        if (!user || !token) {
            setEnrollments(null)
            setLoading(false)
            return
        }

        loadEnrollments()
    }, [user, token, authLoading, loadEnrollments])

    const activeGroup = enrollments?.groups?.find(
        (group) => group.status === activeTab
    )
    
    const activeItems = activeGroup?.items ?? []

    if (authLoading || loading) {
    return <p className="p-6">Загрузка...</p>
    }

    if (!user) {
    return (
        <p className="p-6">
        Войдите в аккаунт, чтобы посмотреть своё обучение.
        </p>
    )
    }

    if (error) {
    return (
        <p className="p-6 text-destructive">
        {error}
        </p>
    )
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 p-6">
            <h1 className="text-3xl font-bold">
                Моё обучение
            </h1>

            <div className="flex flex-wrap gap-2">
                {tabs.map((tab) => (
                    <Button
                        key={tab.value}
                        variant={activeTab === tab.value ? "default" : "outline"}
                        onClick={() => setActiveTab(tab.value)}
                    >
                        {tab.label}
                        {" "}
                        ({enrollments?.status_counts?.[tab.value] ?? 0})
                    </Button>
                ))}
            </div>

            {activeItems.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activeItems.map((enrollment) => (
                <EnrollmentCard
                    key={enrollment.id}
                    enrollment={{
                        ...enrollment,
                        status: activeTab,
                    }}
                    onStatusChange={() => {
                        console.log("Callback из MyLearningPage вызван") 
                        loadEnrollments(false)
                    }}
                />
                ))}
            </div>
            ) : (
            <p className="py-8 text-center text-muted-foreground">
                В этом разделе пока нет курсов.
            </p>
            )}
        </div>
    )
}

export default MyLearningPage