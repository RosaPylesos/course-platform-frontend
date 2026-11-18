import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
    getAdminTags,
    createAdminTag,
    updateAdminTag,
    deleteAdminTag
} from "@/api/admin"
import { getPublicTagCategories } from "@/api/tag_categories"
import { getPaginationPages } from "@/utils/getPaginationPages"
import { Plus, Pencil, Trash2 } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
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
import ReferenceFormDialog from "./dialogs/ReferenceFormDialog"
import ReferenceDeleteDialog from "./dialogs/ReferenceDeleteDialog"

function AdminTagsTab() {
    const { token } = useAuth()

    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [categories, setCategories] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [refreshKey, setRefreshKey] = useState(0)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [formMode, setFormMode] = useState("create")
    const [selectedTag, setSelectedTag] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedTagForDelete, setSelectedTagForDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState("")

    const paginationPages = getPaginationPages(page, totalPages)

    function handleCreate() {
        setFormMode("create")
        setSelectedTag(null)
        setIsFormOpen(true)
    }

    function handleEdit(tag) {
        setFormMode("edit")
        setSelectedTag(tag)
        setIsFormOpen(true)
    }

    async function handleSaveTag(formData) {
        try {
            setIsSubmitting(true)
            setError(null)

            const tagData = {
                name: formData.name.trim(),
                tag_category_id: formData.tag_category_id,
            }

            if (formMode === "create") {
                await createAdminTag(tagData, token)
            } else {
                await updateAdminTag(selectedTag.id, tagData, token)
            }

            setIsFormOpen(false)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось сохранить тег:", error)
            setError("Не удалось сохранить тег")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleDelete(tag) {
        setSelectedTagForDelete(tag)
        setDeleteError(null)
        setIsDeleteOpen(true)
    }

    async function handleConfirmDelete() {
        try {
            setIsDeleting(true)
            setDeleteError(null)

            await deleteAdminTag(selectedTagForDelete.id, token)

            setIsDeleteOpen(false)
            setSelectedTagForDelete(null)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось удалить тег:", error)
            setDeleteError("Не удалось удалить тег")
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        async function loadTags() {
            try {
                setLoading(true)
                setError(null)

                const data = await getAdminTags({
                    token,
                    page,
                    tagCategoryId: selectedCategoryId || undefined,
                })

                setTags(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить теги:", error)
                setError("Не удалось загрузить список тегов")
            } finally {
                setLoading(false)
            }
        }

        loadTags()
    }, [token, page, refreshKey, selectedCategoryId])

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await getPublicTagCategories()
                setCategories(data)
            } catch (error) {
                console.error("Не удалось загрузить категории тегов:", error)
            }
        }

        loadCategories()
    }, [])

    const formFields = [
        {
            name: "name",
            label: "Название тега",
            placeholder: "Введите название",
        },
        {
            name: "tag_category_id",
            label: "Категория",
            type: "select",
            placeholder: "Выберите категорию",
            options: categories.map((category) => ({
                value: category.id,
                label: category.name,
            })),
        },
    ]

    if (loading) {
        return <div>Загрузка тегов...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }

    return (
        <>
            <div className="flex items-center justify-between pb-3">
                <Select
                    value={selectedCategoryId || "all"}
                    onValueChange={(value) => {
                        setSelectedCategoryId(value === "all" ? "" : value)
                        setPage(1)
                    }}
                >
                    <SelectTrigger className="w-[240px]">
                        <SelectValue placeholder="Фильтр по категории" />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Все категории</SelectItem>

                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button size="sm" onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить тег
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>ID категории</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tags.map((tag) => (
                            <TableRow key={tag.id}>
                                <TableCell>{tag.id}</TableCell>
                                <TableCell>{tag.name}</TableCell>
                                <TableCell>{tag.slug}</TableCell>
                                <TableCell>{tag.tag_category_id}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(tag)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(tag)}
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
                title={formMode === "create" ? "Создание тега" : "Редактирование тега"}
                initialData={
                    selectedTag
                        ? {
                            name: selectedTag.name,
                            tag_category_id: selectedTag.tag_category_id,
                        }
                        : {
                            name: "",
                            tag_category_id: "",
                        }
                }
                fields={formFields}
                onSubmit={handleSaveTag}
                isSubmitting={isSubmitting}
            />
            <ReferenceDeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Удалить тег?"
                description={
                    selectedTagForDelete
                        ? `Вы действительно хотите удалить тег «${selectedTagForDelete.name}»?`
                        : "Вы действительно хотите удалить этот тег?"
                }
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                error={deleteError}
            />
        </>
    )
}

export default AdminTagsTab