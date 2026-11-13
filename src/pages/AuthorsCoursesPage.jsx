import { useEffect, useState } from "react"
import { getMyCourses } from "@/api/courses"
import { useAuth } from "@/contexts/AuthContext"

import CreateCourseDialog from "@/components/author/CreateCourseDialog"
import EmptyCourses from "@/components/author/EmptyCourses"

import { getTopics } from "@/api/topics"

function AuthorsCoursesPage() {
    const { token } = useAuth()

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [topics, setTopics] = useState([])

    async function loadCourses() {
        try {
            setError(null)
            const data = await getMyCourses({ token })
            setCourses(data.items)
        } catch (error) {
            console.error("Не удалось загрузить курсы автора:", error)
            setError("Не удалось загрузить список курсов")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            loadCourses()
        }
    }, [token])

    useEffect(() => {
        async function loadTopics() {
            try {
                const data = await getTopics()
                setTopics(data)
            } catch (error) {
                console.error("Не удалось загрузить темы:", error)
            }
        }

        loadTopics()
    }, [])

    if (loading) return <p>Загрузка курсов...</p>
    if (error) return <p>{error}</p>
    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold mb-4">Каталог курсов</h1>

            {courses.length === 0 ? (
                <EmptyCourses
                    onCreateClick={() => setCreateDialogOpen(true)}
                />
            ) : (
                <p>Количество курсов: {courses.length}</p>
            )}

            <CreateCourseDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                topics={topics}
                onCourseCreated={loadCourses}
            />
        </div>
    )
}

export default AuthorsCoursesPage