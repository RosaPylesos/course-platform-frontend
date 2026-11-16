import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import { Item, ItemContent, ItemTitle } from "@/components/ui/item"
import { GripVertical } from "lucide-react"

function DraggablePaletteItem({ block, onAddBlock }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({
            id: `palette-${block.type}`,
            data: {
                source: "palette",
                type: block.type,
            },
        })

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <Item
            ref={setNodeRef}
            style={style}
            variant="outline"
            className="flex items-center"
        >
            <ItemContent
                className="cursor-pointer"
                onClick={() => onAddBlock(block.type)}
            >
                <ItemTitle>{block.label}</ItemTitle>
            </ItemContent>

            <button
                type="button"
                className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
                {...listeners}
                {...attributes}
                aria-label={`Перетащить блок: ${block.label}`}
            >
                <GripVertical className="size-4" />
            </button>
        </Item>
    )
}

export default DraggablePaletteItem