import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAdminTopics } from "@/api/admin"
import { getPaginationPages } from "@/utils/getPaginationPages"
import {
    createAdminTopic,
    updateAdminTopic,
    deleteAdminTopic,
} from "@/api/admin"
import { getTopics } from "@/api/topics"

import ReferenceFormDialog from "./dialogs/ReferenceFormDialog"
import ReferenceDeleteDialog from "./dialogs/ReferenceDeleteDialog"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"

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

function AdminTopicsTab() {
    const { token } = useAuth()

    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const [isFormOpen, setIsFormOpen] = useState(false)
    const [formMode, setFormMode] = useState("create")
    const [selectedTopic, setSelectedTopic] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [refreshKey, setRefreshKey] = useState(0)
    const [topicTree, setTopicTree] = useState([])
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [selectedTopicForDelete, setSelectedTopicForDelete] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [deleteError, setDeleteError] = useState(null)

    const paginationPages = getPaginationPages(page, totalPages)

    const excludedTopicIds = selectedTopic
        ? getDescendantIds(topicTree, selectedTopic.id)
        : new Set()

    const availableTopicTree = filterTopicTree(
        topicTree, excludedTopicIds
    )

    function getDescendantIds(topics, topicId) {
        const ids = new Set()

        function findAndCollect(items) {
            for (const topic of items) {
                if (topic.id === topicId) {
                    collectChildren(topic)
                    return true
                }

                if (findAndCollect(topic.children || [])) {
                    return true
                }
            }

            return false
        }

        function collectChildren(topic) {
            ids.add(topic.id)

            for (const child of topic.children || []) {
                collectChildren(child)
            }
        }

        findAndCollect(topics)

        return ids
    }

    function filterTopicTree(topics, excludedIds) {
        return topics
            .filter((topic) => !excludedIds.has(topic.id))
            .map((topic) => ({
                ...topic,
                children: filterTopicTree(topic.children || [], excludedIds),
            }))
    }

    async function handleCreate() {
        try {
            const data = await getTopics()
            setTopicTree(data)

            setFormMode("create")
            setSelectedTopic(null)
            setIsFormOpen(true)
        } catch (error) {
            console.error("Ошибка загрузки тем:", error)
            setError("Не удалось загрузить список тем")
        }
    }

    async function handleEdit(topic) {
        try {
            const data = await getTopics()
            setTopicTree(data)

            setFormMode("edit")
            setSelectedTopic(topic)
            setIsFormOpen(true)
        } catch (error) {
            console.error("Ошибка загрузки тем:", error)
            setError("Не удалось загрузить список тем")
        }
    }

    async function handleSaveTopic(formData) {
        try {
            setIsSubmitting(true)

            const topicData = {
                name: formData.name,
                parent_id: formData.parent_id === "none"
                    ? null
                    : formData.parent_id || null,
            }

            if (formMode === "create") {
                await createAdminTopic(topicData, token)
            } else {
                await updateAdminTopic(selectedTopic.id, topicData, token)
            }

            setIsFormOpen(false)
            setSelectedTopic(null)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось сохранить тему:", error)
            setError("Не удалось сохранить тему")
        } finally {
            setIsSubmitting(false)
        }
    }

    function handleDelete(topic) {
        setSelectedTopicForDelete(topic)
        setIsDeleteOpen(true)
        setDeleteError(null)
    }

    async function handleConfirmDelete() {
        try {
            setIsDeleting(true)

            await deleteAdminTopic(selectedTopicForDelete.id, token)

            setIsDeleteOpen(false)
            setSelectedTopicForDelete(null)
            setRefreshKey((current) => current + 1)
        } catch (error) {
            console.error("Не удалось удалить тему:", error)
            setDeleteError("Не удалось удалить тему Возможно, с ней связаны дочерние темы или курсы.")
        } finally {
            setIsDeleting(false)
        }
    }

    useEffect(() => {
        async function loadTopics() {
            try {
                setLoading(true)
                setError(null)

                const data = await getAdminTopics({
                    token,
                    page,
                })

                setTopics(data.items)
                setTotalPages(data.total_pages)
            } catch (error) {
                console.error("Не удалось загрузить темы:", error)
                setError("Не удалось загрузить список тем")
            } finally {
                setLoading(false)
            }
        }

        loadTopics()
    }, [token, page, refreshKey])

    if (loading) {
        return <div>Загрузка тем...</div>
    }

    if (error) {
        return <div className="text-destructive">{error}</div>
    }

    return (
        <>
            <div className="flex justify-end my-2">
                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Добавить тему
                </Button>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Название</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>ID родительской темы</TableHead>
                            <TableHead />
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {topics.map((topic) => (
                            <TableRow key={topic.id}>
                                <TableCell>{topic.id}</TableCell>
                                <TableCell>{topic.name}</TableCell>
                                <TableCell>{topic.slug}</TableCell>
                                <TableCell>{topic.parent_id ?? "—"}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(topic)}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => handleDelete(topic)}
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
                title={formMode === "create" ? "Создание темы" : "Редактирование темы"}
                initialData={{
                    name: selectedTopic?.name ?? "",
                    parent_id: selectedTopic?.parent_id
                        ? String(selectedTopic.parent_id)
                        : "none",
                }}
                fields={[
                    {
                        name: "name",
                        label: "Название",
                        placeholder: "Введите название темы",
                    },
                    {
                        name: "parent_id",
                        label: "Родительская тема",
                        type: "topic-picker",
                        topics: availableTopicTree,
                    },
                ]}
                onSubmit={handleSaveTopic}
                isSubmitting={isSubmitting}
            />
            <ReferenceDeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                title="Удаление темы"
                description={`Вы действительно хотите удалить тему «${selectedTopicForDelete?.name ?? ""}»? Это действие нельзя отменить.`}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                error={deleteError}
            />
        </>
    )
}

export default AdminTopicsTab