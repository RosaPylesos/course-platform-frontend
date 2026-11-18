import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Checkbox } from "@/components/ui/checkbox"

function CatalogTopicTreeItem({ topic, selectedTopics, onToggle }) {
    const hasChildren = topic.children?.length > 0
    const isSelected = selectedTopics.includes(topic.slug)

    return (
        <div className="flex items-start gap-2">
            <Checkbox
                checked={isSelected}
                onCheckedChange={() => onToggle(topic.slug)}
                className="mt-1"
            />

            <div className="min-w-0 flex-1">
                {hasChildren ? (
                    <Accordion type="multiple">
                        <AccordionItem value={topic.id} className="border-b-0">
                            <AccordionTrigger className="py-1 hover:no-underline">
                                <span className="text-sm font-normal">
                                    {topic.name}
                                </span>
                            </AccordionTrigger>

                            <AccordionContent>
                                <div className="ml-3 space-y-2 border-l pl-3">
                                    {topic.children.map((child) => (
                                        <CatalogTopicTreeItem
                                            key={child.id}
                                            topic={child}
                                            selectedTopics={selectedTopics}
                                            onToggle={onToggle}
                                        />
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                ) : (
                    <span className="text-sm">{topic.name}</span>
                )}
            </div>
        </div>
    )
}

export default CatalogTopicTreeItem