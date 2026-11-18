import { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import {
    cancelEnrollment,
    restoreEnrollment,
} from "@/api/enrollments"

function EnrollmentCard({ enrollment, onStatusChange }) {
    const [imageError, setImageError] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(enrollment.status)
    const [actionLoading, setActionLoading] = useState(false)
    const [actionError, setActionError] = useState("")

    const { course, progress, created_at } = enrollment
    const { token } = useAuth()

    const hasImage =
        course.thumbnail_path &&
        course.thumbnail_path !== "string" &&
        !imageError

    const progressPercent =
        progress.lessons_total > 0
            ? Math.round(
                (progress.lessons_completed / progress.lessons_total) * 100
            )
            : 0

    const enrollmentDate = new Date(created_at).toLocaleDateString(
        "ru-RU",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    )

    async function handleCancel() {
        try {
            setActionLoading(true)
            setActionError("")

            await cancelEnrollment(token, enrollment.id)
            console.log("Отмена успешна, вызываю обновление списка")

            await onStatusChange()
        } catch (err) {
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    async function handleRestore() {
        try {
            setActionLoading(true)
            setActionError("")

            await restoreEnrollment(token, enrollment.id)
            console.log("Восстановление успешно, вызываю обновление списка")

            await onStatusChange()
        } catch (err) {
            setActionError(err.message)
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <article className="overflow-hidden rounded-xl border bg-card">
            <div className="flex h-44 items-center justify-center overflow-hidden bg-muted">
                {hasImage ? (
                    <img
                        src={course.thumbnail_path}
                        alt={`Обложка курса ${course.name}`}
                        className="h-full w-full object-cover"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className="text-sm text-muted-foreground">
                        Обложка отсутствует
                    </span>
                )}
            </div>

            <div className="space-y-4 p-4">
                <div className="space-y-1">
                    <h2 className="text-lg font-semibold">
                        {course.name}
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Запись от {enrollmentDate}
                    </p>
                </div>

                {course.status === "archived" && (
                    <p className="text-sm text-muted-foreground">
                        Курс архивирован
                    </p>
                )}

                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Прогресс</span>
                        <span>
                            {progress.lessons_completed} из{" "}
                            {progress.lessons_total} уроков
                        </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Завершено {progressPercent}%
                    </p>
                </div>

                <div className="space-y-2">
                    {currentStatus === "active" && (
                        <>
                            <Button asChild className="w-full">
                                <Link to={`/courses/${course.id}/progress`}>
                                    Продолжить обучение
                                </Link>
                            </Button>

                            <Button
                                variant="outline"
                                className="w-full"
                                disabled={actionLoading}
                                onClick={handleCancel}
                            >
                                Отменить запись
                            </Button>
                        </>
                    )}

                    {currentStatus === "completed" && (
                        <Button asChild className="w-full">
                            <Link to={`/courses/${course.id}/progress`}>
                                Посмотреть курс
                            </Link>
                        </Button>
                    )}

                    {currentStatus === "cancelled" && (
                        <Button
                            className="w-full"
                            disabled={actionLoading}
                            onClick={handleRestore}
                        >
                            Восстановить запись
                        </Button>
                    )}

                    {actionLoading && (
                        <p className="text-center text-sm text-muted-foreground">
                            Выполняем запрос...
                        </p>
                    )}

                    {actionError && (
                        <p className="text-sm text-destructive">
                            {actionError}
                        </p>
                    )}
                </div>
            </div>
        </article>
    )
}

export default EnrollmentCard