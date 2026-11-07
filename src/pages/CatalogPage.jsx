import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCourses } from "@/api/courses"
import { getCourseFilters } from "@/api/courseFilters"
import CourseGrid from "@/components/courses/CourseGrid"

function CatalogPage() {
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

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true)
        setError(null)

        const data = await getCourses({ 
          page,
          search: debouncedSearch || undefined,
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
  }, [page, debouncedSearch])

  useEffect(() => {
    async function loadFilters() {
      try {
        const data = await getCourseFilters()
        setFilters(data)
      } catch (err) {
        console.error("Не удалось загрузить фильтры: ", err)
      }
    }

    loadFilters()
  }, [])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(search.trim())
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Каталог курсов</h1>
        <p className="mt-2 text-muted-foreground">
          Выберите курс и начните изучать что-то новое.
        </p>
      </div>

      <div className="mb-8">
        <Input
          type="search"
          placeholder="Поиск курсов..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

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