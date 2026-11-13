import { useEffect, useState } from "react"
import { 
    useParams, 
    useLocation, 
    useNavigate ,
} from "react-router-dom"

// REPLACE MAYBE???
import { ArrowLeft } from "lucide-react"

import { getLesson, startLesson, completeLesson } from "@/api/lessons"
import { useAuth } from "@/contexts/AuthContext"

import { Button } from "@/components/ui/button"
import LessonContent from "@/components/learning/lesson/LessonContent"

function LessonPage() {
    const { courseId, lessonId } = useParams()
    const { token, user, loading: authLoading } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()

    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isCompleted, setIsCompleted] = useState(
        location.state?.isCompleted ?? false
    )
    const [completing, setCompleting] = useState(false)

    async function handleComplete() {
        try {
            setCompleting(true)

            const progress = await completeLesson(token, courseId, lessonId)

            setIsCompleted(progress.is_completed)
        } catch (err) {
            setError(err.message)
        } finally {
            setCompleting(false)
        }
    }

    useEffect(() => {
        if (authLoading) return

        if (!user || !token) {
            setLoading(false)
            return
        }

        async function loadLesson() {
            try {
                setLoading(true)
                setError("")

                const data = await getLesson(token, courseId, lessonId)
                await startLesson(token, courseId, lessonId)
                setLesson(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadLesson()
    }, [courseId, lessonId, token, user, authLoading])

    if (authLoading || loading) {
        return <p className="p-6">Загрузка урока...</p>
    }

    if (!user) {
        return (
            <p className="p-6">
                Войдите в аккаунт, чтобы посмотреть урок.
            </p>
        )
    }

    if (error) {
        return <p className="p-6 text-destructive">{error}</p>
    }

    if (!lesson) {
        return <p className="p-6">Урок не найден.</p>
    }

    return (
        <main className="mx-auto max-w-4xl space-y-6 p-6">

            <Button
                variant="ghost"
                onClick={() => navigate(`/courses/${courseId}/progress`)}
                className="w-fit"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Назад к списку уроков
            </Button>
            <header className="space-y-2">
                <h1 className="text-3xl font-bold">{lesson.name}</h1>
                {lesson.description && (
                    <p className="text-muted-foreground">{lesson.description}</p>
                )}
            </header>
            <LessonContent content={lesson.content} />
            <div className="flex justify-end border-t pt-6">
                <Button
                    onClick={handleComplete}
                    disabled={isCompleted || completing}
                >
                    {completing
                        ? "Завершение..."
                        : isCompleted
                            ? "Урок завершён"
                            : "Завершить урок"}
                </Button>
            </div>
        </main>
    )
}

export default LessonPage