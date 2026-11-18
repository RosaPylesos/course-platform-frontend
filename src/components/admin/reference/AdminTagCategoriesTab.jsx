import {
    createAdminTagCategory,
    updateAdminTagCategory,
    deleteAdminTagCategory
} from "@/api/admin"
import ReferenceFormDialog from "./dialogs/ReferenceFormDialog"
import ReferenceDeleteDialog from "./dialogs/ReferenceDeleteDialog"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAdminTagCategories } from "@/api/admin"
import { getPaginationPages } from "@/utils/getPaginationPages"

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

function AdminTagCategoriesTab() {
    const { token } = useAuth()

    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [formMode, setFormMode] = useState("create")
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedCategoryForDelete, setSelectedCategoryForDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)

    const paginationPages = getPaginationPages(page, totalPages)

    function handleCreate() {
        setFormMode("create")
        setSelectedCategory(null)
        setIsFormOpen(true)
    }

    function handleEdit(category) {
        setFormMode("edit")
        setSelectedCategory(category)
        setIsFormOpen(true)
    }

    async function handleSaveCategory(formData) {
        try {
            setIsSubmitting(true)

            const categoryData = {
                name: formData.name,
            }

            if (formMode === "create") {
                await createAdminTagCategory(categoryData, token)
            } else {
                await updateAdminTagCategory(
                    selectedCategory.id,
                    categoryData,
                    token
                )
            }

            setIsFormOpen(false)
            setSelectedCategory(null)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось сохранить категорию:", error)
            setError("Не удалось сохранить категорию")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleDelete(category) {
        setDeleteError(null)
        setSelectedCategoryForDelete(category)
        setIsDeleteOpen(true)
    }

    async function handleConfirmDelete() {
        try {
            setIsDeleting(true)

            await deleteAdminTagCategory(selectedCategoryForDelete.id, token)

            setIsDeleteOpen(false)
            setSelectedCategoryForDelete(null)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось удалить категорию:", error)
            setDeleteError(
                "Не удалось удалить категорию. Возможно, с ней связаны теги."
            )
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoading(true)
                setError(null)

                const data = await getAdminTagCategories({
                    token,
                    page,
                })

                setCategories(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить категории:", error)
                setError("Не удалось загрузить список категорий")
            } finally {
                setLoading(false)
            }
        }

        loadCategories()
    }, [token, page, refreshKey])

    if (loading) {
        return <div>Загрузка категорий...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }

    return (
        <>
            <div className="flex justify-end my-2">
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить категорию
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.id}</TableCell>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(category)}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
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
            <ReferenceFormDialog
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                mode={formMode}
                title={
                    formMode === "create"
                        ? "Создание категории"
                        : "Редактирование категории"
                }
                initialData={{
                    name: selectedCategory?.name ?? "",
                }}
                fields={[
                    {
                        name: "name",
                        label: "Название",
                        placeholder: "Введите название категории",
                    },
                ]}
                onSubmit={handleSaveCategory}
                isSubmitting={isSubmitting}
            />
            <ReferenceDeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Удаление категории"
                description={`Вы действительно хотите удалить категорию «${selectedCategoryForDelete?.name ?? ""}»? Это действие нельзя отменить.`}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                error={deleteError}
            />
        </>
    )
}

export default AdminTagCategoriesTab