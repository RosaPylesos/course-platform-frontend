import { Checkbox } from "@/components/ui/checkbox"

function TopicTreeItem({
    topic,
    selectedIds,
    onToggle,
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Checkbox
                    id={`topic-${topic.id}`}
                    checked={selectedIds.has(topic.id)}
                    onCheckedChange={() => onToggle(topic.id)}
                />

                <label
                    htmlFor={`topic-${topic.id}`}
                    className="text-sm cursor-pointer"
                >
                    {topic.name}
                </label>
            </div>

            {topic.children?.length > 0 && (
                <div className="ml-6 space-y-2">
                    {topic.children.map((child) => (
                        <TopicTreeItem
                            key={child.id}
                            topic={child}
                            selectedIds={selectedIds}
                            onToggle={onToggle}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default TopicTreeItem