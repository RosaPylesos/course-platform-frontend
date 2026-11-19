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

function ArchiveCourseDialog({
    open,
    onOpenChange,
    courseName,
    onConfirm,
    isArchiving,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Архивировать курс?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Курс «{courseName}» будет перемещён в архив и станет недоступен пользователям.
                        <span className="mt-2 block font-medium text-destructive">
                            Внимание: архивация необратима. Восстановить курс после этого действия нельзя.
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isArchiving}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isArchiving}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isArchiving ? "Архивация..." : "Архивировать"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default ArchiveCourseDialog