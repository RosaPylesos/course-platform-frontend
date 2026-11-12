import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

function CourseProgressHeader({ course }) {
  const progressPercent =
    course.lessons_total > 0
      ? Math.round(
          (course.lessons_completed / course.lessons_total) * 100
        )
      : 0

  const difficultyLabels = {
    beginner: "Начальный",
    intermediate: "Средний",
    advanced: "Продвинутый",
  }

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">
          {course.course_name}
        </h1>

        <Badge variant="secondary">
          {difficultyLabels[course.course_difficulty] ??
            course.course_difficulty}
        </Badge>
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold">
            Прогресс обучения
          </h2>

          <span className="text-sm font-medium">
            {progressPercent}%
          </span>
        </div>

        <Progress value={progressPercent} />

        <p className="text-sm text-muted-foreground">
          Завершено {course.lessons_completed} из{" "}
          {course.lessons_total} уроков
        </p>
      </div>
    </section>
  )
}

export default CourseProgressHeader