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
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  )
}

export default CourseGrid