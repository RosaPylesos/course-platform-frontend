import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import HomePage from "@/pages/HomePage"
import CatalogPage from "@/pages/CatalogPage"
import CoursePage from "@/pages/CoursePage"
import LoginPage from "@/pages/LoginPage"
import MyLearningPage from "@/pages/MyLearningPage"
import CourseProgressPage from "@/pages/CourseProgressPage"
import ProfilePage from "@/pages/ProfilePage"
import LessonPage from "@/pages/LessonPage"
import AuthorsCoursesPage from "@/pages/AuthorsCoursesPage"
import LessonEditorPage from "@/pages/LessonEditorPage"
import AdminPage from "@/pages/AdminPage"
import NotFoundPage from "@/pages/NotFoundPage"
import AboutPage from "@/pages/AboutPage"

import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

import AdminRoute from "@/routes/AdminRoute"
import AuthorRoute from "@/routes/AuthorRoute"
import ProtectedRoute from "@/routes/ProtectedRoute"

function AppLayout() {
    const { pathname } = useLocation()

    return (
        <div className="flex min-h-screen flex-col">
            {pathname !== "/login" && <Header />}

            <main className="flex-1">
                <Routes>
                    <Route 
                        path="/" 
                        element={
                            <HomePage />
                        } 
                    />
                    <Route 
                        path="/courses" 
                        element={
                            <CatalogPage />
                        } 
                    />
                    <Route 
                        path="/courses/:courseId" 
                        element={
                            <CoursePage />
                        } 
                    />
                    <Route 
                        path="/login" 
                        element={
                            <LoginPage />
                        } 
                    />
                    <Route 
                        path="/my-learning" 
                        element={
                            <ProtectedRoute>
                                <MyLearningPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="/courses/:courseId/progress"
                        element={
                            <ProtectedRoute>
                                <CourseProgressPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/courses/:courseId/lessons/:lessonId"
                        element={
                            <ProtectedRoute>
                                <LessonPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route 
                        path="/profile" 
                        element={
                            <ProtectedRoute>
                                <ProfilePage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route
                        path="/author/courses"
                        element={
                            <AuthorRoute>
                                <AuthorsCoursesPage />
                            </AuthorRoute>
                        }
                    />
                    <Route
                        path="/author/courses/:courseId/lessons/:lessonId/edit"
                        element={
                            <AuthorRoute>
                                <LessonEditorPage />
                            </AuthorRoute>
                        }
                    />
                    <Route
                        path="/admin"
                        element={
                            <AdminRoute>
                                <AdminPage />
                            </AdminRoute>
                        }
                    />
                    <Route
                        path="/about"
                        element={<AboutPage />}
                    />
                    <Route
                        path="*"
                        element={<NotFoundPage />}
                    />
                </Routes>
            </main>

            {pathname !== "/login" && <Footer />}
        </div>
    )
}

function App() {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    )
}

export default App