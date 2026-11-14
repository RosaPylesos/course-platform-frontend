import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { updateLesson, deleteLesson } from "@/api/lessons"

import DeleteLessonDialog from "@/components/author/lessons/DeleteLessonDialog"

function LessonEditPanel({
    open,
    onOpenChange,
    lesson,
    courseId,
    token,
    onLessonUpdated,
}) {

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
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Редактирование урока</SheetTitle>
                        <SheetDescription>
                            Изменение названия и описания урока.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 px-4">
                        <div className="space-y-2">
                            <Label htmlFor="lesson-edit-name">Название урока</Label>
                            <Input
                                id="lesson-edit-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="lesson-edit-description">Описание</Label>
                            <Textarea
                                id="lesson-edit-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                rows={5}
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex justify-end gap-2 mx-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSave}
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                        </Button>
                    </div>

                    <div className="flex justify-start px-4">
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Удалить урок
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
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