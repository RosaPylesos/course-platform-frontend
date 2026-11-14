import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    verticalListSortingStrategy,
    arrayMove,
} from "@dnd-kit/sortable"

import SortableLessonItem from "@/components/author/lessons/SortableLessonItem"

function SortableLessonsList({ lessons, onReorder }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    )

    function handleDragEnd(event) {
        const { active, over } = event

        if (!over || active.id === over.id) return

        const oldIndex = lessons.findIndex(
            (lesson) => lesson.id === active.id
        )
        const newIndex = lessons.findIndex(
            (lesson) => lesson.id === over.id
        )

        onReorder(arrayMove(lessons, oldIndex, newIndex))
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={lessons.map((lesson) => lesson.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {lessons.map((lesson) => (
                        <SortableLessonItem
                            key={lesson.id}
                            lesson={lesson}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    )
}

export default SortableLessonsList