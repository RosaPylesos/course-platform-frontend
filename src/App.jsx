import { BrowserRouter, Routes, Route } from "react-router-dom"

import HomePage from "@/pages/HomePage"
import CatalogPage from "@/pages/CatalogPage"
import CoursePage from "@/pages/CoursePage"
import LoginPage from "@/pages/LoginPage"
import MyLearningPage from "@/pages/MyLearningPage"
import CourseProgressPage from "@/pages/CourseProgressPage"
import ProfilePage from "@/pages/ProfilePage"
import LessonPage from "@/pages/LessonPage"
import AuthorsCoursesPage from "@/pages/AuthorsCoursesPage"

import Header from "@/components/layout/Header"

function App() {
  return (
    <BrowserRouter>
      
      <Header />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses" element={<CatalogPage />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/my-learning" element={<MyLearningPage />} />
        <Route
          path="/courses/:courseId/progress"
          element={<CourseProgressPage />}
        />
        <Route
          path="/courses/:courseId/lessons/:lessonId"
          element={<LessonPage />}
        />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/author/courses"
          element={<AuthorsCoursesPage />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App