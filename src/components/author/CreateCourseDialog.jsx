import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { createCourse } from "@/api/courses"
import { useAuth } from "@/contexts/AuthContext"

import TopicPicker from "./TopicPicker"

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

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="course-name">Название курса</Label>
                        <Input
                            id="course-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Например, Основы Python"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="course-description">Описание</Label>
                        <Textarea
                            id="course-description"
                            value={description}
                            onChange={(event) => setDescription(event.target.value)}
                            placeholder="Расскажите, чему научатся ученики..."
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Тема</Label>
                        <TopicPicker
                            topics={topics}
                            value={topic?.id}
                            onChange={setTopic}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Сложность</Label>

                        <Select
                            value={difficulty}
                            onValueChange={setDifficulty}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Выберите сложность" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="beginner">Начальный</SelectItem>
                                <SelectItem value="intermediate">Средний</SelectItem>
                                <SelectItem value="advanced">Продвинутый</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="course-thumbnail">Ссылка на обложку</Label>
                        <Input
                            id="course-thumbnail"
                            type="url"
                            value={thumbnailPath}
                            onChange={(event) => setThumbnailPath(event.target.value)}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                </div>

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