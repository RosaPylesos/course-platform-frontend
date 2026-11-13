import { Button } from "@/components/ui/button"
import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
    EmptyContent,
} from "@/components/ui/empty"

function EmptyCourses({ onCreateClick }) {
    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyTitle>У вас пока нет курсов</EmptyTitle>
                <EmptyDescription>
                    Создайте свой первый курс, чтобы поделиться знаниями с учениками.
                </EmptyDescription>
            </EmptyHeader>

            <EmptyContent>
                <Button onClick={onCreateClick}>
                    Создать первый курс
                </Button>
            </EmptyContent>
        </Empty>
    )
}

export default EmptyCourses