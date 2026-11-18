import CatalogTopicTreeItem from "./CatalogTopicTreeItem"

function buildTopicTree(topics) {
    const topicMap = new Map()

    topics.forEach((topic) => {
        topicMap.set(topic.id, {
            ...topic,
            children: [],
        })
    })

    const roots = []

    topicMap.forEach((topic) => {
        if (topic.parent_id && topicMap.has(topic.parent_id)) {
            topicMap.get(topic.parent_id).children.push(topic)
        } else {
            roots.push(topic)
        }
    })

    return roots
}

function TopicFilter({ topics, value, onChange }) {
    const topicTree = buildTopicTree(topics ?? [])

    function toggleTopic(slug) {
        const selectedTopics = value || []

        if (selectedTopics.includes(slug)) {
            onChange(selectedTopics.filter((item) => item !== slug))
        } else {
            onChange([...selectedTopics, slug])
        }
    }

    return (
        <div className="w-full max-w-sm space-y-2">
            <h2 className="text-sm font-semibold">Тема курса</h2>

            <div className="space-y-3">
                {topicTree.map((topic) => (
                    <CatalogTopicTreeItem
                        key={topic.id}
                        topic={topic}
                        selectedTopics={value || []}
                        onToggle={toggleTopic}
                    />
                ))}
            </div>
        </div>
    )
}

export default TopicFilter