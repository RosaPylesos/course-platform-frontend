import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { updateLesson, deleteLesson } from "@/api/lessons"

import { FilePenLine, Trash2 } from "lucide-react"
import DeleteLessonDialog from "@/components/author/lessons/DeleteLessonDialog"

function LessonEditPanel({
    open,
    onOpenChange,
    lesson,
    courseId,
    token,
    onLessonUpdated,
}) {

    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleSave() {
        if (!lesson || !name.trim()) return

        setError("")
        setIsSubmitting(true)

        try {
            await updateLesson(
                courseId,
                lesson.id,
                {
                    name: name.trim(),
                    description: description.trim(),
                },
                token
            )

            await onLessonUpdated()
            onOpenChange(false)
        } catch (error) {
            console.error("Не удалось обновить урок:", error)
            setError(error.message || "Не удалось обновить урок")
        } finally {
            setIsSubmitting(false)
        }
    }

    async function handleDelete() {
        setIsDeleting(true)
        setError("")

        try {
            await deleteLesson(courseId, lesson.id, token)
            await onLessonUpdated()
            setDeleteDialogOpen(false)
            onOpenChange(false)
        } catch (error) {
            console.error("Не удалось удалить урок:", error)
            setError(error.message || "Не удалось удалить урок")
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        if (lesson) {
            setName(lesson.name || "")
            setDescription(lesson.description || "")
        }
    }, [lesson])

    if (!lesson) return null

    return (
        <>
            {open && (
                <div className="w-[min(20rem,35vw)] min-w-0 shrink-0 rounded-lg border bg-background p-5 flex flex-col gap-5">
                    <div className="space-y-1">
                        <h2 className="text-lg font-semibold">
                            Редактирование урока
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Изменение названия и описания урока.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="lesson-edit-name">
                                Название урока
                            </Label>
                            <Input
                                id="lesson-edit-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lesson-edit-description">
                                Описание
                            </Label>
                            <Textarea
                                id="lesson-edit-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="w-fit"
                        onClick={() =>
                            navigate(`/author/courses/${courseId}/lessons/${lesson.id}/edit`)
                        }
                    >
                        <FilePenLine className="mr-2 h-4 w-4" />
                        Редактировать содержимое
                    </Button>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="mt-auto border-t pt-4 flex items-center justify-between gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Удалить
                        </Button>

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => onOpenChange(false)}
                                disabled={isSubmitting}
                            >
                                Отмена
                            </Button>

                            <Button
                                type="button"
                                size="sm"
                                onClick={handleSave}
                                disabled={!name.trim() || isSubmitting}
                            >
                                {isSubmitting ? "Сохранение..." : "Сохранить"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <DeleteLessonDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                lesson={lesson}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default LessonEditPanel