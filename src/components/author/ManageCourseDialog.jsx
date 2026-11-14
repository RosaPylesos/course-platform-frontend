import { useAuth } from "@/contexts/AuthContext"
import { updateCourse } from "@/api/courses"
import { 
    getTagCategories, 
    addCourseTag, 
    removeCourseTag,
} from "@/api/tags"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import CourseFormFields from "@/components/author/CourseFormFields"
import CourseLessonsTab from "@/components/author/lessons/CourseLessonsTab"

function ManageCourseDialog({ 
    open, 
    onOpenChange, 
    course, 
    topics,
    onCourseUpdated,
}) {

    const { token } = useAuth()

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [topic, setTopic] = useState(null)
    const [difficulty, setDifficulty] = useState("beginner")
    const [thumbnailPath, setThumbnailPath] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState("")
    const [tagCategories, setTagCategories] = useState([])
    const [selectedTagIds, setSelectedTagIds] = useState([])
    const [initialTagIds, setInitialTagIds] = useState([])

    async function handleSave() {
        if (!name.trim() || !topic) return

        setFormError("")
        setIsSubmitting(true)

        try {
            await updateCourse({
                courseId: course.id,
                topic_id: topic.id,
                name: name.trim(),
                description: description.trim(),
                difficulty,
                thumbnail_path: thumbnailPath.trim(),
                token,
            })
            const tagsToAdd = selectedTagIds.filter(
                (id) => !initialTagIds.includes(id)
            )
            const tagsToRemove = initialTagIds.filter(
                (id) => !selectedTagIds.includes(id)
            )

            await Promise.all([
                ...tagsToAdd.map((tagId) =>
                    addCourseTag(course.id, tagId, token)
                ),
                ...tagsToRemove.map((tagId) =>
                    removeCourseTag(course.id, tagId, token)
                ),
            ])
            await onCourseUpdated()

            onOpenChange(false)
        } catch (error) {
            console.error("Не удалось обновить курс:", error)
            setFormError(error.message || "Не удалось обновить курс")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleTagToggle(tagId) {
        setSelectedTagIds((current) =>
            current.includes(tagId)
                ? current.filter((id) => id !== tagId)
                : [...current, tagId]
        )
    }

    useEffect(() => {
        if (course) {
            setName(course.name || "")
            setDescription(course.description || "")
            setTopic(course.topic || null)
            setDifficulty(course.difficulty || "beginner")
            setThumbnailPath(course.thumbnail_path || "")
            const courseTagIds = course.tags?.map((tag) => tag.id || [])

            setSelectedTagIds(courseTagIds)
            setInitialTagIds(courseTagIds)
        }
    }, [course])

    useEffect(() => {
        if (!open) return

        async function loadTagCategories() {
            try {
                const data = await getTagCategories()
                setTagCategories(data)
                console.log("Категории тегов:", data)
            } catch (error) {
                console.error("Не удалось загрузить категории тегов:", error)
            }
        }

        loadTagCategories()
    }, [open])

    if (!course) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        Управление курсом
                    </DialogTitle>
                </DialogHeader>

                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="general">Основное</TabsTrigger>
                        <TabsTrigger value="tags">Теги</TabsTrigger>
                        <TabsTrigger value="lessons">Уроки</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general">
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
                    </TabsContent>

                    <TabsContent value="tags" className="space-y-6">
                        {tagCategories.map((category) => (
                            <div key={category.id} className="space-y-3">
                                <h3 className="font-medium">{category.name}</h3>

                                <div className="flex flex-wrap gap-2">
                                    {category.tags.map((tag) => {
                                        const isSelected = selectedTagIds.includes(tag.id)

                                        return (
                                            <Button
                                                key={tag.id}
                                                type="button"
                                                size="sm"
                                                variant={isSelected ? "default" : "outline"}
                                                onClick={() => handleTagToggle(tag.id)}
                                            >
                                                {tag.name}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </TabsContent>

                    <TabsContent value="lessons">
                        <CourseLessonsTab 
                            courseId={course.id} 
                            token={token} 
                        />
                    </TabsContent>
                </Tabs>
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
                        disabled={!name.trim() || !topic || isSubmitting}
                        onClick={handleSave}
                    >
                        {isSubmitting ? "Сохранение..." : "Сохранить изменения"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ManageCourseDialog