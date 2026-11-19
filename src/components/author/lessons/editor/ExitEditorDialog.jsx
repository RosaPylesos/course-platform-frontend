import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

function ExitEditorDialog({
    open,
    onOpenChange,
    onSaveAndExit,
    onExitWithoutSaving,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Есть несохранённые изменения
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Сохранить изменения перед выходом из редактора?
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Остаться
                    </AlertDialogCancel>

                    <AlertDialogAction
                        onClick={onExitWithoutSaving}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Выйти без сохранения
                    </AlertDialogAction>

                    <AlertDialogAction onClick={onSaveAndExit}>
                        Сохранить и выйти
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ExitEditorDialog