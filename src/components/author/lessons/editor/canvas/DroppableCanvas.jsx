import { useDroppable } from "@dnd-kit/core"

function DroppableCanvas({ children }) {
    const { setNodeRef, isOver } = useDroppable({
        id: "lesson-canvas",
        data: {
            source: "canvas",
        },
    })

    return (
        <div
            ref={setNodeRef}
            className={`min-h-40 rounded-lg transition-colors ${
                isOver ? "bg-muted/50" : ""
            }`}
        >
            {children}
        </div>
    )
}

export default DroppableCanvas