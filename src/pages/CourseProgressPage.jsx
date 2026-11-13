import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { getCourseProgress } from "@/api/courses"
import { useAuth } from "@/contexts/AuthContext"

import CourseProgressHeader from "@/components/learning/CourseProgressHeader"
import CourseProgressLessonsList from "@/components/learning/CourseProgressLessonsList"

function CourseProgressPage() {
  const { courseId } = useParams()
  const { token, user, loading: authLoading } = useAuth()

  const [progress, setProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authLoading) return

    if (!user || !token) {
      setLoading(false)
      return
    }

    async function loadProgress() {
      try {
        setLoading(true)
        setError("")

        const data = await getCourseProgress(token, courseId)
        setProgress(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [courseId, token, user, authLoading])

  if (authLoading || loading) {
    return <p className="p-6">Загрузка...</p>
  }

  if (!user) {
    return (
      <p className="p-6">
        Войдите в аккаунт, чтобы посмотреть прогресс курса.
      </p>
    )
  }

  if (error) {
    return (
      <p className="p-6 text-destructive">
        {error}
      </p>
    )
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <CourseProgressHeader
        course={progress} 
      />

      <CourseProgressLessonsList
        lessons={progress.lessons}
        courseId={courseId}
      />
    </div>
  )
}

export default CourseProgressPage