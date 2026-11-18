import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAdminCourses } from "@/api/admin"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { getPaginationPages } from "@/utils/getPaginationPages"

function AdminCoursesTab() {
    const { token } = useAuth()

    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState("desc")

    const paginationPages = getPaginationPages(page, totalPages)

    useEffect(() => {
        async function loadCourses() {
            try {
                setLoading(true)
                setError("")

                const data = await getAdminCourses({
                    token,
                    page,
                    sortBy,
                    sortOrder,
                })

                setCourses(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить курсы:", error)
                setError("Не удалось загрузить список курсов")
            } finally {
                setLoading(false)
            }
        }

        loadCourses()
    }, [token, page, sortBy, sortOrder])

    if (loading) {
        return <div>Загрузка курсов...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }

    return (
        <>
            <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                    Сортировать по:
                </span>

                <Select
                    value={sortBy}
                    onValueChange={(value) => {
                        setSortBy(value)
                        setPage(1)
                    }}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="created_at">
                            Дате создания
                        </SelectItem>
                        <SelectItem value="updated_at">
                            Дате обновления
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center gap-2 my-2">
                <Switch
                    id="sort-order"
                    checked={sortOrder === "desc"}
                    onCheckedChange={(checked) => {
                        setSortOrder(checked ? "desc" : "asc")
                        setPage(1)
                    }}
                />
                <Label htmlFor="sort-order">
                    По убыванию
                </Label>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Название</TableHead>
                            <TableHead>ID автора</TableHead>
                            <TableHead>ID темы</TableHead>
                            <TableHead>Статус</TableHead>
                            <TableHead>Сложность</TableHead>
                            <TableHead>Дата создания</TableHead>
                            <TableHead>Дата обновления</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.id}>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.author_id}</TableCell>
                                <TableCell>{course.topic_id}</TableCell>
                                <TableCell>{course.status}</TableCell>
                                <TableCell>{course.difficulty}</TableCell>
                                <TableCell>
                                    {new Date(course.created_at).toLocaleDateString("ru-RU")}
                                </TableCell>
                                <TableCell>
                                    {new Date(course.updated_at).toLocaleDateString("ru-RU")}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-muted-foreground">
                    Страница {page} из {totalPages}
                </p>

                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                text="Назад"
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault()
                                    setPage((current) => Math.max(1, current - 1))
                                }}
                                aria-disabled={page <= 1}
                                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>

                        {paginationPages.map((pageNumber, index) => (
                            <PaginationItem key={`${pageNumber}-${index}`}>
                                {pageNumber === "..." ? (
                                    <PaginationEllipsis />
                                ) : (
                                    <PaginationLink
                                        href="#"
                                        isActive={pageNumber === page}
                                        onClick={(event) => {
                                            event.preventDefault()
                                            setPage(pageNumber)
                                        }}
                                    >
                                        {pageNumber}
                                    </PaginationLink>
                                )}
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                text="Далее"
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault()
                                    setPage((current) => Math.min(totalPages, current + 1))
                                }}
                                aria-disabled={page >= totalPages}
                                className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>

    )
}

export default AdminCoursesTab