import { Button } from "@/components/ui/button"

function EditorHeader({ 
    lessonName, 
    onPreview, 
    onSave, 
    onExit,
    hasUnsavedChanges,
    isSaving,
    saveError,
    isPreview,
}) {
    return (
        <header className="flex items-center justify-between gap-4 px-6 py-3">
            <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold">
                    {lessonName || "Новый урок"}
                </h1>
                <p className="text-sm text-muted-foreground">
                    Редактор содержимого
                </p>
            </div>

            {saveError && (
                <p className="text-sm text-destructive" role="alert">
                    {saveError}
                </p>
            )}

            <div className="flex shrink-0 items-center gap-2">
                <Button variant="outline" onClick={onPreview}>
                    {isPreview ? "Вернуться к редактированию" : "Предпросмотр"}
                </Button>

                <Button 
                    onClick={onSave} 
                    disabled={!hasUnsavedChanges || isSaving}
                >
                    {isSaving ? "Сохранение" : "Сохранить"}
                </Button>

                <Button variant="ghost" onClick={onExit}>
                    Выйти
                </Button>
            </div>
        </header>
    )
}

export default EditorHeader