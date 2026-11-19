import DraggablePaletteItem from "./DraggablePaletteItem"

const blockTypes = [
    { type: "heading", label: "Заголовок" },
    { type: "text", label: "Текст" },
    { type: "image", label: "Изображение" },
    { type: "video", label: "Видео" },
    { type: "callout", label: "Заметка" },
    { type: "code", label: "Код" },
]

function BlockPalette({ onAddBlock }) {
    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold">Блоки</h2>

            <div className="space-y-2">
                {blockTypes.map((block) => (
                    <DraggablePaletteItem
                        key={block.type}
                        block={block}
                        onAddBlock={onAddBlock}
                    />
                ))}
            </div>
        </div>
    )
}

export default BlockPalette