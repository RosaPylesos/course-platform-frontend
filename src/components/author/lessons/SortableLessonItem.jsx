import { GripVertical } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

function SortableLessonItem({ lesson }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lesson.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 rounded-lg border bg-card p-3 ${
                isDragging ? "opacity-50 z-10" : ""
            }`}
        >
            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                {...attributes}
                {...listeners}
            >
                <GripVertical size={20} />
            </button>

            <span className="flex-1 font-medium">
                {lesson.name}
            </span>
        </div>
    )
}

export default SortableLessonItem