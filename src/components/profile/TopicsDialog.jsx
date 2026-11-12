import { useEffect, useState } from "react"
import TopicTreeItem from "./TopicTreeItem"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function filterTopics(topics, query) {
    const normalizedQuery = query.trim().toLowerCase()

    if (!normalizedQuery) return topics

    return topics.reduce((result, topic) => {
        if (topic.name.toLowerCase().includes(normalizedQuery)) {
            result.push(topic)
            return result
        }

        const filteredChildren = filterTopics(
            topic.children ?? [],
            normalizedQuery
        )

        if (filteredChildren.length > 0) {
            result.push({
                ...topic,
                children: filteredChildren,
            })
        }

        return result
    }, [])
}

function TopicsDialog({
    open,
    onOpenChange,
    topics,
    selectedTopics,
    onSave,
    saving,
}) {
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [searchQuery, setSearchQuery] = useState("")

    const filteredTopics = filterTopics(topics, searchQuery)

    useEffect(() => {
        if (open) {
            setSelectedIds(
                new Set(selectedTopics.map((topic) => topic.id))
            )
        }
    }, [open, selectedTopics])

    function toggleTopic(topicId) {
        setSelectedIds((previous) => {
            const next = new Set(previous)

            if (next.has(topicId)) {
                next.delete(topicId)
            } else {
                next.add(topicId)
            }

            return next
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Выбор интересующих тем</DialogTitle>
                    <DialogDescription>
                        Выберите темы, которые вам интересны.
                        Можно выбирать как основные темы, так и их подразделы независимо друг от друга.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder="Поиск по темам..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                >
                </Input>

                <div className="max-h-[60vh] space-y-4 overflow-y-auto py-2">
                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic) => (
                            <TopicTreeItem
                                key={topic.id}
                                topic={topic}
                                selectedIds={selectedIds}
                                onToggle={toggleTopic}
                            />
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            Темы не найдены.
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={saving}
                    >
                        Отмена
                    </Button>

                    <Button
                        type="button"
                        disabled={saving}
                        onClick={() => onSave([...selectedIds])}
                    >
                        {saving ? "Сохранение..." : "Сохранить"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

}

export default TopicsDialog