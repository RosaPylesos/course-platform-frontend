import { useEffect, useState } from "react"
import CourseSection from "@/components/home/CourseSection"
import { getHomePage } from "@/api/home"
import { useAuth } from "@/contexts/AuthContext"

function HomePage() {
	const { token, loading: authLoading } = useAuth()

	const [sections, setSections] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		if (authLoading) return

		async function loadHomePage() {
			try {
				setLoading(true)
				setError("")

				const data = await getHomePage(token)
				setSections(data.sections)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		loadHomePage()
	}, [token, authLoading])

	if (authLoading || loading) {
		return <p>Загрузка...</p>
	}

	if (error) {
		return <p className="text-destructive">{error}</p>
	}

	if (sections.length === 0) {
		return <p>Пока нет доступных курсов.</p>
	}

	return (
		<main className="mx-auto max-w-7xl space-y-8 px-6 py-8">
			<h1 className="text-3xl font-bold">Главная страница</h1>

			{sections.map((section) => (
				<CourseSection
					key={section.topic.id}
					topic={section.topic}
					courses={section.courses}
				/>
			))}
		</main>
	)
}

export default HomePage