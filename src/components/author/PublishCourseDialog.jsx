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

function PublishCourseDialog({
    open,
    onOpenChange,
    courseName,
    onConfirm,
    isPublishing,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Опубликовать курс?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Курс «{courseName}» станет доступен пользователям платформы.
                        Вы сможете продолжить редактирование курса после публикации.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPublishing}>
                        Отмена
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isPublishing}
                    >
                        {isPublishing ? "Публикация..." : "Опубликовать"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default PublishCourseDialog