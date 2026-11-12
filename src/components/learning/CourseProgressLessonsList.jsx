import {
  Accordion,
} from "@/components/ui/accordion"

import LessonAccordionItem from "@/components/learning/LessonAccordionItem"

function CourseProgressLessonsList({ lessons }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold">
        Уроки курса
      </h2>

      {lessons.length > 0 ? (
        <Accordion type="multiple" className="w-full">
          {lessons.map((lesson) => (
            <LessonAccordionItem
              key={lesson.lesson_id}
              lesson={lesson}
            />
          ))}
        </Accordion>
      ) : (
        <p className="py-6 text-center text-muted-foreground">
          В этом курсе пока нет уроков.
        </p>
      )}
    </section>
  )
}

export default CourseProgressLessonsList