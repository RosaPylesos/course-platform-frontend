import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getCourse } from "@/api/courses"
import {
    enrollInCourse,
    getCourseEnrollmentStatus,
} from "@/api/enrollments"

import { Button } from "@/components/ui/button"

function CoursePage() {
    const navigate = useNavigate()

    const { user, token } = useAuth()
    const { courseId } = useParams()

    const [course, setCourse] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [enrolling, setEnrolling] = useState(false)
    const [enrollmentError, setEnrollmentError] = useState("")
    const [enrollmentStatus, setEnrollmentStatus] = useState(null)
    const [checkingEnrollment, setCheckingEnrollment] = useState(true)

    function handleGoToProgress() {
        navigate(`/courses/${courseId}/progress`)
    }

    async function handleEnroll() {
        if (!user) {
            navigate("/login")
            return
        }

        try {
            setEnrolling(true)
            setEnrollmentError("")

            const data = await enrollInCourse(token, courseId)
            setEnrollmentStatus(data.status)

        } catch (err) {
            setEnrollmentError(err.message)
        } finally {
            setEnrolling(false)
        }
    }

    useEffect(() => {
        if (!user || !token) {
            setEnrollmentStatus(null)
            setCheckingEnrollment(false)
            return
        }

        async function checkEnrollment() {
            try {
                setCheckingEnrollment(true)

                const data = await getCourseEnrollmentStatus(token, courseId)
                setEnrollmentStatus(data.status)
            } catch (err) {
                if (err.message === "Enrollment not found") {
                    setEnrollmentStatus(null)
                } else {
                    console.error("Не удалось проверить запись:", err)
                }
            } finally {
                setCheckingEnrollment(false)
            }
        }

        checkEnrollment()
    }, [user, token, courseId])

    useEffect(() => {
        async function loadCourse() {
            try {
                setLoading(true)
                setError("")

                const data = await getCourse(courseId)
                setCourse(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadCourse()
    }, [courseId])

    if (loading) {
        return <p className="p-6">Загрузка курса...</p>
    }

    if (error) {
        return <p className="p-6 text-destructive">{error}</p>
    }

    if (!course) {
        return <p className="p-6">Курс не найден.</p>
    }

    return (
        <div className="mx-auto max-w-5xl space-y-6 p-6">

            <div className="flex max-h-72 min-h-48 max-w-2xl items-center justify-center overflow-hidden rounded-xl border bg-muted">
                {course.thumbnail_path &&
                    typeof course.thumbnail_path === "string" &&
                    course.thumbnail_path.trim() !== "" ? (
                    <img
                        src={course.thumbnail_path}
                        alt={`Обложка курса ${course.name}`}
                        className="max-h-72 max-w-full object-contain"
                        onError={(event) => {
                            event.currentTarget.style.display = "none"
                            event.currentTarget.nextElementSibling.style.display = "flex"
                        }}
                    />
                ) : null}

                <div
                    className="flex min-h-48 w-full items-center justify-center text-sm text-muted-foreground"
                    style={{
                        display: course.thumbnail_path ? "none" : "flex",
                    }}
                >
                    Обложка отсутствует
                </div>
            </div>

            {/* Main Info */}
            <section className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                        {course.difficulty === "beginner"
                            ? "Начальный уровень"
                            : course.difficulty === "intermediate"
                                ? "Средний уровень"
                                : course.difficulty === "advanced"
                                    ? "Продвинутый уровень"
                                    : course.difficulty}
                    </span>

                    {course.topic && (
                        <span className="rounded-full bg-secondary px-3 py-1 text-sm">
                            {course.topic.name}
                        </span>
                    )}
                </div>

                <h1 className="text-3xl font-bold">{course.name}</h1>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                    <span>
                        Автор: {[
                            course.author?.name,
                            course.author?.surname,
                        ].filter(Boolean).join(" ") || "Не указан"}
                    </span>

                    <span>{course.lesson_count} уроков</span>
                </div>
            </section>

            {/* Detailed Info */}
            <section className="space-y-2">
                <h2 className="text-xl font-semibold">Описание</h2>
                <p className="whitespace-pre-line text-muted-foreground">
                    {course.description || "Описание пока отсутствует."}
                </p>
            </section>


            {course.tags?.length > 0 && (
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">Теги</h2>

                    <div className="flex flex-wrap gap-2">
                        {course.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-md bg-muted px-3 py-1.5 text-sm"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Enrolling */}
            <section className="border-t pt-6">
                <div className="space-y-2">
                    {enrollmentStatus === "active" ||
                        enrollmentStatus === "completed" ? (
                        <Button onClick={handleGoToProgress}>
                            {enrollmentStatus === "active"
                                ? "Перейти к обучению"
                                : "Посмотреть курс"}
                        </Button>
                    ) : (
                        <Button
                            onClick={handleEnroll}
                            disabled={enrolling || checkingEnrollment}
                        >
                            {checkingEnrollment
                                ? "Проверяем запись..."
                                : enrolling
                                    ? "Записываем..."
                                    : "Записаться на курс"}
                        </Button>
                    )}

                    {enrollmentError && (
                        <p className="text-sm text-destructive">
                            {enrollmentError}
                        </p>
                    )}
                </div>
            </section>
        </div>
    )
}

export default CoursePage