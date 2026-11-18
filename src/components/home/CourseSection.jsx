import { Link } from "react-router-dom"

import CourseCarousel from "@/components/courses/CourseCarousel"

function CourseSection({ topic, courses }) {

    const searchParams = new URLSearchParams()

    if (topic.has_children) {
        searchParams.set("topic", topic.id)
        searchParams.set("include_descendants", "true")
    } else {
        searchParams.set("topics", topic.slug)
    }

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