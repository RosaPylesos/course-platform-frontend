import { useParams } from "react-router-dom"

function CoursePage() {
  const { courseId } = useParams()

  return (
    <h1 className="text-3xl font-bold">
      Страница курса №{courseId}
    </h1>
  )
}

export default CoursePage