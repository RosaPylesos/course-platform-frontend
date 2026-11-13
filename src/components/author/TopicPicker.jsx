
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

import { ChevronDown, ChevronRight, Check } from "lucide-react"

function TopicPicker({ topics, value, onChange }) {
    const [open, setOpen] = useState(false)
    const [expandedTopics, setExpandedTopics] = useState([])

    const selectedTopic = findTopic(topics, value)

    function findTopic(items, id) {
        for (const topic of items) {
            if (topic.id === id) return topic

            const found = findTopic(topic.children || [], id)
            if (found) return found
        }

        return null
    }

    function toggleExpanded(topicId) {
        setExpandedTopics((current) =>
            current.includes(topicId)
                ? current.filter((id) => id !== topicId)
                : [...current, topicId]
        )
    }

    function selectTopic(topic) {
        onChange(topic)
        setOpen(false)
    }

    function renderTopics(items, level = 0) {
        return items.map((topic) => {
            const hasChildren = topic.children?.length > 0
            const isExpanded = expandedTopics.includes(topic.id)
            const isSelected = value === topic.id

            return (
                <div key={topic.id}>
                    <div className="flex items-center gap-1">
                        {hasChildren ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="size-7 shrink-0"
                                onClick={() => toggleExpanded(topic.id)}
                            >
                                {isExpanded ? (
                                    <ChevronDown />
                                ) : (
                                    <ChevronRight />
                                )}
                            </Button>
                        ) : (
                            <div className="size-7 shrink-0" />
                        )}

                        <Button
                            type="button"
                            variant="ghost"
                            className="h-8 flex-1 justify-start"
                            onClick={() => selectTopic(topic)}
                        >
                            <span className="truncate">{topic.name}</span>
                            {isSelected && (
                                <Check className="ml-auto size-4" />
                            )}
                        </Button>
                    </div>

                    {hasChildren && isExpanded && (
                        <div className="ml-4 border-l pl-2">
                            {renderTopics(topic.children, level + 1)}
                        </div>
                    )}
                </div>
            )
        })
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between font-normal"
                >
                    <span className="truncate">
                        {selectedTopic?.name || "Выберите тему"}
                    </span>
                    <ChevronDown className="ml-2 size-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
                <ScrollArea className="h-64">
                    <div className="space-y-1">
                        {renderTopics(topics)}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    )
}

export default TopicPicker
