function EditorLayout({ header, palette, canvas }) {
    return (
        <div className="flex min-h-screen flex-col">
            // "Header"
            <div className="border-b">
                {header}
            </div>

            <div className="flex flex-1">
                // Palette
                <aside className="w-64 shrink-0 border-r p-4">
                    {palette}
                </aside>

                // Canvas
                <main className="min-w-0 flex-1 p-6">
                    {canvas}
                </main>
            </div>
        </div>
    )
}

export default EditorLayout