import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function EditProfileDialog({ user, open, onOpenChange, onSave, saving }) {
  const [name, setName] = useState(user.name ?? "")
  const [surname, setSurname] = useState(user.surname ?? "")

  useEffect(() => {
    if (open) {
      setName(user.name ?? "")
      setSurname(user.surname ?? "")
    }
  }, [open, user])

  async function handleSubmit(event) {
    event.preventDefault()
    await onSave({ name, surname: surname || null })
  }

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => {
        if (!saving) {
            onOpenChange(nextOpen)
        }
    }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
          <DialogDescription>
            Измените имя и фамилию. Остальные данные профиля останутся без изменений.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="profile-name">Имя</Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              minLength={1}
              maxLength={64}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profile-surname">Фамилия</Label>
            <Input
              id="profile-surname"
              value={surname}
              onChange={(event) => setSurname(event.target.value)}
              maxLength={64}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button type="submit">
              {saving ? "Сохранение" : "Сохранить"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileDialog