import EditorHeader from "./EditorHeader"
import BlockPalette from "./palette/BlockPalette"

function EditorLayout({ header, palette, canvas }) {
    return (
        <div className="flex min-h-screen flex-col">
            {/* Верхняя панель */}
            <div className="border-b">
                {header}
            </div>

            <div className="flex flex-1">
                {/* Левая панель */}
                <aside className="w-64 shrink-0 border-r p-4">
                    {palette}
                </aside>

                {/* Центральная область */}
                <main className="min-w-0 flex-1 p-6">
                    {canvas}
                </main>
            </div>
        </div>
    )
}

export default EditorLayout