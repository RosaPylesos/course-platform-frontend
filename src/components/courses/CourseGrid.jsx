import CourseCard from "./CourseCard"

function CourseGrid({ courses }) {
  if (courses.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        Курсы не найдены.
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export default CourseGrid