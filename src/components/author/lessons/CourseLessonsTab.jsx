import { useEffect, useState } from "react"
import { getCourseLessons, reorderCourseLessons } from "@/api/lessons"
import { Button } from "@/components/ui/button"

import { Plus, ArrowUpDown } from "lucide-react"

import CreateLessonDialog from "@/components/author/lessons/CreateLessonDialog"
import LessonItem from "@/components/author/lessons/LessonItem"
import SortableLessonsList from "@/components/author/lessons/SortableLessonsList"

function CourseLessonsTab({ 
    courseId, 
    token, 
    onEditLesson,
    onReorderModeChange,
    isReorderMode,
}) {
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
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
        onReorderModeChange(true)
    }

    function handleCancelReorder() {
        setReorderedLessons([])
        onReorderModeChange(false)
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
            onReorderModeChange(false)
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
                                size="sm"
                                onClick={handleStartReorder}
                            >
                                <ArrowUpDown className="mr-2 h-4 w-4" />
                                Порядок
                            </Button>
                        )}

                        <Button
                            type="button"
                            size="sm"
                            onClick={() => setCreateDialogOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Добавить
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
                            onEdit={onEditLesson}
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

        </div>
    )
}

export default CourseLessonsTab