import { Checkbox } from "@/components/ui/checkbox"

function AuthorFilter({ authors, value, onChange }) {
  function handleChange(authorId, checked) {
    if (checked) {
      onChange([...value, authorId])
      return
    }

    onChange(value.filter((id) => id !== authorId))
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">
        Авторы
      </h2>

      <div className="max-h-48 space-y-2 overflow-y-auto">
        {authors.map((author) => {
          const isChecked = value.includes(author.id)
          const fullName = [
            author.name,
            author.surname,
          ].filter(Boolean).join(" ")

          return (
            <label
              key={author.id}
              className="flex cursor-pointer items-center gap-2 text-sm"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) =>
                  handleChange(author.id, checked === true)
                }
              />

              {fullName}
            </label>
          )
        })}
      </div>
    </div>
  )
}

export default AuthorFilter