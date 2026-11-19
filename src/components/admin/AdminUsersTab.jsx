import { useEffect, useState } from "react"
import { getAdminUsers, assignUserAsAuthor } from "@/api/admin"
import { useAuth } from "@/contexts/AuthContext"

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

import AssignAuthorDialog from "./AssignAuthorDialog"
import AdminUsersActions from "./AdminUsersActions"
import { getPaginationPages } from "@/utils/getPaginationPages"

function AdminUsersTab() {
    const { token } = useAuth()

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [sortBy, setSortBy] = useState("created_at")
    const [sortOrder, setSortOrder] = useState("desc")
    const [selectedUser, setSelectedUser] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const paginationPages = getPaginationPages(page, totalPages)

    async function handleAssignAuthor() {
        if (!selectedUser) return

        try {
            setIsSubmitting(true)

            await assignUserAsAuthor(selectedUser.id, token)

            setSelectedUser(null)

            const data = await getAdminUsers({
                token,
                page,
                sortBy,
                sortOrder,
            })

            setUsers(data.items)
            setTotalPages(data.total_pages)
        } catch (error) {
            console.error("Не удалось назначить пользователя автором:", error)
            setError("Не уадлось назначить пользователя автором")
        } finally {
            setIsSubmitting(false)
        }
    }
    
    useEffect(() => {
        async function loadUsers() {
            try {
                setLoading(true)
                setError(null)

                const data = await getAdminUsers({ 
                    token, 
                    page,
                    sortBy,
                    sortOrder, 
                })
                setUsers(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить пользователей:", error)
                setError("Не удалось загрузить пользователей")
            } finally {
                setLoading(false)
            }
        }

        loadUsers()
    }, [token, page, sortBy, sortOrder])

    if (loading) {
        return <div>Загрузка пользователей...</div>
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
                            Дате регистрации
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
                            <TableHead>Имя</TableHead>
                            <TableHead>Фамилия</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Роль</TableHead>
                            <TableHead>Дата</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.surname}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    {new Date(user.created_at).toLocaleDateString("ru-RU")}
                                </TableCell>
                                <TableCell>
                                    {user.role === "student" && (
                                        <AdminUsersActions
                                            user={user}
                                            onAssignAuthor={setSelectedUser}
                                        />
                                    )}
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
            <AssignAuthorDialog
                open={Boolean(selectedUser)}
                onOpenChange={(open) => {
                    if (!open) setSelectedUser(null)
                }}
                user={selectedUser}
                isSubmitting={isSubmitting}
                onConfirm={handleAssignAuthor}
            />
        </>

    )
}

export default AdminUsersTab