import { Checkbox } from "@/components/ui/checkbox"

const difficultyOptions = [
    {
        value: "beginner",
        label: "Начальный",
    },
    {
        value: "intermediate",
        label: "Средний",
    },
    {
        value: "advanced",
        label: "Продвинутый",
    },
]

function DifficultyFilter({ value, onChange }) {
    function handleChange(difficulty, checked) {
        if (checked) {
            onChange([...value, difficulty])
            return
        }

        onChange(
            value.filter((item) => item !== difficulty)
        )
    }

    return (
        <div className="space-y-3">
            <h2 className="text-sm font-semibold">
                Сложность
            </h2>

            <div className="space-y-2">
                {difficultyOptions.map((option) => {
                    const isChecked = value.includes(option.value)

                    return (
                        <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2 text-sm"
                        >
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) =>
                                    handleChange(option.value, checked === true)
                                }
                            />

                            {option.label}
                        </label>
                    )
                })}
            </div>
        </div>
    )
}

export default DifficultyFilter