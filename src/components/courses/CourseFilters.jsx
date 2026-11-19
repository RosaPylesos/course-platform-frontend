import CourseSearch from "./CourseSearch"
import DifficultyFilter from "./DifficultyFilter"
import TopicFilter from "./TopicFilter"
import AuthorFilter from "./AuthorFilter"
import TagFilter from "./TagFilter"

import { Button } from "@/components/ui/button"

function CourseFilters({
    search,
    onSeachChange,
    difficulties,
    onDifficultiesChange,
    topics,
    selectedTopics,
    onTopicChange,
    authors,
    selectedAuthors,
    onAuthorsChange,
    tagCategories,
    selectedTags,
    onTagsChange,
    onResetFilters,
}) {
    return (
        <div className="mb-8 space-y-6">
            <CourseSearch
                value={search}
                onChange={onSeachChange}
            />

            <DifficultyFilter
                value={difficulties}
                onChange={onDifficultiesChange}
            />

            <AuthorFilter
                authors={authors}
                value={selectedAuthors}
                onChange={onAuthorsChange}
            />

            <TagFilter
                categories={tagCategories}
                value={selectedTags}
                onChange={onTagsChange}
            />

            <TopicFilter
                topics={topics}
                value={selectedTopics}
                onChange={onTopicChange}
            />

            <Button
                variant="outline"
                className="w-full"
                onClick={onResetFilters}
            >
                Сбросить фильтры
            </Button>
        </div>
    )
}

export default CourseFilters