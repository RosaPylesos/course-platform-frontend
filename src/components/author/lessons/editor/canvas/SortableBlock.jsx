import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
    GripVertical,
    Heading,
    Type,
    Image,
    Video,
    MessageSquare,
    Code,
    Pencil,
    Trash2,
} from "lucide-react"

import BlockEditor from "./editors/BlockEditor"
import DeleteBlockDialog from "./DeleteBlockDialog"

const blockTypes = {
    heading: { label: "Заголовок", icon: Heading },
    text: { label: "Текст", icon: Type },
    image: { label: "Изображение", icon: Image },
    video: { label: "Видео", icon: Video },
    callout: { label: "Заметка", icon: MessageSquare },
    code: { label: "Код", icon: Code },
}

function SortableBlock({ block, onUpdate, onDelete }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: block.id,
        data: {
            source: "canvas",
        },
    })

    const blockInfo = blockTypes[block.type]
    const BlockIcon = blockInfo?.icon

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="rounded-lg border bg-card"
        >
            <div className="flex items-center gap-3 border-b px-3 py-2">
                <button
                    type="button"
                    className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                    {...attributes}
                    {...listeners}
                    aria-label={`Переместить блок: ${blockInfo?.label}`}
                >
                    <GripVertical className="size-4" />
                </button>

                {BlockIcon && (
                    <BlockIcon className="size-4 text-muted-foreground" />
                )}

                <span className="text-sm font-medium">
                    {blockInfo?.label ?? "Блок"}
                </span>

                <div className="ml-auto flex items-center gap-1">
                    <button
                        type="button"
                        className="rounded p-2 text-muted-foreground hover:bg-muted"
                        aria-label="Редактировать блок"
                        onClick={() => setIsEditing((current) => !current)}
                    >
                        <Pencil className="size-4" />
                    </button>

                    <button
                        type="button"
                        className="rounded p-2 text-muted-foreground hover:bg-muted"
                        aria-label="Удалить блок"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="size-4" />
                    </button>
                </div>
            </div>

            <div className="p-4">
                <BlockEditor
                    block={block}
                    isEditing={isEditing}
                    onUpdate={onUpdate}
                />
            </div>

            <DeleteBlockDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                blockName={blockInfo?.label ?? "Блок"}
                onConfirm={() => {
                    onDelete(block.id)
                    setIsDeleteDialogOpen(false)
                }}
            />
        </div>
    )
}

export default SortableBlock