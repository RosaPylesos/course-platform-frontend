import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline } from "lucide-react"

const markOrder = ["bold", "italic", "underline"]

const markTags = {
    bold: "strong",
    italic: "em",
    underline: "u",
}

function TextBlockEditor({ content, onChange }) {
    const editorRef = useRef(null)
    const selectionRef = useRef(null)

    // Marks normalization between runs
    function normalizeRuns(runs) {
        const result = []

        runs.forEach((run) => {
            if (!run.content) return

            const marks = markOrder.filter(
                (mark) => run.marks?.includes(mark)
            )

            const previous = result[result.length - 1]

            if (
                previous &&
                JSON.stringify(previous.marks) === JSON.stringify(marks)
            ) {
                previous.content += run.content
            } else {
                result.push({
                    content: run.content,
                    marks,
                })
            }
        })

        return result
    }

    // HTML-nodes -> runs conversion
    function parseNodes(nodes, inheritedMarks = []) {
        const runs = []

        nodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent) {
                    runs.push({
                        content: node.textContent,
                        marks: inheritedMarks,
                    })
                }

                return
            }

            if (node.nodeType !== Node.ELEMENT_NODE) return

            const tag = node.tagName.toLowerCase()
            const marks = [...inheritedMarks]

            if (tag === "strong" || tag === "b") {
                marks.push("bold")
            }

            if (tag === "em" || tag === "i") {
                marks.push("italic")
            }

            if (tag === "u") {
                marks.push("underline")
            }

            runs.push(...parseNodes(node.childNodes, marks))
        })

        return normalizeRuns(runs)
    }

    // HTML building with approved tags only
    function renderRuns(runs) {
        const fragment = document.createDocumentFragment()

        normalizeRuns(runs).forEach((run) => {
            let node = document.createTextNode(run.content)

            run.marks.forEach((mark) => {
                const wrapper = document.createElement(markTags[mark])

                wrapper.appendChild(node)
                node = wrapper
            })

            fragment.appendChild(node)
        })

        editorRef.current.replaceChildren(fragment)
    }

    // DOM-Position -> Symbol Position translation
    function getTextOffset(node, offset) {
        const editor = editorRef.current

        if (!editor || !editor.contains(node)) return null

        const range = document.createRange()

        range.selectNodeContents(editor)
        range.setEnd(node, offset)

        return range.toString().length
    }

    function saveSelection() {
        const selection = window.getSelection()

        if (!selection || selection.rangeCount === 0) return

        const start = getTextOffset(
            selection.anchorNode,
            selection.anchorOffset
        )

        const end = getTextOffset(
            selection.focusNode,
            selection.focusOffset
        )

        if (start === null || end === null) return

        selectionRef.current = {
            start: Math.min(start, end),
            end: Math.max(start, end),
        }
    }

    // Getting DOM-Position by symbol number
    function getDomPoint(targetOffset) {
        const editor = editorRef.current
        const walker = document.createTreeWalker(
            editor,
            NodeFilter.SHOW_TEXT
        )

        let currentOffset = 0
        let node

        while ((node = walker.nextNode())) {
            const nextOffset = currentOffset + node.textContent.length

            if (targetOffset <= nextOffset) {
                return {
                    node,
                    offset: Math.max(0, targetOffset - currentOffset),
                }
            }

            currentOffset = nextOffset
        }

        return {
            node: editor,
            offset: editor.childNodes.length,
        }
    }

    function restoreSelection() {
        const saved = selectionRef.current

        if (!saved || !editorRef.current) return

        const start = getDomPoint(saved.start)
        const end = getDomPoint(saved.end)

        const range = document.createRange()

        range.setStart(start.node, start.offset)
        range.setEnd(end.node, end.offset)

        editorRef.current.focus()

        const selection = window.getSelection()
        selection.removeAllRanges()
        selection.addRange(range)

    }

    function handleInput() {
        if (!editorRef.current) return

        const runs = parseNodes(editorRef.current.childNodes)

        onChange({
            ...content,
            runs,
        })

        saveSelection()
    }

    // Line break w/o extra <div>
    function handleKeyDown(event) {
        if (event.key !== "Enter") return

        event.preventDefault()

        const selection = window.getSelection()

        if (!selection || !selection.rangeCount) return

        const range = selection.getRangeAt(0)

        range.deleteContents()

        const textNode = document.createTextNode("\n")

        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.collapse(true)

        selection.removeAllRanges()
        selection.addRange(range)

        handleInput()
    }

    // Formatting chosen range by symbols positions
    function applyMark(mark) {

        restoreSelection()

        const saved = selectionRef.current

        if (!saved || saved.start === saved.end) return

        const runs = parseNodes(editorRef.current.childNodes)

        const selectedRuns = []
        let position = 0

        runs.forEach((run) => {
            const runStart = position
            const runEnd = position + run.content.length

            if (runStart < saved.end && runEnd > saved.start) {
                selectedRuns.push(run)
            }

            position = runEnd
        })

        if (!selectedRuns.length) return

        // Unified action for selection
        const shouldRemove = selectedRuns.some(
            (run) => run.marks.includes(mark)
        )

        const updatedRuns = []
        position = 0

        runs.forEach((run) => {
            const runStart = position
            const runEnd = position + run.content.length

            const boundaries = [
                runStart,
                Math.max(runStart, Math.min(saved.start, runEnd)),
                Math.max(runStart, Math.min(saved.end, runEnd)),
                runEnd,
            ]

            const points = [...new Set(boundaries)].sort(
                (a, b) => a - b
            )

            for (let i = 0; i < points.length - 1; i++) {
                const start = points[i]
                const end = points[i + 1]

                if (start === end) continue

                const isSelected =
                    start >= saved.start && end <= saved.end

                let marks = [...run.marks]

                if (isSelected) {
                    marks = shouldRemove
                        ? marks.filter((item) => item !== mark)
                        : [...marks, mark]
                }

                updatedRuns.push({
                    content: run.content.slice(
                        start - runStart,
                        end - runStart
                    ),
                    marks,
                })
            }

            position = runEnd
        })

        const normalizedRuns = normalizeRuns(updatedRuns)

        renderRuns(normalizedRuns)

        onChange({
            ...content,
            runs: normalizedRuns,
        })

        restoreSelection()
    }

    // Initial loading and sync with outer data
    useEffect(() => {
        if (!editorRef.current) return

        const currentRuns = parseNodes(
            editorRef.current.childNodes
        )

        const nextRuns = normalizeRuns(content.runs ?? [])

        if (
            JSON.stringify(currentRuns) ===
            JSON.stringify(nextRuns)
        ) {
            return
        }

        renderRuns(nextRuns)
    }, [content.runs])

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-1 rounded-md border p-1">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Жирный"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyMark("bold")}
                >
                    <Bold className="size-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Курсив"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyMark("italic")}
                >
                    <Italic className="size-4" />
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Подчёркнутый"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => applyMark("underline")}
                >
                    <Underline className="size-4" />
                </Button>
            </div>

            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onMouseUp={saveSelection}
                onMouseDown={saveSelection}
                onKeyUp={saveSelection}
                onKeyDown={handleKeyDown}
                className="min-h-32 whitespace-pre-wrap rounded-md border px-3 py-2 text-sm leading-7 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                data-placeholder="Введите текст урока..."
            />
        </div>
    )
}

export default TextBlockEditor