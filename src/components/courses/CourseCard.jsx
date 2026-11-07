import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

const difficultyLabels = {
  beginner: "Начальный",
  intermediate: "Средний",
  advanced: "Продвинутый",
}

function CourseCard({ course }) {
  const authorName = [
    course.author?.name,
    course.author?.surname,
  ]
    .filter(Boolean)
    .join(" ")

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
          <span className="text-xs text-muted-foreground">
            {course.topic?.name}
          </span>

          <span className="rounded-full bg-secondary px-2 py-1 text-xs">
            {difficultyLabels[course.difficulty] ?? course.difficulty}
          </span>
        </div>

        <h2 className="text-lg font-semibold">
          {course.name}
        </h2>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {course.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1">
          {course.tags?.map((tag) => (
            <span
              key={tag.id}
              className="rounded-md bg-muted px-2 py-1 text-xs"
            >
              {tag.name}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <span className="text-muted-foreground">
            {authorName || "Автор не указан"}
          </span>

          <span className="text-muted-foreground">
            {course.lesson_count} уроков
          </span>
        </div>

        <Button asChild className="w-full">
          <Link to={`/courses/${course.id}`}>
            Подробнее
          </Link>
        </Button>
      </div>
    </article>
  )
}

export default CourseCard