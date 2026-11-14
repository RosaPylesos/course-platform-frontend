import { useEffect, useState } from "react"
import { getMyCourses, getMyCourse } from "@/api/courses"
import { useAuth } from "@/contexts/AuthContext"
import { getTopics } from "@/api/topics"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
} from "@/components/ui/pagination"
import CreateCourseDialog from "@/components/author/CreateCourseDialog"
import EmptyCourses from "@/components/author/EmptyCourses"
import AuthorCourseCard from "@/components/author/AuthorCourseCard"
import EmptyCourseCategory from "@/components/author/EmptyCourseCategory"
import ManageCourseDialog from "@/components/author/ManageCourseDialog"

function AuthorsCoursesPage() {
    const { token } = useAuth()

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [topics, setTopics] = useState([])
    const [status, setStatus] = useState("all")
    const [statusCounts, setStatusCounts] = useState({
        draft: 0,
        published: 0,
        archived: 0,
    })
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalCourses, setTotalCourses] = useState(0)
    const [selectedCourse, setSelectedCourse] = useState(null)
    const [courseLoading, setCourseLoading] = useState(false)
    const [courseError, setCourseError] = useState(null)
    const [manageDialogOpen, setManageDialogOpen] = useState(false)

    function handleStatusChange(nextStatus) {
        setStatus(nextStatus)
        setPage(1)
    }

    async function loadCourses() {
        try {
            setError(null)
            const data = await getMyCourses({ 
                token,
                page,
                status: status === "all" ? undefined : status,
            })
            setCourses(data.items)
            setTotalCourses(data.total)
            setTotalPages(data.total_pages)
            setStatusCounts(data.status_counts)
        } catch (error) {
            console.error("Не удалось загрузить курсы автора:", error)
            setError("Не удалось загрузить список курсов")
        } finally {
            setLoading(false)
        }
    }

    async function handleManageCourse(course) {
        try {
            setCourseError(null)
            setCourseLoading(true)
            setSelectedCourse(null)

            const data = await getMyCourse(course.id, token)
            setSelectedCourse(data)
            setManageDialogOpen(true)
        } catch (error) {
            console.error("Не удалось загрузить курс:", error)
            setCourseError("Не удалось загрузить данные курса")
        } finally {
            setCourseLoading(false)
        }
    }

    useEffect(() => {
        if (token) {
            loadCourses()
        }
    }, [token, status, page])

    useEffect(() => {
        async function loadTopics() {
            try {
                const data = await getTopics()
                setTopics(data)
            } catch (error) {
                console.error("Не удалось загрузить темы:", error)
            }
        }

        loadTopics()
    }, [])

    if (loading) return <p>Загрузка курсов...</p>
    if (error) return <p>{error}</p>
    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-6 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">
                    Мои курсы
                </h1>

                <Button onClick={() => setCreateDialogOpen(true)}>
                    Создать курс
                </Button>
            </div>

            <Tabs value={status} onValueChange={handleStatusChange}>
                <TabsList>
                    <TabsTrigger value="all">
                        Все ({statusCounts.draft + statusCounts.published + statusCounts.archived})
                    </TabsTrigger>

                    <TabsTrigger value="draft">
                        Черновики ({statusCounts.draft})
                    </TabsTrigger>

                    <TabsTrigger value="published">
                        Опубликованные ({statusCounts.published})
                    </TabsTrigger>

                    <TabsTrigger value="archived">
                        Архив ({statusCounts.archived})
                    </TabsTrigger>
                </TabsList>
            </Tabs>

            {courses.length === 0 ? (
                status === "all" ? (
                    <EmptyCourses
                        onCreateClick={() => setCreateDialogOpen(true)}
                    />
                ) : (
                    <EmptyCourseCategory status={status} />
                )
            ) : (
                <>
                    <p className="mb-4 text-sm text-muted-foreground">
                        Показано {(page - 1) * 16 + 1}–{(page - 1) * 16 + courses.length} из {totalCourses} курсов
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {courses.map((course) => (
                            <AuthorCourseCard
                                key={course.id}
                                course={course}
                                onManage={handleManageCourse}
                            />
                        ))}
                    </div>
                </>

            )}
            {totalPages > 1 && (
                <Pagination className="mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setPage((current) => Math.max(1, current - 1))}
                                className={page === 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, index) => index + 1).map((pageNumber) => (
                            <PaginationItem key={pageNumber}>
                                <PaginationLink
                                    isActive={page === pageNumber}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}

            <CreateCourseDialog
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                topics={topics}
                onCourseCreated={loadCourses}
            />
            <ManageCourseDialog
                open={manageDialogOpen}
                onOpenChange={setManageDialogOpen}
                course={selectedCourse}
                topics={topics}
                onCourseUpdated={loadCourses}
            />
        </div>
    )
}

export default AuthorsCoursesPage