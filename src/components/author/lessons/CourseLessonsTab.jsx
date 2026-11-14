import { useEffect, useState } from "react"
import { getCourseLessons, reorderCourseLessons } from "@/api/lessons"
import { Button } from "@/components/ui/button"

import CreateLessonDialog from "@/components/author/lessons/CreateLessonDialog"
import LessonItem from "@/components/author/lessons/LessonItem"
import LessonEditPanel from "@/components/author/lessons/LessonEditPanel"
import SortableLessonsList from "@/components/author/lessons/SortableLessonsList"

function CourseLessonsTab({ courseId, token }) {
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [isReorderMode, setIsReorderMode] = useState(false)
    const [reorderedLessons, setReorderedLessons] = useState([])
    const [isSavingOrder, setIsSavingOrder] = useState(false)
    const [orderError, setOrderError] = useState("")

    async function loadLessons() {
        try {
            setLoading(true)
            setError("")

            const data = await getCourseLessons(courseId, token)
            setLessons(data)
        } catch (error) {
            console.error("Не удалось загрузить уроки курса:", error)
            setError("Не удалось загрузить список уроков")
        } finally {
            setLoading(false)
        }
    }

    function handleStartReorder() {
        setReorderedLessons([...lessons])
        setIsReorderMode(true)
    }

    function handleCancelReorder() {
        setReorderedLessons([])
        setIsReorderMode(false)
    }

    function handleReorder(nextLessons) {
        setReorderedLessons(nextLessons)
    }

    async function handleSaveOrder() {
        setOrderError("")
        setIsSavingOrder(true)

        try {
            const lessonIds = reorderedLessons.map((lesson) => lesson.id)

            await reorderCourseLessons(courseId, lessonIds, token)

            await loadLessons()

            setReorderedLessons([])
            setIsReorderMode(false)
        } catch (error) {
            console.error("Не удалось изменить порядок уроков:", error)
            setOrderError(error.message || "Не удалось сохранить порядок уроков")
        } finally {
            setIsSavingOrder(false)
        }
    }

    useEffect(() => {

        if (courseId && token) {
            loadLessons()
        }
    }, [courseId, token])

    if (loading) {
        return <p className="py-6 text-center text-sm text-muted-foreground">
            Загрузка уроков...
        </p>
    }

    if (error) {
        return <p className="py-6 text-center text-sm text-destructive">
            {error}
        </p>
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-2">
                {isReorderMode ? (
                    <>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancelReorder}
                            disabled={isSavingOrder}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSaveOrder}
                            disabled={isSavingOrder}
                        >
                            {isSavingOrder ? "Сохранение..." : "Сохранить порядок"}
                        </Button>
                    </>
                ) : (
                    <>
                        {lessons.length > 1 && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleStartReorder}
                            >
                                Изменить порядок
                            </Button>
                        )}

                        <Button onClick={() => setCreateDialogOpen(true)}>
                            Добавить урок
                        </Button>
                    </>
                )}
            </div>

            {orderError && (
                <p className="text-sm text-destructive">{orderError}</p>
            )}

            {lessons.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                    В этом курсе пока нет уроков
                </p>
            ) : isReorderMode ? (
                <SortableLessonsList
                    lessons={reorderedLessons}
                    onReorder={handleReorder}
                />
            ) : (
                <div className="space-y-2">
                    {lessons.map((lesson) => (
                        <LessonItem
                            key={lesson.id}
                            lesson={lesson}
                            onEdit={setSelectedLesson}
                        />
                    ))}
                </div>
            )}

            <CreateLessonDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                courseId={courseId}
                token={token}
                onLessonCreated={loadLessons}
            />

            <LessonEditPanel
                open={Boolean(selectedLesson)}
                onOpenChange={(open) => {
                    if (!open) setSelectedLesson(null)
                }}
                lesson={selectedLesson}
                courseId={courseId}
                token={token}
                onLessonUpdated={loadLessons}
            />
        </div>
    )
}

export default CourseLessonsTab