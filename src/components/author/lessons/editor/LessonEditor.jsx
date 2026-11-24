import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { getLesson, updateLesson } from "@/api/lessons"
import { DndContext, closestCenter } from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Pencil } from "lucide-react"

import EditorLayout from "./EditorLayout"
import EditorHeader from "./EditorHeader"
import BlockPalette from "./palette/BlockPalette"
import SortableBlock from "./canvas/SortableBlock"
import DroppableCanvas from "./canvas/DroppableCanvas"
import BlockInsertionZone from "./canvas/BlockInsertionZone"
import LessonDetailsDialog from "./canvas/LessonDetailsDialog"
import ExitEditorDialog from "./ExitEditorDialog"
import BlockRenderer from "./canvas/BlockRenderer"

function LessonEditor() {

    const navigate = useNavigate()

    const { courseId, lessonId } = useParams()
    const { token } = useAuth()

    const [lesson, setLesson] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [blocks, setBlocks] = useState([])
    const [activeDragSource, setActiveDragSource] = useState(null)
    const [lessonName, setLessonName] = useState("")
    const [lessonDescription, setLessonDescription] = useState("")
    const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [saveError, setSaveError] = useState("")
    const [isExitDialogOpen, setIsExitDialogOpen] = useState(false)
    const [isPreview, setIsPreview] = useState(false)

    function getInitialBlockContent(type) {
        switch (type) {
            case "heading":
                return { text: "Новый заголовок", level: 2 }

            case "text":
                return {
                    runs: [{ content: "Новый текст", marks: [] }],
                }

            case "image":
                return { url: "", alt: "Описание изображения", caption: "" }

            case "video":
                return { url: "", caption: "" }

            case "callout":
                return { variant: "info", text: "Новая заметка" }

            case "code":
                return { language: "javascript", code: "" }

            default:
                return null
        }
    }

    function createBlock(type) {
        return {
            id: crypto.randomUUID(),
            type,
            content: getInitialBlockContent(type),
        }
    }

    function addBlock(type, index) {
        const newBlock = createBlock(type)

        setBlocks((currentBlocks) => {
            const nextBlocks = [...currentBlocks]
            nextBlocks.splice(index ?? nextBlocks.length, 0, newBlock)
            return nextBlocks
        })
    }

    function handleDragStart(event) {
        setActiveDragSource(event.active.data.current?.source ?? null)
    }

    function handleDragEnd(event) {
        const { active, over } = event

        try {
            if (!over) return

            const source = active.data.current?.source

            // Dragging from Block Palette
            if (source === "palette") {
                const type = active.data.current?.type

                // Dropping on Insertion Zone
                if (over.data.current?.source === "insertion") {
                    addBlock(type, over.data.current.index)
                    return
                }

                // Dropping on existing block
                const targetIndex = blocks.findIndex(
                    (block) => block.id === over.id
                )

                if (targetIndex === -1) {
                    addBlock(type)
                    return
                }

                const overRect = over.rect
                const activeRect = active.rect.current.translated

                if (!activeRect) return

                const pointerY = activeRect.top + activeRect.height / 2
                const middleY = overRect.top + overRect.height / 2

                const insertIndex =
                    pointerY < middleY ? targetIndex : targetIndex + 1

                addBlock(type, insertIndex)
                return
            }

            // Block Sorting
            if (source === "canvas") {
                if (active.id === over.id) return

                setBlocks((currentBlocks) => {
                    const oldIndex = currentBlocks.findIndex(
                        (block) => block.id === active.id
                    )
                    const newIndex = currentBlocks.findIndex(
                        (block) => block.id === over.id
                    )

                    if (oldIndex === -1 || newIndex === -1) {
                        return currentBlocks
                    }

                    return arrayMove(currentBlocks, oldIndex, newIndex)
                })
            }
        } finally {
            setActiveDragSource(null)
        }
    }

    function handleDragCancel() {
        setActiveDragSource(null)
    }

    function updateBlockContent(blockId, content) {
        setBlocks((currentBlocks) =>
            currentBlocks.map((block) =>
                block.id === blockId
                    ? { ...block, content }
                    : block
            )
        )
    }

    function deleteBlock(blockId) {
        setBlocks((currentBlocks) =>
            currentBlocks.filter((block) => block.id !== blockId)
        )
    }

    function validateBlocks() {
        for (const [index, block] of blocks.entries()) {
            const blockNumber = index + 1
            const content = block.content

            switch (block.type) {
                case "heading" :
                    if (!content.text?.trim()) {
                        return `Блок ${blockNumber}: заполните заголовок.`
                    }
                    break
                
                case "text":
                    if (!content.runs?.some((run) => run.content?.trim())) {
                        return `Блок ${blockNumber}: добавьте текст.`
                    }
                    break
                
                case "image":
                    if (!content.url?.trim()) {
                        return `Блок ${blockNumber}: укажите URL изображения.`
                    }
                    if (!content.alt?.trim()) {
                        return `Блок ${blockNumber}: добавьте описание изобраежния.`
                    }
                    break
                
                case "video":
                    if (!content.url?.trim()) {
                        return `Блок ${blockNumber}: укажите URL видео.`
                    }
                    break

                case "callout":
                    if (!content.text?.trim()) {
                        return `Блок ${blockNumber}: заполните текст заметки.`
                    }
                    break

                case "code":
                    if (!content.language?.trim()) {
                        return `Блок ${blockNumber}: укажите язык программирования.`
                    }
                    break
            }
        }

        return null
    }

    async function handleSave() {
        setIsSaving(true)
        setSaveError("")

        const validationError = validateBlocks()

        if (validationError) {
            setSaveError(validationError)
            setIsSaving(false)
            return false
        }

        try {
            const updatedLesson = await updateLesson(
                courseId,
                lessonId,
                {
                    name: lessonName,
                    description: lessonDescription,
                    content: {
                        version: 1,
                        blocks
                    },
                },
                token,
            )

            setLesson(updatedLesson)
            return true
        } catch (error) {
            console.error("Не удалось сохранить урок:", error)
            setSaveError(error.message || "Не удалось сохранить урок")
            return false
        } finally {
            setIsSaving(false)
        }
    }

    function handleExit() {
        if (hasUnsavedChanges) {
            setIsExitDialogOpen(true)
            return
        }

        navigate("/author/courses")
    }

    async function handleSaveAndExit() {
        const isSaved = await handleSave()

        if (isSaved) {
            setIsExitDialogOpen(false)
            navigate("/author/courses")
        }
    }

    function handleExitWithoutSaving() {
        setIsExitDialogOpen(false)
        navigate("/author/courses")
    }

    useEffect(() => {
        async function loadLesson() {
            setIsLoading(true)
            setError("")

            try {
                const data = await getLesson(token, courseId, lessonId)
                setLesson(data)
                setLessonName(data.name ?? "")
                setLessonDescription(data.description ?? "")
                setBlocks(data.content?.blocks ?? [])
            } catch (error) {
                console.error("Не удалось загрузить урок:", error)
                setError(error.message || "Не удалось загрузить урок")
            } finally {
                setIsLoading(false)
            }
        }

        if (token && courseId && lessonId) {
            loadLesson()
        }
    }, [token, courseId, lessonId])

    if (isLoading) return <div>Загрузка урока...</div>
    if (error) return <div className="text-destructive">{error}</div>
    if (!lesson) return <div>Урок не найден.</div>

    const hasUnsavedChanges = 
        lessonName !== (lesson.name ?? "") ||
        lessonDescription !== (lesson.description ?? "") ||
        JSON.stringify(blocks) !== JSON.stringify(lesson.content?.blocks ?? [])

    return (
        <>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <EditorLayout
                    header={
                        <EditorHeader
                            lessonName={lessonName}
                            onSave={handleSave}
                            onPreview={() => setIsPreview((current) => !current)}
                            onExit={handleExit}
                            hasUnsavedChanges={hasUnsavedChanges}
                            isSaving={isSaving}
                            saveError={saveError}
                            isPreview={isPreview}
                        />
                    }
                    palette={
                        isPreview ? null : <BlockPalette onAddBlock={addBlock}/>
                    }
                    canvas={
                        isPreview ? (
                            <div className="mx-auto w-full max-w-4xl px-6 py-8">
                                <div className="mb-6">
                                    <h2 className="text-xl font-semibold">
                                        {lessonName}
                                    </h2>

                                    {lessonDescription && (
                                        <p className="mt-2 text-muted-foreground">
                                            {lessonDescription}
                                        </p>
                                    )}
                                </div>

                                <BlockRenderer 
                                    blocks={blocks} 
                                    isPreview
                                />
                            </div>
                        ) : (
                            <DroppableCanvas>
                                <div className="mx-auto max-w-4xl">
                                    <div className="mb-6">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-xl font-semibold">
                                                {lessonName}
                                            </h2>

                                            <button
                                                type="button"
                                                onClick={() => setIsDetailsDialogOpen(true)}
                                                className="rounded p-2 text-muted-foreground hover:bg-muted"
                                                aria-label="Редактировать данные урока"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                        </div>

                                        {lessonDescription && (
                                            <p className="mt-2 text-muted-foreground">
                                                {lessonDescription}
                                            </p>
                                        )}
                                    </div>

                                    <SortableContext
                                        items={blocks.map((block) => block.id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            <BlockInsertionZone 
                                                index={0} 
                                                disabled={activeDragSource === "canvas"}
                                            />

                                            {blocks.map((block, index) => (
                                                <div key={block.id}>
                                                    <SortableBlock 
                                                        key={block.id}
                                                        block={block} 
                                                        onUpdate={updateBlockContent}
                                                        onDelete={deleteBlock}
                                                    />
                                                    <BlockInsertionZone 
                                                        index={index + 1} 
                                                        disabled={activeDragSource === "canvas"}
                                                    />
                                                </div>
                                            ))}

                                            {blocks.length === 0 && (
                                                <p className="py-8 text-center text-muted-foreground">
                                                    Добавьте первый блок в урок.
                                                </p>
                                            )}
                                        </div>
                                    </SortableContext>
                                </div>
                            </DroppableCanvas>
                        )
                    }
                />
            </DndContext>
            <LessonDetailsDialog
                open={isDetailsDialogOpen}
                onOpenChange={setIsDetailsDialogOpen}
                name={lessonName}
                description={lessonDescription}
                onNameChange={setLessonName}
                onDescriptionChange={setLessonDescription}
            />
            <ExitEditorDialog
                open={isExitDialogOpen}
                onOpenChange={setIsExitDialogOpen}
                onSaveAndExit={handleSaveAndExit}
                onExitWithoutSaving={handleExitWithoutSaving}
            />
        </>
    )
}

export default LessonEditor