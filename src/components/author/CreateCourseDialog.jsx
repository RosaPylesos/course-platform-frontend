import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { createCourse } from "@/api/courses"
import { useAuth } from "@/contexts/AuthContext"

import CourseFormFields from "./CourseFormFields"

function CreateCourseDialog({ open, onOpenChange, topics, onCourseCreated }) {
    
    const { token } = useAuth()

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [topic, setTopic] = useState(null)
    const [difficulty, setDifficulty] = useState("beginner")
    const [thumbnailPath, setThumbnailPath] = useState("")
    const [formError, setFormError] = useState("")

    useEffect(() => {
        if (!open) {
            setName("")
            setDescription("")
            setTopic(null)
            setDifficulty("beginner")
            setThumbnailPath("")
            setFormError("")
        }
    }, [open])

    async function handleSubmit() {
        if (!name.trim() || !topic) return

        setFormError("")
        setIsSubmitting(true)

        try {
            await createCourse({
                topic_id: topic.id,
                name: name.trim(),
                description: description.trim(),
                difficulty,
                thumbnail_path: thumbnailPath.trim(),
                token,
            })

            await onCourseCreated()

            onOpenChange(false)
        } catch (error) {
            console.error("Не удалось создать курс:", error)
            setFormError(error.message || "Не удалось создать курс")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                    <DialogTitle>Создание курса</DialogTitle>
                    <DialogDescription>
                        Заполните основную информацию о будущем курсе.
                    </DialogDescription>
                </DialogHeader>

                <CourseFormFields
                    name={name}
                    onNameChange={setName}
                    description={description}
                    onDescriptionChange={setDescription}
                    topic={topic}
                    onTopicChange={setTopic}
                    difficulty={difficulty}
                    onDifficultyChange={setDifficulty}
                    thumbnailPath={thumbnailPath}
                    onThumbnailPathChange={setThumbnailPath}
                    topics={topics}
                />

                {formError && (
                    <p className="text-sm text-destructive">{formError}</p>
                )}

                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Отмена
                    </Button>

                    <Button 
                        type="button" 
                        disabled={!name.trim() || !topic}
                        onClick={handleSubmit}
                    >
                        Создать курс
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreateCourseDialog