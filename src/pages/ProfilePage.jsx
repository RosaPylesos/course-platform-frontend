import { useEffect, useState } from "react"
import { 
    getUserTopics, 
    getTopics, 
    updateUserTopics,
} from "@/api/topics"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import EditProfileDialog from "@/components/profile/EditProfileDialog"
import TopicsDialog from "@/components/profile/TopicsDialog"

function ProfilePage() {
  const { user, token, loading, updateProfile } = useAuth()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [userTopics, setUserTopics] = useState([])
  const [topicsLoading, setTopicsLoading] = useState(true)
  const [topics, setTopics] = useState([])
  const [topicsTreeLoading, setTopicsTreeLoading] = useState(true)
  const [topicsDialogOpen, setTopicsDialogOpen] = useState(false)
  const [topicsSaving, setTopicsSaving] = useState(false)

  useEffect(() => {
    if (loading) return

    if (!user || !token) {
        setUserTopics([])
        setTopicsLoading(false)
        return
    }

    async function loadUserTopics() {
        try {
            setTopicsLoading(true)
            const data = await getUserTopics(token)
            setUserTopics(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setTopicsLoading(false)
        }
    }

    loadUserTopics()
  }, [user, token, loading])

  useEffect(() => {
    async function loadTopics() {
        try {
            setTopicsTreeLoading(true)
            const data = await getTopics()
            setTopics(data)
        } catch (err) {
            setError(err.message)
        } finally {
            setTopicsTreeLoading(false)
        }
    }

    loadTopics()
  }, [])

  if (loading) {
    return <p className="p-6">Загрузка...</p>
  }

  if (!user) {
    return <p className="p-6">Войдите в аккаунт, чтобы посмотреть профиль.</p>
  }

  const roleLabels = {
    student: "Студент",
    author: "Автор",
    admin: "Администратор",
  }

  async function handleSave(userData) {
    try {
      setSaving(true)
      setError("")
      setSuccess("")

      await updateProfile(userData)

      setDialogOpen(false)
      setSuccess("Данные профиля успешно обновлены.")
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleSaveTopics(topicIds) {
    try {
        setTopicsSaving(true)
        setError("")
        setSuccess("")

        await updateUserTopics(token, topicIds)

        const updatedTopics = await getUserTopics(token)
        setUserTopics(updatedTopics)

        setTopicsDialogOpen(false)
        setSuccess("Интересующие темы успешно обновлены.")
    } catch (err) {
        setError(err.message)
    } finally {
        setTopicsSaving(false)
    }}

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <h1 className="text-3xl font-bold">Мой профиль</h1>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold">Основная информация</h2>

          <Button onClick={() => {
            setError("")
            setSuccess("")
            setDialogOpen(true)
          }}>
            Изменить данные
          </Button>
        </div>

        <p>Имя: {user.name}</p>
        <p>Фамилия: {user.surname || "Не указана"}</p>
        <p>Почта: {user.email}</p>
        <p>Роль: {roleLabels[user.role] ?? user.role}</p>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold">
            Интересы и предпочтения
            </h2>

            <Button 
                variant="outline"
                onClick={() => setTopicsDialogOpen(true)}
            >
            Изменить темы
            </Button>
        </div>

        {topicsLoading ? (
            <p className="text-sm text-muted-foreground">
            Загрузка тем...
            </p>
        ) : userTopics.length > 0 ? (
            <div className="flex flex-wrap gap-2">
            {userTopics.map((topic) => (
                <Badge key={topic.id} variant="secondary">
                {topic.name}
                </Badge>
            ))}
            </div>
        ) : (
            <p className="text-sm text-muted-foreground">
            Вы пока не выбрали интересующие вас темы.
            </p>
        )}
        </section>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {success && (
        <p className="text-sm text-green-600">{success}</p>
      )}

      <EditProfileDialog
        user={user}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        saving={saving}
      />

      <TopicsDialog
        open={topicsDialogOpen}
        onOpenChange={setTopicsDialogOpen}
        topics={topics}
        selectedTopics={userTopics}
        onSave={handleSaveTopics}
        saving={topicsSaving}
       />
    </main>
  )
}

export default ProfilePage