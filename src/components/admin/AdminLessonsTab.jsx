import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAdminLessons } from "@/api/admin"

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

function AdminLessonsTab() {
    const { token } = useAuth()

    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState("desc")

    const paginationPages = getPaginationPages(page, totalPages)

    useEffect(() => {
        async function loadLessons() {
            try {
                setLoading(true)
                setError(null)

                const data = await getAdminLessons({
                    token,
                    page,
                    sortBy,
                    sortOrder,
                })

                setLessons(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить уроки:", error)
                setError("Не удалось загрузить список уроков")
            } finally {
                setLoading(false)
            }
        }

        loadLessons()
    }, [token, page, sortBy, sortOrder])

    if (loading) {
        return <div>Загрузка уроков...</div>
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
                <Label htmlFor="sort-order">По убыванию</Label>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Название</TableHead>
                            <TableHead>ID курса</TableHead>
                            <TableHead>Описание</TableHead>
                            <TableHead>Позиция</TableHead>
                            <TableHead>Дата создания</TableHead>
                            <TableHead>Дата обновления</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {lessons.map((lesson) => (
                            <TableRow key={lesson.id}>
                                <TableCell>{lesson.name}</TableCell>
                                <TableCell>{lesson.course_id}</TableCell>
                                <TableCell>{lesson.description}</TableCell>
                                <TableCell>{lesson.position}</TableCell>
                                <TableCell>
                                    {new Date(lesson.created_at).toLocaleDateString("ru-RU")}
                                </TableCell>
                                <TableCell>
                                    {new Date(lesson.updated_at).toLocaleDateString("ru-RU")}
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

export default AdminLessonsTab