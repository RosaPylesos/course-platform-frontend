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

function AssignAuthorDialog({
    open,
    onOpenChange,
    user,
    onConfirm,
    isSubmitting,
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Назначить пользователя автором?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Пользователь {user?.name} {user?.surname} получит роль автора.
                        Это действие нельзя отменить.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isSubmitting}>
                        Отмена
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={isSubmitting}
                        onClick={(event) => {
                            event.preventDefault()
                            onConfirm()
                        }}
                    >
                        {isSubmitting ? "Назначение..." : "Назначить автором"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default AssignAuthorDialog