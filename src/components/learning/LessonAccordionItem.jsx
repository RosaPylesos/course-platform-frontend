import { useNavigate } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

function LessonAccordionItem({ lesson, courseId }) {
  const navigate = useNavigate()

  let status

  if (lesson.is_completed) {
    status = {
      label: "Завершён",
      variant: "success",
    }
  } else if (lesson.is_started) {
    status = {
      label: "В процессе",
      variant: "default",
    }
  } else {
    status = {
      label: "Не начат",
      variant: "secondary",
    }
  }

  return (
    <AccordionItem value={lesson.lesson_id}>
      <AccordionTrigger>
        <div className="flex flex-1 items-center gap-3 pr-3">
          <span className="text-sm text-muted-foreground">
            {lesson.position}
          </span>

          <span className="flex-1 text-left font-medium">
            {lesson.lesson_name}
          </span>

          <Badge variant={status.variant}>
            {status.label}
          </Badge>
        </div>
      </AccordionTrigger>

      <AccordionContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {lesson.description}
          </p>

          <Button 
            className="mx-auto"
            onClick={() =>
              navigate(`/courses/${courseId}/lessons/${lesson.lesson_id}`, {
                state: {
                  isCompleted: lesson.is_completed,
                },
              })
            }
          >
            Перейти к уроку
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

export default LessonAccordionItem