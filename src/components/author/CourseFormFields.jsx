import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import TopicPicker from "@/components/author/TopicPicker"

function CourseFormFields({
    name,
    onNameChange,
    description,
    onDescriptionChange,
    topic,
    onTopicChange,
    difficulty,
    onDifficultyChange,
    thumbnailPath,
    onThumbnailPathChange,
    topics,
}) {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="course-name">Название курса</Label>
                <Input
                    id="course-name"
                    value={name}
                    onChange={(event) => onNameChange(event.target.value)}
                    placeholder="Например, Основы Python"
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="course-description">Описание</Label>
                <Textarea
                    id="course-description"
                    value={description}
                    onChange={(event) => onDescriptionChange(event.target.value)}
                    placeholder="Расскажите, чему научатся ученики..."
                    rows={4}
                />
            </div>

            <div className="space-y-2">
                <Label>Тема</Label>
                <TopicPicker
                    topics={topics}
                    value={topic?.id}
                    onChange={onTopicChange}
                />
            </div>

            <div className="space-y-2">
                <Label>Сложность</Label>
                <Select
                    value={difficulty}
                    onValueChange={onDifficultyChange}
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
                    onChange={(event) => onThumbnailPathChange(event.target.value)}
                    placeholder="https://example.com/image.jpg"
                />
            </div>
        </div>
    )
}

export default CourseFormFields