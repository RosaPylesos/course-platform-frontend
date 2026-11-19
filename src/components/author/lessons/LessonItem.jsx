import { Button } from "@/components/ui/button"

function LessonItem({ lesson, onEdit }) {
    return (
        <div className="flex items-center gap-3 rounded-lg border p-3">
            <span className="text-sm font-medium text-muted-foreground">
                {lesson.position}.
            </span>

            <span className="flex-1 font-medium">
                {lesson.name}
            </span>

            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(lesson)}
            >
                Редактировать
            </Button>
        </div>
    )
}

export default LessonItem