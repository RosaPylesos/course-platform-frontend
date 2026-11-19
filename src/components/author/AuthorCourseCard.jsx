import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import AuthorCourseActions from "./AuthorCourseActions"

const statusLabels = {
    draft: "Черновик",
    published: "Опубликован",
    archived: "В архиве",
}

const statusVariants = {
    draft: "secondary",
    published: "default",
    archived: "outline",
}

function formatDate(dateString) {
    return new Intl.DateTimeFormat("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(dateString))
}

function AuthorCourseCard({ 
    course, 
    onManage, 
    token, 
    onCourseUpdated, 
}) {
    return (
        <article className="flex flex-col overflow-hidden rounded-xl border bg-card">
            <div className="aspect-video bg-muted">
                {course.thumbnail_path ? (
                    <img
                        src={course.thumbnail_path}
                        alt={course.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        Нет обложки
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-xs text-muted-foreground">
                        {course.topic?.name || "Тема не указана"}
                    </span>

                    <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={statusVariants[course.status] ?? "secondary"}>
                            {statusLabels[course.status] ?? course.status}
                        </Badge>

                        <AuthorCourseActions 
                            course={course}
                            onManage={onManage}
                            token={token}
                            onCourseUpdated={onCourseUpdated}
                        />
                    </div>
                </div>

                <h2 className="text-lg font-semibold">
                    {course.name}
                </h2>

                {course.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                        {course.tags.map((tag) => (
                            <span
                                key={tag.id}
                                className="rounded-md bg-muted px-2 py-1 text-xs"
                            >
                                {tag.name}
                            </span>
                        ))}
                    </div>
                )}

                <div className="mt-auto space-y-1 border-t pt-3 text-xs text-muted-foreground">
                    <p>
                        Создан: {formatDate(course.created_at)}
                    </p>

                    <p>
                        Изменён: {formatDate(course.updated_at)}
                    </p>
                </div>

                <Button
                    className="w-full"
                    onClick={() => onManage?.(course)}
                >
                    Управлять курсом
                </Button>
            </div>
        </article>
    )
}

export default AuthorCourseCard