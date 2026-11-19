import { useState } from "react"
import { publishCourse, archiveCourse, deleteCourse } from "@/api/courses"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

import {
    MoreVertical,
    Settings,
    Globe,
    Archive,
    Trash2,
} from "lucide-react"

import PublishCourseDialog from "./PublishCourseDialog"
import ArchiveCourseDialog from "./ArchiveCourseDialog"
import DeleteCourseDialog from "./DeleteCourseDialog"

function AuthorCourseActions({ course, onManage, token, onCourseUpdated }) {

    const [publishDialogOpen, setPublishDialogOpen] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)
    const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
    const [isArchiving, setIsArchiving] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    async function handlePublish() {
        if (isPublishing) return
        try {
            setIsPublishing(true)
            await publishCourse(course.id, token)
            setPublishDialogOpen(false)
            await onCourseUpdated?.()
        } catch (error) {
            console.error("Не удалось опубликовать курс:", error)
        } finally {
            setIsPublishing(false)
        }
    }

    async function handleArchive() {
        if (isArchiving) return
        try {
            setIsArchiving(true)
            await archiveCourse(course.id, token)
            setArchiveDialogOpen(false)
            await onCourseUpdated?.()
        } catch (error) {
            console.error("Не удалось архивировать курс:", error)
        } finally {
            setIsArchiving(false)
        }
    }

    async function handleDelete() {
        if (isDeleting) return
        try {
            setIsDeleting(true)
            await deleteCourse(course.id, token)
            setDeleteDialogOpen(false)
            await onCourseUpdated?.()
        } catch (error) {
            console.error("Не удалось удалить курс:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        aria-label="Дополнительные действия"
                    >
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="min-w-48">
                    <DropdownMenuItem onSelect={() => onManage?.(course)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Управлять курсом
                    </DropdownMenuItem>

                    {course.status === "draft" && (
                        <DropdownMenuItem onSelect={() => setPublishDialogOpen(true)}>
                            <Globe className="mr-2 h-4 w-4" />
                            Опубликовать
                        </DropdownMenuItem>
                    )}

                    {course.status === "published" && (
                        <DropdownMenuItem onSelect={() => setArchiveDialogOpen(true)}>
                            <Archive className="mr-2 h-4 w-4" />
                            Архивировать
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuSeparator />

                    <DropdownMenuItem 
                        variant="destructive"
                        onSelect={() => setDeleteDialogOpen(true)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Удалить
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <PublishCourseDialog
                open={publishDialogOpen}
                onOpenChange={setPublishDialogOpen}
                courseName={course.name}
                onConfirm={handlePublish}
                isPublishing={isPublishing}
            />
            <ArchiveCourseDialog
                open={archiveDialogOpen}
                onOpenChange={setArchiveDialogOpen}
                courseName={course.name}
                onConfirm={handleArchive}
                isArchiving={isArchiving}
            />
            <DeleteCourseDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                courseName={course.name}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
            />
        </>
    )
}

export default AuthorCourseActions