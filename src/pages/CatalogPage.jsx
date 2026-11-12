import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import CourseFilters from "@/components/courses/CourseFilters"
import { getCourses } from "@/api/courses"
import { getCourseFilters } from "@/api/courseFilters"
import CourseGrid from "@/components/courses/CourseGrid"

function CatalogPage() {
  const [searchParams] = useSearchParams()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({
    authors: [],
    topics: [],
    tag_categories: [],
    difficulties: [],
  })
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [difficulties, setDifficulties] = useState([])
  const [debouncedDifficulties, setDebouncedDifficulties] = useState([])
  const [selectedTopics, setSelectedTopics] = useState([])
  const [debouncedTopics, setDebouncedTopics] = useState([])
  const [includeDescendants, setIncludeDescendants] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState([])
  const [debouncedAuthors, setDebouncedAuthors] = useState([])
  const [selectedTags, setSelectedTags] = useState({})
  const [debouncedTags, setDebouncedTags] = useState({})
  const [filtersLoaded, setFiltersLoaded] = useState(false)
  const [contextTopicId, setContextTopicId] = useState(null)

  function handleResetFilters() {
    setSearch("")
    setDifficulties([])
    setSelectedTopics([])
    setSelectedAuthors([])
    setSelectedTags({})
    setPage(1)
  }

  useEffect(() => {

    if (!filtersLoaded) return
    async function loadCourses() {
      try {
        setLoading(true)
        setError(null)

        const selectedTagSlugs = filters.tag_categories.flatMap(
          (category) => {
            const selectedIds = debouncedTags[category.id] || []

            return category.tags
              .filter((tag) => selectedIds.includes(tag.id))
              .map((tag) => tag.slug)
          }
        )

        const data = await getCourses({ 
          page,
          search: debouncedSearch || undefined,
          difficulties: debouncedDifficulties,
          topics: debouncedTopics,
          includeDescendants: includeDescendants,
          authorIds: debouncedAuthors,
          tags: selectedTagSlugs.length
          ? selectedTagSlugs.join(",")
          :undefined,
        })
        setCourses(data.items)
        setTotalPages(data.total_pages)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [
    page, 
    debouncedSearch, 
    debouncedDifficulties, 
    debouncedTopics, 
    debouncedAuthors,
    debouncedTags,
    includeDescendants,
    // filters.tag_categories,
    // filters.topics,
  ])

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getCourseFilters({
          topicId: contextTopicId,
        })
        setFilters(data)
        setFiltersLoaded(true)
      } catch (err) {
        console.error("Не удалось загрузить фильтры: ", err)
      }
    }

    loadFilters()
  }, [contextTopicId])

useEffect(() => {
  if (!filtersLoaded) return

  const topicId = searchParams.get("topic")
  const shouldIncludeDescendants =
    searchParams.get("include_descendants") === "true"

  setContextTopicId(topicId)
  setIncludeDescendants(topicId ? shouldIncludeDescendants : false)

  setSelectedTopics([])
}, [filtersLoaded, searchParams])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim())
      setDebouncedDifficulties(difficulties)
      setDebouncedTopics(selectedTopics)
      setDebouncedAuthors(selectedAuthors)
      setDebouncedTags(selectedTags)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [
    search,
    difficulties, 
    selectedTopics, 
    selectedAuthors,
    selectedTags,
  ])

  useEffect(() => {
    setPage(1)
  }, [
    debouncedSearch, 
    debouncedAuthors,
    debouncedDifficulties,
    debouncedTags,
    debouncedTopics,
  ])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог курсов</h1>
        <p className="mt-2 text-muted-foreground">
          Выберите курс и начните изучать что-то новое.
        </p>
      </div>

      <CourseFilters
        search={search}
        onSeachChange={setSearch}
        difficulties={difficulties}
        onDifficultiesChange={setDifficulties}
        topics={filters.topics}
        selectedTopics={selectedTopics}
        onTopicChange={setSelectedTopics}
        authors={filters.authors}
        selectedAuthors={selectedAuthors}
        onAuthorsChange={setSelectedAuthors}
        tagCategories={filters.tag_categories}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        onResetFilters={handleResetFilters}
      />

      {loading && (
        <p className="py-12 text-center text-muted-foreground">
          Загружаем курсы...
        </p>
      )}

      {!loading && error && (
        <p className="py-12 text-center text-destructive">
          Не удалось загрузить курсы: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <CourseGrid courses={courses} />

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                disabled={page === 1 || loading}
                onClick={() => setPage((current) => current - 1)}
              >
                Назад
              </Button>

              <span className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </span>

              <Button
                variant="outline"
                disabled={page === totalPages || loading}
                onClick={() => setPage((current) => current + 1)}
              >
                Вперёд
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}

export default CatalogPage