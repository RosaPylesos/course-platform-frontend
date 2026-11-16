import { useDroppable } from "@dnd-kit/core"

function BlockInsertionZone({ index, disabled = false }) {
    const { setNodeRef, isOver } = useDroppable({
        id: `insertion-${index}`,
        disabled,
        data: {
            source: "insertion",
            index,
        },
    })

    return (
        <div
            ref={setNodeRef}
            className="group flex h-4 items-center justify-center"
        >
            <div
                className={`h-0.5 w-full rounded-full transition-colors ${
                    isOver && !disabled
                        ? "bg-primary"
                        : "bg-transparent group-hover:bg-border"
                }`}
            />
        </div>
    )
}

export default BlockInsertionZone