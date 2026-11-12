import { Link } from "react-router-dom"

import CourseCarousel from "@/components/courses/CourseCarousel"

function CourseSection({ topic, courses }) {

  // console.log("Home topic:", topic)
  // console.log("Has children:", topic.has_children)

  const searchParams = new URLSearchParams({
    topic: topic.id,
  })

  if (topic.has_children) {
    searchParams.set("include_descendants", "true")
  }

  // console.log("Generated URL:", `/courses?${searchParams.toString()}`)

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">
          {topic.name}
        </h2>

        <Link
          to={`/courses?${searchParams.toString()}`}
          className="shrink-0 text-sm font-medium text-primary hover:underline"
        >
          Перейти →
        </Link>
      </div>

      <CourseCarousel courses={courses} />
    </section>
  )
}

export default CourseSection