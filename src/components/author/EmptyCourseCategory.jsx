import {
    Empty,
    EmptyHeader,
    EmptyTitle,
    EmptyDescription,
} from "@/components/ui/empty"

const categoryMessages = {
    draft: {
        title: "Черновиков пока нет",
        description: "Здесь будут отображаться курсы, которые ещё не опубликованы.",
    },
    published: {
        title: "Опубликованных курсов пока нет",
        description: "Здесь будут отображаться ваши опубликованные курсы.",
    },
    archived: {
        title: "Архив пуст",
        description: "Здесь будут отображаться курсы, отправленные в архив.",
    },
}

function EmptyCourseCategory({ status }) {
    const message = categoryMessages[status]

    if (!message) return null

    return (
        <Empty className="border">
            <EmptyHeader>
                <EmptyTitle>{message.title}</EmptyTitle>
                <EmptyDescription>
                    {message.description}
                </EmptyDescription>
            </EmptyHeader>
        </Empty>
    )
}

export default EmptyCourseCategory