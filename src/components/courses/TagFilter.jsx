import { Checkbox } from "@/components/ui/checkbox"

function TagFilter({ categories, value, onChange }) {
  function handleChange(categoryId, tagId, checked) {
    const currentTags = value[categoryId] || []

    const updatedTags = checked
      ? [...currentTags, tagId]
      : currentTags.filter((id) => id !== tagId)

    const updatedValue = { ...value }

    if (updatedTags.length > 0) {
      updatedValue[categoryId] = updatedTags
    } else {
      delete updatedValue[categoryId]
    }

    onChange(updatedValue)
  }

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold">
        Теги
      </h2>

      {categories.map((category) => (
        <div key={category.id} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            {category.name}
          </h3>

          <div className="space-y-2">
            {category.tags.map((tag) => {
              const isChecked = (
                value[category.id] || []
              ).includes(tag.id)

              return (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      handleChange(
                        category.id,
                        tag.id,
                        checked === true
                      )
                    }
                  />

                  {tag.name}
                </label>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TagFilter
