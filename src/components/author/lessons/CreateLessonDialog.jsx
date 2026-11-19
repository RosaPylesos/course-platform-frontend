import { useState } from "react"
import { createLesson } from "@/api/lessons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

function CreateLessonDialog({
    open,
    onOpenChange,
    courseId,
    token,
    onLessonCreated,
}) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")

    async function handleSubmit() {
        if (!name.trim()) return

        setError("")
        setIsSubmitting(true)

        try {
            await createLesson(
                courseId,
                {
                    name: name.trim(),
                    description: description.trim(),
                },
                token
            )

            await onLessonCreated()
            setName("")
            setDescription("")
            onOpenChange(false)
        } catch (error) {
            console.error("Не удалось создать урок:", error)
            setError(error.message || "Не удалось создать урок")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Создание урока</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="lesson-name">Название урока</Label>
                        <Input
                            id="lesson-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Например, Введение"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lesson-description">Описание</Label>
                        <Textarea
                            id="lesson-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Краткое описание урока..."
                            rows={4}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-destructive">{error}</p>
                    )}

                    <div className="flex justify-end gap-2">
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
                            onClick={handleSubmit}
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? "Создание..." : "Создать урок"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateLessonDialog